import { getCurrentInstance, ref } from "vue";
import type { UsePropsReturn } from "./props";

export const useModel = () => {
  const vm = getCurrentInstance()!;
  const props = vm.props as UsePropsReturn;
  const getDefaultValue = () => props.defaultValue ? JSON.parse(JSON.stringify(props.defaultValue)) : {};

  const makeModel = () => {
    const defaultValue = getDefaultValue();

    return props.items.filter(item => !item.render && item.field).reduce((model, val) => {
      const { field } = val;
      const v = defaultValue[field]
      if (v !== void 0) {
        model[field] = v
      }
      return model;
    }, {} as Record<string, any>);
  }

  const getModel = () => Object.assign({}, model.value);

  const resetModel = (callback: () => void) => {
    model.value = makeModel()
    callback();
  };

  const model = ref(makeModel());

  return {
    model,
    getModel,
    makeModel,
    resetModel,
  };
};
