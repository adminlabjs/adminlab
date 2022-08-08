import { makeLayoutProps, getLayoutProps } from "@/composables";
import { ComponentType, framework } from "@/framework";
import { defineComponent, h } from "vue";
import Col from "./GridLayoutCol";

export default defineComponent({
  name: "AGridLayout",
  setup(props, { slots }) {
    return () => {
      const children = slots.default?.() || [];
      const { component: Row } = framework.useComponent(ComponentType.Row, {});

      return h(
        Row,
        null,
        children.map((child) => {
          if (child.type === Col) return child;
          return h(Col, getLayoutProps(), child);
        })
      );
    };
  },

  props: {
    ...makeLayoutProps(),
  },
});

// <a-grid-layout layout="" layout-md="">
//    <div>row-1<div>
//    <div>row-2<div>
//    <div>row-3<div>
//    <a-grid-layout-item></a-grid-layout-item>
// </a-grid-layout>
