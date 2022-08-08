/**
 * 默认基于 GridForm
 * 是一个带有表单元素的弹窗
 */

import { defineComponent } from "vue";
import GridForm from "../GridForm/GridForm";

import type { PropType } from "vue";

export const FormDialog = defineComponent({
  name: "AFormDialog",

  setup(props) {
    const modelValue = Object.assign({}, props.modelValue);
  },

  props: {
    modelValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
});
