import { h, defineComponent } from "vue";

export default defineComponent({
  name: "QuasarRadioGroup",
  inheritAttrs: false,
  setup(props, { attrs, slots }) {
    return () =>
      h(
        <q-field
          loading={props.loading}
          label={props.label}
          rules={props.rules}
          disable={props.disable}
          clearable={props.clearable}
          modelValue={attrs.modelValue}
          onUpdate:modelValue={attrs["onUpdate:modelValue"]}
        ></q-field>,
        null,
        {
          ...slots,
          default: () => (
            <div class={"text-black"}>
              <q-option-group {...attrs}></q-option-group>
            </div>
          ),
        }
      );
  },

  props: {
    loading: Boolean,
    label: String,
    placeholder: String,
    rules: [Array, Object],
    disable: Boolean,
    clearable: Boolean,
  },
});
