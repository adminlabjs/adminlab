import type { App } from "vue"
import ElementPlus from "element-plus"
import * as ElIcon from "@element-plus/icons-vue";
import "element-plus/dist/index.css"

export const useElementPlus = (app: App) => {
  app.use(ElementPlus)

  Object.values(ElIcon).forEach(component => {
    app.component(component.name, component);
  })
}
