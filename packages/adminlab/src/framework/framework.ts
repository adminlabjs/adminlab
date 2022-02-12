import { h, isVNode } from "vue";
import type { Slots } from "vue";
import { getProps } from "@/adminlab";
import { isObject, mergeObject } from "@/utils";
import { QuasarAdapter, ElementPlusAdapter } from "./adapters";
import type { InstallationOptions } from "@/adminlab";

export enum ComponentType {
  Table = "Table",
  Pagination = "Pagination",
  Form = "Form",
  Button = "Button",
  Dialog = "Dialog",
  Select = "Select",
  Input = "Input",
  // Icon = "Icon",
  Tag = "Tag",
  // TimePicker = "TimePicker",
  DatePicker = "DatePicker",
  Row = "Row",
  Col = "Col",
  Dropdown = "Dropdown",
  DropdownItem = "DropdownItem",
  ColorPicker = "ColorPicker",
  Progress = "Progress",
  Switch = "Switch",
  Image = "Image",
  RadioGroup = "RadioGroup",
}

export type Components = Partial<Record<ComponentType, any>>;

class Framework {
  public installed = false;

  private frameworkName = "";
  private components: Components = {};
  private cache: Partial<
    Record<
      ComponentType,
      {
        component: any;
        adapter?: FrameworkAdapter;
      }
    >
  > = {};
  private adapters: FrameworkAdapter[] = [];
  private messageTimer: Record<string, ReturnType<typeof setTimeout>> = {};

  public install(opts: InstallationOptions) {
    if (this.installed) return;

    const { framework, components = {}, adapters = [] } = opts;
    this.frameworkName = framework;
    this.components = components;

    if (adapters.length) {
      this.adapters = adapters;
    } else {
      this.adapters = [
        new QuasarAdapter(),
        new ElementPlusAdapter(),
      ]
    }

    this.installed = true;
  }

  /**
   * 方法接收一个VNode或者Vue组件
   * (如果是VNode会将其对应组件提取出来)
   * 用于判断该组件是否有合适的适配器
   */
  public isSupportedComponent(component: any, type: ComponentType) {
    return !!this.getAdapterByComponent(component, type);
  }

  /**
   * 接收组件类型以及相关参数
   * 返回对应组件以及对应组件适配后的属性
   */
  public useComponent(type: ComponentType, options: IObject) {
    options = Object.assign({}, options || {});
    options.props = mergeObject(getProps(type), options.props || {});

    const cache = this.cache[type];
    let component = cache ? cache.component : this.components[type];
    let adapter: FrameworkAdapter | undefined = cache?.adapter;

    let props = options;
    let slots: Slots = {};

    if (typeof component === "string" || !component) {
      const frameworkName = component || this.frameworkName;
      adapter = this.getFrameworkAdapter(frameworkName);
      if (adapter) {
        component = adapter.getComponent(type);
      }
      if (!component || !adapter) {
        this.warn(`[adminlab]: 未找到类型为 ${type} 的组件以及适配器`);
        return {
          component: h("div"),
        };
      }
    } else {
      if (!adapter) {
        adapter = this.getAdapterByComponent(component, type);
      }
    }

    if (!cache) {
      this.cache[type] = {
        component,
        adapter,
      };
    } else if (!cache.adapter) {
      if (adapter) {
        cache.adapter = adapter;
      }
    }

    if (adapter) {
      const result = adapter.useComponent(type, options || {});
      if (!result) {
        this.warn(`[adminlab]: 未提供 ${type} 的组件参数`);
      } else {
        if (isObject(result.props)) props = result.props;
        if (isObject(result.slots)) slots = result.slots;
      }
    } else {
      this.warn(`[adminlab]: 未找到 ${type} 组件适配器`);
    }

    return {
      component,
      props,
      slots,
    };
  }

  public makeNode(type: ComponentType, options: IObject) {
    const { component, props, slots } = this.useComponent(type, options);
    return h(component, props, slots);
  }

  /**
   * 方法接收一个Vue组件
   * 用于寻找支持该组件的适配器
   */
  public getAdapterByComponent(component: any, type: ComponentType) {
    if (isVNode(component)) {
      component = component.type;
    }
    return this.adapters.find((adapter) =>
      adapter.isSupportedComponent(component, type)
    );
  }

  /**
   * 用于寻找支持该框架的适配器
   */
  private getFrameworkAdapter(frameworkName: string) {
    return this.adapters.find((adapter) =>
      adapter.isSupportedFramework(frameworkName)
    );
  }

  private warn(message: string) {
    clearTimeout(this.messageTimer[message]);
    this.messageTimer[message] = setTimeout(() => {
      console.warn(message);
    }, 300);
  }
}

export const framework = new Framework();

export const install = (opts: InstallationOptions) => {
  framework.install(opts);
};
