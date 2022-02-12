import { capitalize, getCurrentInstance, h } from "vue";
import type { Prop, ExtractPropTypes, VNode } from "vue";
import { UseButtonOptions } from "@/types/components";
import { ComponentType, framework } from "@/framework";

type ShowButton<T extends string> = `${"show"}${T}${"Button"}`;
type ButtonText<T extends string> = `${T}ButtonText`;

type UseActionButtonProps = ExtractPropTypes<
  ReturnType<typeof makeActionButtonProps>
>;

export const makeActionButtonProps = () => {
  const actions = ["confirm", "cancel"] as const;
  type Action = typeof actions[number];

  return {
    ...actions.reduce((props, action) => {
      const useCapitalize = capitalize(action) as Capitalize<typeof action>;

      const showBtnKey = ("show" + useCapitalize + "Button") as ShowButton<
        typeof useCapitalize
      >;
      props[showBtnKey] = {
        type: Boolean,
        default: true,
      };
      return props;
    }, {} as Record<ShowButton<Capitalize<Action>>, Prop<boolean, true>>),

    ...actions.reduce((props, action) => {
      const btnTextKey = (action + "ButtonText") as ButtonText<typeof action>;
      props[btnTextKey] = {
        type: String,
        default: "",
      };
      return props;
    }, {} as Record<ButtonText<Action>, Prop<string, string>>),
  };
};

export const makeActionButtons = (opts: {
  loading: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => {
  const vm = getCurrentInstance()!;
  const {
    showConfirmButton,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
  } = vm.props as UseActionButtonProps;
  const { onConfirm, onCancel, loading } = opts;
  const buttons: VNode[] = [];

  const makeButton = (options: UseButtonOptions) => {
    const button = framework.makeNode(ComponentType.Button, options);
    buttons.push(button);
  };

  if (showCancelButton) {
    // todo: 国际化
    const options: UseButtonOptions = {
      label: cancelButtonText || "取消",
      text: true,
      color: "primary",
      onClick: onCancel,
      disabled: loading,
    };

    makeButton(options);
  }

  if (showConfirmButton) {
    const options: UseButtonOptions = {
      label: confirmButtonText || "确认",
      text: true,
      color: "primary",
      onClick: onConfirm,
      loading,
    };
    makeButton(options);
  }

  return buttons.length
    ? h(
        "div",
        {
          class: "a-full-width a-flex a-justify-end",
        },
        buttons
      )
    : null;
};
