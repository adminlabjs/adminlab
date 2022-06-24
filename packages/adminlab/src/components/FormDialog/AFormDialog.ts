import { setInstanceProperty } from '@/utils/instance';
import { defineComponent, h, ref, getCurrentInstance, watch, nextTick } from "vue";
import type { PropType } from "vue";
import { ADialog, AGridForm, AContainer } from "@/components";
import {
  getFormFunctionProps,
  getLayoutProps,
  getRulesProps,
  makeFormFunctionProps,
  makeLayoutProps,
  makeRulesProps,
  useFormItems,
} from "@/composables";
import { actionPropsFactory } from "@/composables/container";
import { isPromise } from "@/utils";
import { setCurrentModule } from "@/adminlab";

const { make: makeActionProps, get } = actionPropsFactory(["delete"]);

export const getActionProps = get;

type FormData = IObject | null;
export interface OpenFormDialogEvent {
  edit: FormData;
  copy: FormData;
}

export default defineComponent({
  name: "AFormDialog",
  inheritAttrs: false,
  emits: ["submit", "done", "change"],

  setup(props, { attrs, emit }) {
    const vm = getCurrentInstance()!;

    if (vm.parent?.type !== AContainer) {
      console.error("[adminlab]: `AFormDialog` mast be used in `AContainer`");
      return () => null;
    }

    const modelValue = ref(false);

    watch(modelValue, (newValue) => {
      if (newValue) {
        nextTick(() => formRef.value && formRef.value.resetModel());
      }
    })

    let editData: FormData = null;
    let copyData: FormData = null;
    let isUpdate = false;

    setInstanceProperty({
      open: (e: OpenFormDialogEvent) => {
        editData = e.edit;
        copyData = e.copy;
        isUpdate = !!editData;

        modelValue.value = true;
      },
    })

    const formRef = ref<any>(null);
    const loading = ref(false);

    const makeFormItems = () => useFormItems(isUpdate ? "editor" : "creator");

    const done = () => {
      modelValue.value = false;
      emit("done");
    };

    const makeModel = () => copyData || editData || {};
    const model = ref<IObject>({});

    const handleSubmit = () => {
      const submit = formRef.value && formRef.value.submit;

      if (submit) {
        submit().then((formData: any) => {
          const method = isUpdate ? props.actionEdit : props.actionCreate;
          if (method instanceof Function) {
            const data = isUpdate ? Object.assign({}, model.value, formData) : formData;
            const result = method(data);
            if (isPromise(result)) {
              loading.value = true;
              result.then(done).finally(() => (loading.value = false));
            } else {
              done();
            }
          } else {
            const name = isUpdate ? "Edit" : "Create";
            console.warn(`[adminlab]: \`action${name}\` is required`);
          }
        });
      } else {
        console.warn("[adminlab]: Form.submit is required");
      }
    };

    return () => {
      model.value = makeModel();
      setCurrentModule("formDialog");
      const className = `a-form-dialog`;

      return h(
        ADialog,
        {
          // todo: 国际化
          title: isUpdate ? "编辑" : "新建",
          modelValue: modelValue.value,
          "width": "560px",
          ...attrs,
          loading: loading.value,
          "onUpdate:modelValue": (newValue: boolean) =>
            (modelValue.value = newValue),
          onConfirm: handleSubmit,
          class: attrs.class ? `${className} ${attrs.class}` : className,
        },
        {
          default: () => {
            return h(AGridForm, {
              ...getFormFunctionProps(),
              ...getLayoutProps({
                layout: 12,
                layoutSm: 6
              }),
              ...getRulesProps(),
              items: makeFormItems(),
              ref: formRef,
              from: isUpdate ? "editor" : "creator",
              defaultValue: model.value,
              onChange: (val: IObject) => {
                emit("change", val);
                // if (isUpdate) {
                //   Object.assign(model.value, val);
                // } else {
                //   model.value = val;
                // }
              },
              onSubmit: handleSubmit,
              module: "formDialog",
            });
          },
        }
      );
    };
  },

  props: {
    ...makeFormFunctionProps(),
    ...makeActionProps(),
    ...makeLayoutProps(),
    ...makeRulesProps(),
    columns: {
      type: Array as PropType<InternalTableColumn[]>,
      default: () => [],
    },
  },
});
