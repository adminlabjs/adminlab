import { h } from "vue";
import { ComponentType } from "@/framework";
import { ABlock } from "@/components";

import type { VNode } from "vue";
import type { ContainerCore } from "./state";
import type { UsePagination } from "@/types/components";

export const usePagination = (
  node: VNode,
  adapter: FrameworkAdapter,
  opts: ContainerCore
) => {
  const { state, fetch } = opts;
  const { pagination, total } = state;
  const { page, pageSize } = pagination.value;

  const options: UsePagination = {
    page,
    pageSize,
    total: total.value,
    onPageChange: (number) => {
      pagination.value.page = number;
      fetch();
    },
    onPageSizeChange: (size) => {
      pagination.value.pageSize = size;
      fetch();
    },
  };

  const { props, slots } =
    adapter.useComponent(ComponentType.Pagination, options) || {};

  return h(node, props, slots);
};

export const usePaginationWrapper = (node: VNode) => {
  return h(ABlock, {
    class: "a-pagination-wrapper",
    justify: "center",
  }, () => node)
}
