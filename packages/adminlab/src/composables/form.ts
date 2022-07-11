import { getCurrentInstance } from "vue";
import type { PropType, Prop, ExtractPropTypes } from "vue";
import { useInternalColumns } from "./internal";
import { installationOptions } from "@/adminlab";
import { isFunction } from "@/utils";

type FormFunction = (event: {
  formData: any;
  field: string;
  from?: string;
}) => boolean;

export const processSelectOptions = (options: SelectOption[]) => {
  return options.map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      option = option.toString();

      return {
        label: option,
        value: option,
      };
    }
    return option;
  });
};

export const makeGridFormItem = (
  column: InternalTableColumn,
  rule: Exclude<RuleType, "table">
): GridFormItem => {
  const { field, label, custom } = column;
  const { define, map, props, slots, extension = {} } = custom!;

  const _props = props instanceof Function ? props(rule) || {} : {};
  const _slots = slots instanceof Function ? slots(rule) || {} : {};

  if (_props.clearable === void 0) {
    const module =
      rule === "searcher"
        ? installationOptions.modules?.searcher
        : installationOptions.modules?.formDialog;
    const clearable = !!module?.clearable;
    _props.clearable = clearable;
  }

  const config: IObject = {};

  let type: GridFormItemType = extension.textarea ? "textarea" : "input";

  if (define === "date" || define === "datetime") {
    type = define;

    if (extension && extension.range) {
      if (isFunction(extension.range)) {
        config.range = !!extension.range(rule);
      } else {
        config.range = true;
      }
    }
  } else if (define === "color") {
    type = define;
  } else if (define === "switch") {
    type = define;
  } else if (map) {
    let options: {
      label: string;
      value: any;
    }[] = [];
    if (!(map.loadOptions instanceof Function)) {
      if (Array.isArray(map.options)) {
        options = processSelectOptions(map.options);
      }
    }

    let formType = map.formType;
    if (formType instanceof Function) {
      formType = formType(rule);
    }

    if (formType === "select" || formType === "radio" || formType === "input") {
      type = formType;
    } else {
      type = "select";
    }

    config.options = options;
    config.dependsOn = map.dependsOn;
    config.loadOptions = map.loadOptions;
    config.preload = map.preload
  }

  // todo: configurable
  const placeholder = label
    ? (type === "input" || type === "textarea" ? "输入" : "选择") + label
    : "";

  return {
    field,
    label,
    placeholder,
    type,
    config,
    props: _props,
    slots: _slots,
  };
};

export const useFormItems = (rule: Exclude<RuleType, "table">) => {
  return useInternalColumns((actionConfig) => {
    return rule === "searcher"
      ? actionConfig.searchable
      : rule === "creator"
      ? actionConfig.creatable
      : rule === "editor"
      ? actionConfig.editable
      : // 不匹配
        false;
  }).map((column) => makeGridFormItem(column, rule));
};

const functionNames = ["showWhen"] as const;

export const makeFormFunctionProps = () => {
  return functionNames.reduce((props, functionName) => {
    props[functionName] = {
      type: Function as PropType<FormFunction>,
    };
    return props;
  }, {} as Record<typeof functionNames[number], Prop<FormFunction>>);
};

type Props = ExtractPropTypes<ReturnType<typeof makeFormFunctionProps>>;

export const getFormFunctionProps = (props?: Props) => {
  props = props || (getCurrentInstance()!.props as Props);

  return functionNames.reduce((obj, functionName) => {
    const val = props![functionName];
    if (val) {
      obj[functionName] = val;
    }
    return obj;
  }, {} as Partial<Props>);
};

export const makeRulesProps = () => {
  return {
    rules: {
      type: Object as PropType<GridFormRules>,
    },
  };
};

export const getRulesProps = () => {
  const vm = getCurrentInstance()!;
  const { rules } = vm.props as ExtractPropTypes<
    ReturnType<typeof makeRulesProps>
  >;

  return rules
    ? {
        rules,
      }
    : {};
};
