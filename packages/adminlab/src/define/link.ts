import { h } from "vue";
import { generateVNodeIfValidationFails } from "./common";
import type { DefineCommonOptions } from "./common";

interface DefineLinkOptions extends DefineCommonOptions {
  label?: string;
}

export const defineLink = (value: string, options?: DefineLinkOptions) => {
  options = options || {};
  const { validator, props = {}, label = value } = options;

  const node = generateVNodeIfValidationFails(value, validator);

  if (node) return node;

  return h(
    "a",
    {
      ...props,
      href: value,
      target: "_blank",
    },
    label,
  );
};
