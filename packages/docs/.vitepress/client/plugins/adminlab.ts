import type { App } from "vue";
import { Adminlab, defineConfig } from "adminlab";
import "adminlab/dist/adminlab.css";

export const useAdminlab = (app: App, opts: ReturnType<typeof defineConfig>) => {
	app.use(Adminlab, opts)
}
