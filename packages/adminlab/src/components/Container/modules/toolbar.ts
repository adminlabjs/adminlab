import { h } from "vue";
import type { VNode } from "vue";
import { ContainerCore } from "./state";

export const useToolbar = (node: VNode, opts: ContainerCore) => {
  const { state, fetch, search } = opts;
  const { formDialog, loading, openFormDialog, refs } = state;

  return h(node, {
    onAction: (action: string) => {
      if (action === "create") {
        formDialog.copy = null;
        formDialog.edit = null;
        openFormDialog();
      }
      if (action === "refresh") {
        fetch();
      }
      if (action === "search") {
        search();
      }
      if (action === "reset") {
        refs.searcher.value.resetModel();
      }
    },
		loading: loading.value.table,
  });
};
