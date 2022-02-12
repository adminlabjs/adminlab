import type { App } from "vue";
import * as components from "./components";

export default {
	install: (app: App) => {
		Object.entries(components).forEach(item => {
			const [key, component] = item;
			const name = key || component.name;

			if (name) {
				app.component(name, component);
			}
		})
	}
}
