import { defineComponent, h } from "vue";
import type { Prop } from "vue";
import { mergeClass } from "@/utils";

const flexKeys = ["justify", "align"] as const;

const makeBlockProps = () => {
  return flexKeys.reduce((props, key) => {
    props[key] = {
      type: String,
      default: key === "align" ? "center" : "",
    };
    return props;
  }, {} as Record<typeof flexKeys[number], Prop<string>>);
};

export default defineComponent({
  name: "ABlock",
  inheritAttrs: false,

  setup(props, { attrs, slots }) {
    const getFlexProps = () => {
      return flexKeys.reduce((obj, key) => {
        const val = props[key];
        if (val) obj[key] = val;
        return obj;
      }, {} as Record<typeof flexKeys[number], string>);
    };

    const generateClass = () => {
      return mergeClass(
        attrs,
        "a-flex",
        `a-flex-${props.column ? 'column' : 'row'}`,
        ...Object.entries(getFlexProps()).map((item) => {
          const [key, val] = item;
          return `a-${key}-${val}`;
        })
      );
    };

    return () =>
      h(
        "div",
        {
          ...attrs,
          class: generateClass(),
        },
        slots
      );
  },

  props: {
    ...makeBlockProps(),
    column: Boolean,
  },
});
