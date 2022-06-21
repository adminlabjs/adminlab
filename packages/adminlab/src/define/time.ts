import { h } from "vue";
import { formatTime } from '@/utils';
import { generateVNodeIfValidationFails } from "./common";
import type { DefineCommonOptions } from "./common";

type DefineTimeData = string | number | Date;

interface DefineTimeOptions extends DefineCommonOptions {
    type: "datetime" | "date" | "time";
    format: string;
}

export const defineTime = (
  data: DefineTimeData,
  options?: Partial<DefineTimeOptions>
) => {
  options = options || {};
  const { type = "datetime", validator, props } = options;

  const node = generateVNodeIfValidationFails(data, validator);

  if (node) return node;

  let { format } = options;

  if (!format) {
    if (type === "date") {
      format = "yyyy/MM/dd";
    } else if (type === "time") {
      format = "HH:mm:ss";
    } else {
      format = "yyyy/MM/dd HH:mm:ss";
    }
  }

  let value = data;

  if (typeof value === "number") {
    if (value.toString().length === 10) {
      value = value * 1000;
    }
  }

  return h('span', props, formatTime(value))
};
