import { getCurrentInstance } from "vue";

export const setInstanceProperty = (properties: Record<string, any>) => {
  const vm = getCurrentInstance()!;
  Object.assign(vm.proxy as any, properties)
};
