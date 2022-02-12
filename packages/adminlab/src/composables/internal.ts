import { getCurrentInstance } from "vue";
import type { PropType, ExtractPropTypes } from "vue";

export const makeInternalColumnsProps = () => {
  return {
    columns: {
      type: Array as PropType<InternalTableColumn[]>,
      default: () => [],
    },
  };
};

export const useInternalColumns = (
  callback: (actionConfig: ActionConfig) => boolean
) => {
  const props = getCurrentInstance()!.props as ExtractPropTypes<
    ReturnType<typeof makeInternalColumnsProps>
  >;
  return props.columns.filter((column) => {
    const actionConfig =
      column && column.custom && (column.custom.action as ActionConfig);
    return actionConfig && callback(actionConfig);
  });
};
