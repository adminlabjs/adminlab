import * as path from "path";
import * as fs from "fs";

export const SidebarGeneratorPlugin = (opts: { root: string }) => {
  const { root } = opts;
  const dirName = root.split("/").pop();

  const process = (dir: string) => {
    const children = fs.readdirSync(dir);
    const ret: any[] = [];

    children.forEach((child) => {
      const filepath = dir + "/" + child;

      if (child.endsWith(".md")) {
        // markdown
        let text = child;
        const content = fs.readFileSync(filepath, "utf-8");
        let firstLineContent = content.split("\n")[0] || "";
        firstLineContent = firstLineContent.replace(/[#| ]/g, "");
        if (firstLineContent) text = firstLineContent;
        ret.push({
          text,
          link: filepath
            .replace(".md", ".html")
            .replace(root, "/" + dirName),
        });
      } else {
        ret.push({
          text: child,
          children: process(filepath),
        });
      }
    });

    return ret;
  };

  return process(root);
};
