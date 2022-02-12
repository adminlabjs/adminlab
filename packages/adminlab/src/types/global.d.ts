import type { Slot, Slots, VNode, DirectiveArguments } from "vue";
import type { InstallationOptions, modules } from "../adminlab";
import type { ComponentType } from "../framework";
import type { breakpoints } from "@/composables";

export { InstallationOptions, ComponentType };

declare global {
  type IObject<K extends keyof any = string, T = any> = Record<K, T>;
  type RuleType =
    | Exclude<typeof modules[number], "global" | "formDialog" | "toolbar">
    | "creator"
    | "editor";

  export interface FrameworkAdapter {
    isSupportedComponent: (component: any, type: ComponentType) => boolean;
    isSupportedFramework: (name: string) => boolean;
    getComponent: (type: ComponentType) => any;
    useComponent: (
      type: ComponentType,
      options: Record<string, any>
    ) => {
      props?: Record<string, any>;
      slots?: Slots;
      directives?: DirectiveArguments;
    } | undefined;
  }

  type DefineType =
    | "link"
    | "date"
    | "datetime"
    | "image"
    | "avatar"
    | "color"
    | "progress"
    | "switch";

  type ActionConfig = {
    searchable: boolean;
    editable: boolean;
    creatable: boolean;
  };

  type FieldFormType = "select" | "radio" | "input";

  type MapConfig<T = any> = {
    type: "text" | "status";
    options: {
      label: string;
      value: any;
      icon?: string;
      color?: string; // 只针对于table展示时
      textColor?: string; // 只针对于table展示时
      props?: (type: RuleType) => IObject;
    }[];
    loadOptions: LoadOptions<T>;
    dependsOn: string;
    formType: FieldFormType | ((from: RuleType) => FieldFormType);
  };

  type TemplateParser = (
    parse: <T extends string>(
      template: T | T[]
    ) => Record<
      T extends Array<string> ? T[number] : T,
      VNode | VNode[] | undefined
    >
  ) => VNode | VNode[];

  type PlainTemplate =
    | string
    | {
        children: PlainTemplate | PlainTemplate[];
        classes?: string;
        style?: IObject;
      };

  type Template = PlainTemplate | PlainTemplate[] | TemplateParser;

  export interface TableColumnCustom<T = any> {
    define: DefineType;
    name?: string;

    // 自定义label
    formatter: string | ((row: T, scope: any) => string);
    // 扩展项
    extension?: Partial<{
      // date | datetime 针对于表单
      range: boolean | ((from: Exclude<RuleType, "table">) => boolean);
      format: string;

      textarea: boolean;
    }>;
    action: Partial<ActionConfig>;
    transformer: (row: T, scope: any) => any;
    map: Partial<MapConfig<T>>;
    buttons: TableColumnButtons<T>;
    // doc: 在`from`为"table"时，row才会有内容
    props: (type: RuleType, row?: T) => Record<string, any> | undefined;
    // 自定义渲染
    render?: (scope: any) => VNode;
    template?: Template;
    visible?: boolean;
  }

  export interface TableColumn<T> {
    custom?: Partial<TableColumnCustom<T>>;
    [key: string]: any;
  }

  type SelectOption =
    | {
        label: string;
        value: any;
      }
    | string;

  type LoadOptions<T = any> = (
    formData?: T
  ) => SelectOption[] | Promise<SelectOption[]>;

  interface ActionButtonConfirm {
    title?: string;
    content?: string;
  }

  type TableActionHandler<T = any> = (
    row: T,
    scope: any,
    action?: string
  ) => void;

  interface TableActionButtonOptions<T = any> {
    handler?: TableActionHandler<T>;
    action?: string;
    label?: string;
    autoRefresh?: boolean;
    confirm?: boolean | ActionButtonConfirm;
    props?: IObject;
  }

  type TableActionButton<T = any> =
    | TableActionButtonOptions<T>
    | string
    | ((row: T) => Exclude<TableActionButton<T>, Function>);

  interface TableActionGroup<T = any> {
    dropdown: {
      buttons: Array<TableActionButton<T> | string>;
      icon?: string;
      label?: string;
      props?: IObject;
    };
  }

  type TableColumnButtons<T = any> =
    | Array<string | TableActionButton<T> | TableActionGroup<T>>
    | ((row: T) => Exclude<TableColumnButtons<T>, Function>);

  export interface InternalTableColumn {
    field: string;
    label?: string;
    custom?: Partial<TableColumnCustom>;
  }

  type GridFormRule = Array<IObject | Function> | IObject | Function;
  type GridFormRules = Record<string, GridFormRule>;

  type GridFormItemType =
    | "input"
    | "textarea"
    | "select"
    | "date"
    | "datetime"
    | "color"
    | "switch"
    | "radio";

  export interface GridFormItem {
    // required
    field: string;

    // optional
    type?: GridFormItemType;
    label?: string;
    placeholder?: string;
    config?: Partial<
      // select config
      | {
          options: SelectOption[];
          loadOptions: LoadOptions;
          dependsOn: string;
        }
      // date/datetime config
      | {
          range: boolean;
          format: string;
        }
    >;
    layout?:
      | number
      | string
      | Record<typeof breakpoints[number] | "default", number | string>;
    render?: Slot | VNode | VNode[];
    rule?: GridFormRule;
    props?: IObject;

    // showWhen?: (formData: IObject, field: string) => boolean;
  }

  export function defineColumns<R extends Object = Record<string, any>>(
    columns: TableColumn<R>[]
  ): TableColumn<R>[];

  export function defineConfig(
    options: InstallationOptions
  ): InstallationOptions;

  export function getProps(type: string): IObject;
}
