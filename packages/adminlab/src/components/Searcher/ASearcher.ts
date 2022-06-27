import {
  getFormFunctionProps,
  getLayoutProps,
  makeFormFunctionProps,
  makeInternalColumnsProps,
  makeLayoutProps,
  useFormItems,
} from "@/composables";
import { defineComponent, h, ref } from "vue";
import { AGridForm, ASearcherItem } from "@/components";
import { setCurrentModule } from "@/adminlab";
import { filter, mergeClass, setInstanceProperty } from "@/utils";

export default defineComponent({
  name: "ASearcher",
  inheritAttrs: false,
  emits: ["fetch"],

  setup(props, { attrs, emit, slots }) {
    const makeSearcherItems = () => useFormItems("searcher");
    const { autoSearch, debounce, defaultValue } = props;
    const gridFormRef = ref<any>(null);

    setInstanceProperty({
      resetModel: () => gridFormRef.value.resetModel(),
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
            from: "searcher",
            items: makeSearcherItems(),
            onChange: (event: IObject) => {
              if (autoSearch) {
                emit("fetch", event);
              }
            },
            onSubmit: (event: IObject) => {
              emit("fetch", event);
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
  },
});
