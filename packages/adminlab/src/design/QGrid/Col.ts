import { defineComponent, h } from "vue";
import type { Prop } from "vue";

const breakpoints = ["sm", "md", "lg", "xl", "xxl"] as const;
const breakpointProps = (() => {
  return breakpoints.reduce((props, val) => {
    props[val] = {
      type: [String, Number],
      default: "",
    };
    return props;
  }, {} as Record<typeof breakpoints[number], Prop<string | number, "">>);
})();

export default defineComponent({
  name: "QuasarCol",
  inheritAttrs: false,

  setup(props, { slots }) {
    const classList = breakpoints
      .filter((val) => !!props[val])
      .map((val) => `col-${val}-${props[val]}`);

    if (props.cols) {
      classList.unshift(`col-${props.cols}`);
    }

    if (!classList.length) {
      classList.push("col");
    }

    return () => h("div", {
      class: classList
    }, slots);
  },

  props: {
    cols: {
      type: [String, Number],
      default: "",
    },
    ...breakpointProps,
  },
});
