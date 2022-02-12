import type { App } from "vue";
import { Quasar, LoadingBar, Notify, Loading } from "quasar";
// import lang from "quasar/lang/zh-CN.js";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/mdi-v5/mdi-v5.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import "quasar/dist/quasar.css";

export const useQuasar = (app: App) => {
  const opts = {
    // lang: lang,
    plugins: {
      Notify,
      LoadingBar,
      Loading
    },
    config: {
      Notify,
      LoadingBar: {
        skipHijack: true,
      }
    },
  };

  app.use(Quasar, opts, {
    req: {
      headers: {},
    },
  });
};
