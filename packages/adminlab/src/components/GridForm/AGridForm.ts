import { ComponentType, framework } from "@/framework";
import {
  FormItemBaseOptions,
  UseButtonOptions,
  UseColOptions,
  UseDatePickerOptions,
  UseFormOptions,
  UseRadioGroupOptions,
  UseSelectOptions,
} from "@/types/components";
import { defineComponent, h, computed, isVNode, ref } from "vue";
import { useModel, useProps, useSelectRecord, useMethods } from "./composables";
import {
  defaultColKey,
  getRulesProps,
  makeBaseColOptions,
  useFormLayout,
} from "@/composables";
import { isPromise } from "@/utils";

export default defineComponent({
  name: "AGridForm",
  inheritAttrs: false,
  emits: ["change", "submit"],

  setup(props, { attrs, slots, emit }) {
    const { model: modelValue, getModel, resetModel } = useModel();
    const makeSelectRecord = () => useSelectRecord(modelValue.value);
    let selectRecord = makeSelectRecord();

    const { showWhen, from, debounce, rules, items } = props;
    const formRef = ref<any>(null);

    let debounceTimer: ReturnType<typeof setTimeout>;
    const onChange = () => setTimeout(() => emit("change", getModel()) /* 借此依赖清除 */, 0);

    const onModelValueChange = (isInput: boolean) => {
      if (!isInput || !debounce || isNaN(debounce) || debounce <= 0) {
        onChange();
        return;
      }

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(onChange, debounce);
    };

    const onKeyup = (event: any) => {
      if (event.key.toLowerCase() === "enter") {
        emit("submit", getModel());
      }
    };

    useMethods(
      (done) => {
        const validate = formRef.value && formRef.value.validate;

        if (!validate) {
          console.warn(`[adminlab]: Form.validate is required`);
          return;
        }

        const _done = (valid: boolean) => done(valid, getModel());

        if (
          (rules && Object.keys(rules).length > 0) ||
          formItems.value.find((item) => !!item.render)
        ) {
          const result = validate();
          if (isPromise(result)) {
            result.then(_done).catch(_done);
          } else {
            _done(result);
          }
        } else {
          _done(true);
        }
      },
      () => {
        resetModel(onChange);
        selectRecord = makeSelectRecord();
      }
    );

    const formItems = computed(() => {
      const model = getModel();

      return props.items
        .filter((item) => item.field || item.render)
        .filter((item) => {
          if (item.render || !showWhen) return true;
          return showWhen({
            formData: model,
            field: item.field,
            from,
          });
        });
    });

    const gridFormLayout = useFormLayout(items.length);

    const makeFormItems = () => {
      const model = modelValue.value;

      const makeFormItem = (item: GridFormItem) => {
        const {
          label,
          placeholder,
          field,
          props = {},
          config = {},
          type,
        } = item;

        const makeBaseOptions = (isInput = false): FormItemBaseOptions => ({
          label,
          placeholder,
          modelValue: model[field],
          "onUpdate:modelValue": (newValue) => {
            if (newValue === null || newValue === void 0) newValue = "";
            const oldValue = model[field];

            if (oldValue !== newValue) {
              model[field] = newValue;
              onModelValueChange(isInput);
            }
          },
          props: {
            onKeyup,
            ...props,
          },
        });

        const inputTypes = ["input", "date", "datetime", "time", "color"];
        const baseOptions = makeBaseOptions(!type || inputTypes.includes(type));

        if (type === "select" || type === "radio") {
          const {
            options: selectOptions,
            loading,
            showRefresh,
          } = selectRecord.set(item);

          const options: UseSelectOptions = {
            options: selectOptions.value,
            loading: loading.value,
            ...baseOptions,
            onRefresh: () => selectRecord.loadSelectOptions(field),
            showRefresh: showRefresh.value,
          };

          if (type === "select") {
            const {
              component: Select,
              props: selectProps,
              slots = {},
            } = framework.useComponent(ComponentType.Select, options);
  
            return h(Select, selectProps, slots);
          }

          return framework.makeNode(ComponentType.RadioGroup, options);
        }

        if (type === "date" || type === "datetime") {
          const options: UseDatePickerOptions = {
            // @ts-ignore
            range: config.range,
            datetime: type === "datetime",
            ...baseOptions,
          };
          return framework.makeNode(ComponentType.DatePicker, options);
        }

        if (type === "color") {
          return framework.makeNode(ComponentType.ColorPicker, baseOptions);
        }

        if (type === "switch") {
          baseOptions.modelValue = Boolean(baseOptions.modelValue);
          return framework.makeNode(ComponentType.Switch, baseOptions);
        }

        return framework.makeNode(ComponentType.Input, {
          ...baseOptions,
          textarea: type === "textarea",
        });
      };

      return formItems.value.map((item) => {
        const { render } = item;
        let _render;
        if (render) {
          if (render instanceof Array || isVNode(render)) {
            _render = () => render;
          } else {
            _render = render;
          }
        } else {
          _render = () => makeFormItem(item);
        }

        return Object.assign({}, item, {
          render: _render,
        });
      });
    };

    return () => {
      const options: UseFormOptions = {
        ...getRulesProps(),
        model: getModel(),
        items: makeFormItems(),
      };

      const {
        component: Form,
        props: formProps,
        slots,
      } = framework.useComponent(ComponentType.Form, options);

      const { component: Row, props = {} } = framework.useComponent(ComponentType.Row, {});

      return h(
        Form,
        {
          ...formProps,
          ref: formRef,
        },
        () =>
          h(Row, props, () =>
            slots?.default?.().map((node, i) => {
              const { layout } = items[i];
              const layoutOptions =
                typeof layout === "object"
                  ? layout
                  : {
                      [defaultColKey]: layout,
                    };
              const options: UseColOptions = makeBaseColOptions(
                gridFormLayout,
                i,
                layoutOptions
              );
              const { component: Col, props: colProps } =
                framework.useComponent(ComponentType.Col, options);

              return h(Col, colProps, () => node);
            })
          )
      );
    };
  },

  props: useProps(),
});
