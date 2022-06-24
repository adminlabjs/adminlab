import { setInstanceProperty } from '@/utils';
import { UseDialogOptions } from "@/types/components";
import { h, defineComponent, ref, reactive } from "vue";
import { ADialog } from "@/components";

export interface ConfirmEvent {
  done: () => void;
  startLoading: () => void;
  stopLoading: () => void;
}

type OnConfirmEventHandler = (e: ConfirmEvent) => void;

export default defineComponent({
  name: "AConfirm",
  inheritAttrs: false,
  setup() {

    const dialogProps = reactive({
      title: "",
      content: "",
    });

    const modelValue = ref(false);

    const loading = ref(false);

    let onConfirm: OnConfirmEventHandler;

    // todo: 国际化
    const open = (options: {
      title?: string;
      content?: string;
      callback: OnConfirmEventHandler;
    }) => {
      const {
        title = "操作",
        content = "确定执行该操作吗？",
        callback,
      } = options;
      dialogProps.title = title;
      dialogProps.content = content;
      onConfirm = callback;
      modelValue.value = true;
    };

    const event: ConfirmEvent = {
      done: () => (modelValue.value = false),
      startLoading: () => (loading.value = true),
      stopLoading: () => (loading.value = false),
    };

    setInstanceProperty({
      open,
    })

    return () => {
      const options: UseDialogOptions = {
        title: dialogProps.title,
        content: dialogProps.content,
				width: "350px",
				"max-width": "560px",
      };

      return h(ADialog, {
        ...options,
        modelValue: modelValue.value,
				"onUpdate:modelValue": (newValue: boolean) => modelValue.value = newValue,
        loading: loading.value,
        onConfirm: () => {
          onConfirm && onConfirm(event);
        },
      });
    };
  },
});
