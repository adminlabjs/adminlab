import type { App } from "vue";
import type { Components, ComponentType } from "@/framework";
import { install as initFramework } from "@/framework";
import * as components from "@/components";
import "./class/index.less";
import { version as adminlabVersion } from "../package.json";

export const modules = [
  "global",
  "table",
  "formDialog",
  "searcher",
  "toolbar",
] as const;

export type ComponentProps = Record<
  typeof modules[number],
  Partial<Record<keyof typeof ComponentType, Record<string, any>>>
>;

type InternalComponentOptions = Partial<{
  classes: string;
  style: Record<string, any>;
}>;

export interface InstallationOptions {
  /**
   * 描述用户使用的是哪个UI框架
   * 将根据该框架去渲染对应的组件
   * 内部已支持：Vuetify Quasar ElementPlus
   */
  framework: string;
  /**
   * 优先级最高的组件指定方式
   * 比如：已指定Vuetify为基础UI框架，但是Table组件想用ElementPlus的
   * 这时候就可以在这里指定Button组件
   */
  components?: Components;
  /**
   * 适配器，用于适配一套新UI框架或者某些自定义组件
   */
  adapters?: FrameworkAdapter[];
  /**
   * 全局|模块组件属性
   * formDialog="editor"+"creator"
   */
  componentProps?: Partial<ComponentProps>;
  /**
   *
   */
  modules?: Partial<{
    table: Partial<{
      // 超过规定数量将自动将多出的部分折叠, 0为不限制
      maxButtonCount: number;
      avatar: {
        size?: number | string;
        componentProps?: IObject;
      };
      color: InternalComponentOptions;
    }>;
    searcher: Partial<{
      clearable: boolean;
    }>;
    formDialog: Partial<{
      clearable: boolean;
    }>
  }>;
}

let installed = false;

export let installationOptions: Omit<InstallationOptions, "componentProps"> & {
  componentProps: Required<ComponentProps>;
};

const processOptions = (opts: InstallationOptions) => {
  opts = Object.assign({}, opts || {});
  const props = opts.componentProps || (opts.componentProps = {});

  modules.forEach((key) => {
    if (!props[key]) {
      props[key] = {};
    }
  });

  return opts as typeof installationOptions;
};

export const install = (app: App, opts: InstallationOptions) => {
  if (installed) {
    return;
  }

  opts = opts || {};

  if (!opts.framework) {
    console.error(`[Adminlab]: \`framework\` is unavailable`);
  }

  app.config.globalProperties.$adminlab = {
    version: `${adminlabVersion}`,
  };

  Object.values(components).forEach((component) =>
    app.component(component.name, component)
  );

  installationOptions = processOptions(opts);
  initFramework(opts);
  installed = true;
};

export const defineConfig = (options: InstallationOptions) => options;

export const defineColumns = <T>(columns: TableColumn<T>[]) => {
  return columns;
};

export type ModuleType = Exclude<typeof modules[number], "global"> | "";
let currentModule: ModuleType;

export const setCurrentModule = (module: ModuleType) => {
  currentModule = module;
};

export const getCurrentModule = () => {
  return currentModule;
};

export const getProps = (type: ComponentType) => {
  const module = getCurrentModule();
  const props = installationOptions.componentProps as ComponentProps;

  const { global = {} } = props;

  const moduleProps = module ? props[module] || {} : {};

  return {
    ...(global[type] || {}),
    ...(moduleProps[type] || {}),
  };
};
