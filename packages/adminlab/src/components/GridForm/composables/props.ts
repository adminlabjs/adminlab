import { makeFormFunctionProps, makeLayoutProps, makeRulesProps } from "@/composables";
import type { PropType, ExtractPropTypes } from "vue";

export type UsePropsReturn = ExtractPropTypes<ReturnType<typeof useProps>>;

export const useProps = () => {
  return {
		...makeLayoutProps(),
		...makeFormFunctionProps(),
		...makeRulesProps(),
    items: {
      type: Array as PropType<GridFormItem[]>,
      default: () => [],
    },
		defaultValue: {
			type: Object,
			default: () => ({}),
		},
		from: {
			type: String,
		},
		debounce: {
			type: Number,
		},
  };
};
