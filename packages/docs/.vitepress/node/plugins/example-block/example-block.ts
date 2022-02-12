import MarkdownIt from "markdown-it";
import mdContainer from "markdown-it-container";

import * as fs from "fs";
import * as path from "path";
import { highlighter } from "./resolveHighlighter";

const supported = ["vue", "ts", "js"] as const;

interface Opts {
  root: string;
  wrap: (type: typeof supported[number], code?: boolean) => string;
  api: {
    component: string;
    data: Record<string, any>;
  }
}

const toHTML = (type: string, content: string) => {
  return encodeURIComponent(highlighter(content, type));
};

export const ExampleBlockPlugin = (md: MarkdownIt, opts: Opts) => {
  const { root, wrap, api } = opts;

  md.use(mdContainer, "vue", {
    validate(params) {
      return /^(vue|ts|js|css)$/.test(params.trim());
    },

    render(tokens, idx) {
      // @ts-ignore
      const hoistedTags = md.__data.hoistedTags || (md.__data.hoistedTags = []);
      let { nesting, info } = tokens[idx];
      info = info.trim();

      let component = "";

      if (nesting === 1) {
        component = wrap(info);
        const token = tokens[idx + 2];
        const filename = `${token.content}.${info}`;
        const filepath = path.resolve(root, filename);
        const source = fs.readFileSync(filepath, "utf-8");

        if (info === "vue") {
          const { template, script, style } = parse(
            source,
            (str: string, type: string) => {
              return highlighter(str, type);
            }
          );

          const dir = '../../examples'
          const filepath = `${dir}/${filename}`;
          if (!hoistedTags.find((tag) => tag.indexOf("script setup") > -1)) {
            hoistedTags.push(`<script setup>
                        const files = import.meta.globEager('../../examples/**/*.vue')
                    </script>`);
          }

          return `<${component} template="${template}" script="${script}" :components="files" path="${filepath}">`;
        } else {
          return `<${component} type="${info}" html="${toHTML(info, source)}">`;
        }
      }

      component = wrap(tokens[idx - 4].info.trim());
      return `</${component}>`;
    },
  });

  md.use(mdContainer, "api", {
    validate(params) {
      return params.trim().startsWith("api-");
    },

    render(tokens, idx) {
      let { nesting, info } = tokens[idx];
      info = info.trim();

      if (nesting === 1) {
        const type = info.split("-")[1];
        const token = tokens[idx + 2];
        const content = token ? token.content : "";
        
        let data = (api.data[content] || {})[type] || [];
        data = encodeURIComponent(JSON.stringify(data));

        return `<${api.component} data="${data}" type="${type}">`;
      }

      return `</${api.component}>`
    }
  })

  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const { info, content } = token;

    if ([...supported, "bash"].includes(info as any)) {
      const component = wrap(info as any, true);
      if (component) {
        return `<${component} type="${info}" html="${toHTML(
          info,
          content
        )}"></${component}>`;
      }
    } else {
      return fence(tokens, idx, options, env, self);
    }
  };
};

type ParseTarget = "template" | "script" | "style";

function parse(content: string, callback: (string, type) => string) {
  const match = (type: ParseTarget) => {
    const result = parseTemplate(type, content);
    if (result) return encodeURIComponent(callback(result.trim(), type));
    return "";
  };

  return {
    template: match("template"),
    script: match("script"),
    style: match("style"),
  };
}

function parseTemplate(target: ParseTarget, template: string) {
  const string = `(<${target}.*?>([\\s\\S]+?)<\\/${target}>)`,
    regex = new RegExp(string),
    parsed = template.match(regex);

  return parsed ? parsed[0] : "";
}
