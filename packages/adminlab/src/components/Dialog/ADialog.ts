import { ComponentType, framework } from "@/framework";
import { defineComponent, h } from "vue";

export default defineComponent({
  name: "ADialog",
  inheritAttrs: false,
  setup(props, { attrs, slots }) {
    return () => {
      const { component: Dialog, props: dialogProps } = framework.useComponent(
        ComponentType.Dialog,
        attrs,
      );
      return h(Dialog, dialogProps, slots);
    };
  },
});
