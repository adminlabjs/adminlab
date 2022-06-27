import { defineComponent, h } from "vue";

export default defineComponent({
  name: "ASearcherItem",
  setup(props, { slots }) {
    return () => slots.default?.();
  },
});
