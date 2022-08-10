import {
  getFormFunctionProps,
  getLayoutProps,
  getRulesProps,
  makeFormFunctionProps,
  makeInternalColumnsProps,
  makeLayoutProps,
  useFormItems,
} from "@/composables";
import { defineComponent, h, ref } from "vue";
import { AGridForm, ASearcherItem } from "@/components";
import { setCurrentModule } from "@/adminlab";
import { filter, mergeClass, setInstanceProperty } from "@/utils";
import type { PropType } from "vue";

export default defineComponent({
  name: "ASearcher",
  inheritAttrs: false,
  emits: ["fetch", "change"],

  setup(props, { attrs, emit, slots }) {
    const makeSearcherItems = () => useFormItems("searcher");
    const { autoSearch, debounce, defaultValue } = props;
    const gridFormRef = ref<any>(null);

    setInstanceProperty({
      resetModel: () => gridFormRef.value.resetModel(),
      getModel: () => gridFormRef.value.getModel(),
      submit: () => gridFormRef.value.submit(),
    });

    return () => {
      setCurrentModule("searcher");

      const { match, mismatch } = filter(slots?.default?.() || [], (slot) => {
        return slot.type === ASearcherItem;
      });

      return h(
        "div",
        {
          class: mergeClass(attrs, "a-searcher"),
          style: attrs.style,
        },
        h(
          AGridForm,
          {
            ...getLayoutProps({
              layout: 12,
              layoutSm: 6,
            }),
            ...getFormFunctionProps(),
            ...getRulesProps(),
            from: "searcher",
            items: makeSearcherItems(),
            onChange: (event: IObject) => {
              emit("change", event);
              if (autoSearch) {
                emit("fetch");
              }
            },
            onSubmit: () => {
              emit("fetch");
            },
            module: "searcher",
            debounce,
            ref: gridFormRef,
            defaultValue,
          },
          {
            default: () => mismatch,
            standard: () => match,
          }
        )
      );
    };
  },

  props: {
    ...makeInternalColumnsProps(),
    ...makeLayoutProps(),
    ...makeFormFunctionProps(),

    autoSearch: {
      type: Boolean,
      default: true,
    },
    debounce: {
      type: Number,
      default: 600,
    },
    defaultValue: {
      type: Object,
      default: null,
    },
    rules: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    }
  },
});
