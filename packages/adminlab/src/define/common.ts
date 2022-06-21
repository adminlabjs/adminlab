import { h } from "vue";

export interface DefineCommonOptions<T = any> {
  validator?: (data: T) => boolean;
  props?: Record<string, any>;
}

export const createSpan = (label: string) => h("span", null, label);

export const generateVNodeIfValidationFails = (value: any, validator?: (...args: any) => boolean) => {
  if (validator instanceof Function) {
    const valid = validator(value);
    if (!valid) {
      return createSpan(value)
    }
  }

  return null
}
