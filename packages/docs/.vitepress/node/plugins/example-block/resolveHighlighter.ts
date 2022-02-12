// ref: https://github.com/vuepress/vuepress-next/blob/main/packages/%40vuepress/plugin-prismjs/src/node/prismjsPlugin.ts

import * as Prism from 'prismjs'
import rawLoadLanguages from 'prismjs/components/index'
loadLanguages(['markup', 'css', 'javascript', 'typescript']);

// prevent warning messages
// @ts-ignore ts wrongly report it as a read-only property
// eslint-disable-next-line no-import-assign
rawLoadLanguages.silent = true

export const highlighter = (code: string, type: string) => {
	let lang = "markup";

	if (type === "style") lang = "css";
	if (type === "ts" || type === "js" || type === "bash") {
		lang = type;
	}
	// if (type === "template") lang = "markup";
	// if (type === "script") lang = "javascript";
	// if (type === "style") lang = "css";

	if (!Prism.languages[lang]) {
		loadLanguages([lang]);
	}

	return Prism.highlight(code, Prism.languages[lang], lang);
}

function loadLanguages(languages: string[]): void {
  const langsToLoad = languages.filter((item) => !Prism.languages[item])
  if (langsToLoad.length) {
    rawLoadLanguages(langsToLoad)
  }
}
