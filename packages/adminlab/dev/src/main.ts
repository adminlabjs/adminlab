import { createApp } from 'vue'
import App from './App.vue'
import { adminlab, quasarOptions, useElementPlus } from "./plugins";
import { Quasar } from "quasar";
import { defineConfig } from "../../src";
import { QuasarAdapter, ElementPlusAdapter } from "adminlab";

const app = createApp(App);
app.use(adminlab, defineConfig({
	framework: "quasar",
	adapters: [new QuasarAdapter({
		defaultColumn: {
			align: "left"
		}
	}), new ElementPlusAdapter()],
	componentProps: {
		global: {
			Progress: {
				color: "warning",
				rounded: true,
				stripe: true,
				size: "10px",
			},
		},
		table: {
			Progress: {
				size: "10px"
			},
			Button: {
				size: "sm",
			},
			Dropdown: {
				size: "sm",
			}
		},
		searcher: {
			Input: {
				dense: true,
			}
		},
		toolbar: {
			Button: {
				// size: "sm",
				outline: true,
			}
		},
		formDialog: {
			Input: {
				dense: true,
			}
		}
	},
	modules: {
		table: {
			maxButtonCount: 0,
			avatar: {
				size: 20,
			}
		},
		searcher: {
			clearable: true,
		},
		formDialog: {
			clearable: true,
		}
	},
})).use(Quasar, quasarOptions).use(useElementPlus);

app.mount('#app')
