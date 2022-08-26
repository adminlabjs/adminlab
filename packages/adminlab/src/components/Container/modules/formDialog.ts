import { h } from "vue";
import type { VNode } from "vue";
import { AFormDialog, getActionProps } from "../../FormDialog";
import type { ContainerCore } from "./state";
import { getFormFunctionProps, getRulesProps } from "@/composables";

export const useFormDialog = (opts: ContainerCore, node?: VNode) => {
  const { state, fetch } = opts;
  const { internalColumns, refs } = state;
  const component: VNode | typeof AFormDialog = node || AFormDialog;

	// @ts-ignore
  return h(component, {
    columns: internalColumns,
    onDone: fetch,
    ref: refs.formDialog,
    ...getActionProps(),
    ...getFormFunctionProps(),
    ...getRulesProps(),
  });
};
