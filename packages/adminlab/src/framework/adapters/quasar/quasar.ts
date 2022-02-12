import { ComponentType } from "adminlab";
import { capitalize } from "vue";
import { getComponents, isCustomComponent } from "./components";

export interface QuasarAdapterOptions {
  defaultColumn?: Record<string, any>;
}

export class QuasarAdapter implements FrameworkAdapter {
  constructor(private options?: QuasarAdapterOptions) {}

  public isSupportedComponent(component: any, componentType: ComponentType) {
    if (isCustomComponent(component)) return true;

    let type = componentType.toLowerCase();

    const name = component.name || "";
    if (type === "button") {
      type = "Btn";
    } else if (type === "tag") {
      type = "Chip";
    } else if (type === "progress") {
      type = "LinearProgress";
    } else if (type === "switch") {
      type = "Toggle";
    } else {
      type = capitalize(type);
    }
    return name === `Q${type}`;
  }

  public isSupportedFramework(name: string) {
    return name === "quasar";
  }

  public getComponent(type: ComponentType) {
    const component = getComponents()[type];
    if (component) {
      return component.get();
    }
  }

  public useComponent(type: ComponentType, options: Record<string, any>) {
    const component = getComponents()[type];
    if (component && component.use) {
      return component.use(options, this.options);
    }
  }
}
