import { framework, ComponentType } from "@/framework";
import { useTable, useTableWrapper } from "./table";
import { ContainerCore } from "./state";
import { AFormDialog, ASearcher, AToolbar, ABlock } from "@/components";
import { useFormDialog } from "./formDialog";
import { useSearcher, useSearcherWrapper } from "./searcher";
import { useToolbar } from "./toolbar";
import { usePagination, usePaginationWrapper } from "./pagination";

import { h } from "vue";
import type { VNode } from "vue";

import { AConfirm } from "@/design";

export const useModule = (opts: ContainerCore) => {
  const processNode = (node: VNode, isChildren = false) => {
    const component = node.type;

    if (component === ABlock) {
      const children = node.children as IObject;
      const defaultSlot = children && children.default;
      if (defaultSlot instanceof Function) {
        node.children = {
          ...children,
          default: () => render(defaultSlot(), true),
        };
      }
      return node;
    }

    const tableAdapter = framework.getAdapterByComponent(
      component,
      ComponentType.Table
    );
    if (tableAdapter) {
      node = useTable(node, tableAdapter, opts);
      return useTableWrapper(node, opts);
    }

    const paginationAdapter = framework.getAdapterByComponent(
      component,
      ComponentType.Pagination
    );
    if (paginationAdapter) {
      node = usePagination(node, paginationAdapter, opts);
      if (isChildren) {
        return node;
      }
      return usePaginationWrapper(node);
    }

    if (component === AFormDialog) {
      return useFormDialog(opts, node);
    }

    if (component === ASearcher) {
      node = useSearcher(node, opts);
      if (isChildren) return node;
      return useSearcherWrapper(node);
    }

    if (component === AToolbar) {
      return useToolbar(node, opts);
    }

    return node;
  };

  const render = (nodes: VNode[], isChildren = false) => {
    const postProcess: {
      node: VNode;
      index: number;
    }[] = [];

    const children: VNode[] = [];
    let formDialogFlag = false;

    nodes.forEach((node, i) => {
      const component = node.type;

      if (component === ASearcher) {
        postProcess.push({
          node,
          index: i,
        });
        return;
      }

      if (component === AFormDialog) {
        formDialogFlag = true;
      }

      children.push(processNode(node, isChildren));
    });

    postProcess.forEach((item) => {
      const { node, index } = item;
      children.splice(index, 0, processNode(node, isChildren));
    });

    if (!isChildren) {
      if (!formDialogFlag) {
        children.push(useFormDialog(opts));
      }

      const { refs } = opts.state;
      children.push(
        h(AConfirm, {
          ref: refs.confirm,
        })
      );
    }

    return children;
  };

  return {
    render,
  };
};
