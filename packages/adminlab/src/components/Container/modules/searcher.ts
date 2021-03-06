import { h } from "vue";
import type { VNode } from "vue";
import type { ContainerCore } from "./state";
import { ABlock } from "@/components";
import { getFormFunctionProps } from "@/composables";

export const useSearcher = (node: VNode, opts: ContainerCore) => {
  const { search, query, state, props } = opts;
  const { internalColumns, refs } = state;

  return h(node, {
    columns: internalColumns.value,
    onFetch: (formData: IObject) => {
      query.value = formData;
      search();
    },
    ref: refs.searcher,
    ...getFormFunctionProps(props),
  });
};

export const useSearcherWrapper = (node: VNode) => {
  return h(
    ABlock,
    {
      class: "a-searcher-wrapper",
    },
    () => node
  );
};
