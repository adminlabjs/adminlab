import { makeLayoutProps } from "@/composables";
import { defineComponent, h } from "vue";

export default defineComponent({
  name: "AGridLayoutCol",
  setup(props, { slots }) {
    return () => {
      const element = slots.default?.() || [];
      return h(element)
    };
  },

  props: {
    ...makeLayoutProps(),
  }
});
