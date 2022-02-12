import type { App } from "vue";
import { RegisterComponents } from "./components";
import { useAdminlab, useQuasar, useElementPlus } from "./plugins";
import { QuasarAdapter, ElementPlusAdapter } from "adminlab";

export * from "./layout";

export const initClient = (app: App) => {
  app.use(RegisterComponents);
  app.use(useQuasar);
  app.use(useElementPlus);

  app.use((app) => useAdminlab(app, {
    framework: "quasar",
    adapters: [new QuasarAdapter({
      defaultColumn: {
        align: "left",
      }
    }), new ElementPlusAdapter()],
    componentProps: {
      table: {
        Image: {
          "spinner-size": "16px",
        }
      }
    }
  }));
};
