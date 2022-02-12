import { ComponentType } from "adminlab";
import { capitalize } from "vue";
import { getComponents, isCustomComponent } from "./components";

export class ElementPlusAdapter implements FrameworkAdapter {
  public isSupportedComponent(component: any, type: string) {
    if (isCustomComponent(component)) return true;

    type = type.toLowerCase();
    const name = component.name || "";

    type = capitalize(type);

    return name === `El${type}`;
  }

  public isSupportedFramework(name: string) {
    return name === "element-plus";
  }

  public getComponent(type: ComponentType) {
    const component = getComponents()[type];
    if (component) {
      return component.get();
    }
  }

  useComponent(componentType: ComponentType, options: Record<string, any>) {
    const component = getComponents()[componentType];
    if (component && component.use) {
      return component.use(options);
    }
  }
}
