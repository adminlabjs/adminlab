import { generateVNodeIfValidationFails } from "./common";
import type { DefineCommonOptions } from "./common";
import { ComponentType, framework } from "@/framework";
import { UseProgressOptions } from "@/types/components";

interface DefinePropgressOptions extends DefineCommonOptions {
  label: string;
}

export const defineProgress = (
  value: number,
  options?: Partial<DefinePropgressOptions>
) => {
  options = options || {};
  const { validator, props = {} } = options;
  let { label } = options;

  const node = generateVNodeIfValidationFails(value, validator);
  if (node) return node;

  const type = ComponentType.Progress;

  if (label === void 0) {
    label = Number(value.toFixed(2)).toString();
    label += "%";
  }

  const progressOptions: UseProgressOptions = {
    value,
    props,
    label,
  };

  return framework.makeNode(type, progressOptions);
};
