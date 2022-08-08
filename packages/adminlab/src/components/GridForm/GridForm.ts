import { makeBaseColOptions, useFormLayout } from "../../composables/layout";
import {
  defineComponent,
  ref,
  computed,
  toRaw,
  h,
  watchEffect,
  getCurrentInstance,
} from "vue";
import { makeLayoutProps, breakpoints } from "@/composables";
import { ComponentType, framework } from "@/framework";

import type { PropType, Slots, VNode } from "vue";

interface AGridFormItem {
  // 组件类型
  type: ComponentType;
  // 组件属性
  props: Record<string, any>;
  slots?: Slots;
  // 栅栏选项
  // col: number | typeof breakpoints[number];
  // 更新通知字段
  field: string;
  render?: (formData: Record<string, any>) => VNode;
}

export default defineComponent({
  name: "AGridForm",
  emits: ["update:model-value"],

  setup(props, { emit, slots: defaultSlots }) {
    const modelValue = ref<Record<string, any>>({});
    const formRef = ref();

    watchEffect(() => {
      modelValue.value = Object.assign({}, props.modelValue);
    });

    /** 无需响应式 */
    const { rules } = props;

    Object.assign(getCurrentInstance()!.proxy!, {
      updateModel: (key: string, value: any) => {
        modelValue.value[key] = value;
      },

      getModel: () => getModelValue(),

      validate: () => {
        const ruleKeys = Object.keys(rules || {});
        if (
          ruleKeys.length > 0 ||
          items.value.find((item) => {
            return !!item.render && ruleKeys.includes(item.field);
          })
        ) {
          const validate = formRef.value && formRef.value.validate;

          if (!validate) {
            console.warn(`[adminlab]: Form.validate is required`);
            return;
          }

          return validate();
        }

        return true;
      },
    });

    const getModelValue = () => Object.assign({}, toRaw(modelValue));

    const items = computed(() => {
      const { items, showWhen } = props;
      return items
        .filter((item) => {
          const { field, type } = item;
          return field && !!ComponentType[type];
        })
        .filter((item) => {
          if (!(showWhen instanceof Function)) return true;
          const mv = Object.assign({}, modelValue.value);
          const { field } = item;

          return showWhen(field, mv);
        });
    });

    const makeFormItems = () => {
      return items.value.map((item) => {
        const { type, field, props = {}, slots, render } = item;
        const model = modelValue.value;
        const isInternalRender = !(render instanceof Function);

        return {
          render: !isInternalRender
            ? () => render(model)
            : () => {
                const {
                  component,
                  props: componentProps,
                  slots: componentSlots = {},
                } = framework.useComponent(type, {
                  ...props,
                  modelValue: model[field],
                  "onUpdate:modelValue": (newValue: any) => {
                    model[field] = newValue;
                    emit("update:model-value", model);
                  },
                });

                return h(component, componentProps, {
                  ...componentSlots,
                  ...slots,
                });
              },
          field,
          rules,
          isInternalRender,
        };
      });
    };

    const makeForm = () => {
      const formChildren = makeFormItems();
      const { component, props, slots } = framework.useComponent(
        ComponentType.Form,
        {
          rules,
          model: getModelValue(),
          items: formChildren,
        }
      );

      const controlledNodes = defaultSlots?.default?.() || [];
      const freedomNodes = defaultSlots?.freedom?.() || [];

      const layouts = useFormLayout(
        formChildren.length + controlledNodes.length
      );

      const { component: Row } = framework.useComponent(ComponentType.Row, {});

      return h(
        component,
        {
          ...props,
          ref: formRef,
        },
        () => {
          const children = slots?.default?.() || [];

          return h(Row, null, () => {
            return [...children, ...controlledNodes]
              .map((child, i) => {
                const { component: Col, props: colProps } =
                  framework.useComponent(
                    ComponentType.Col,
                    makeBaseColOptions(layouts, i)
                  );
                return h(Col, colProps, () => child);
              })
              .concat(freedomNodes);
          });
        }
      );
    };

    const render = () => makeForm();

    return () => {
      return render();
    };
  },

  props: {
    items: {
      type: Array as PropType<AGridFormItem[]>,
      default: () => [],
    },

    showWhen: {
      type: Function as PropType<
        (field: string, formData: Record<string, any>) => boolean
      >,
    },

    modelValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },

    rules: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },

    ...makeLayoutProps(),
  },
});
