import DefaultTheme from "vitepress/dist/client/theme-default";
import { initClient, DocLayout } from "../client";
import "./styles/index.scss";

export default {
	...DefaultTheme,
	Layout: DocLayout,
	enhanceApp: ({app}) => initClient(app),
}
