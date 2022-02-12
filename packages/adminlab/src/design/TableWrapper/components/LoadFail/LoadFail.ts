import { framework } from "@/framework";
import { UseButtonOptions } from "@/types/components";
import { defineComponent, h } from "vue";
import { ComponentType } from "adminlab";

export default defineComponent({
	name: "LoadFail",
	inheritAttrs: false,
	emits: ["reload", "close"],

  setup(props, { emit }) {
    return () => {
      // todo: 国际化
      const closeButtonOptions: UseButtonOptions = {
        label: "关闭",
        text: true,
        color: "primary",
        onClick: () => emit("close"),
      }
      const closeButton = framework.makeNode(ComponentType.Button, closeButtonOptions);

      return h(
        "div",
        {
          class: "a-load-fail",
        },
        [h("span", {
					class: "a-load-fail-text"
				}, "加载失败"), h("span", {
					class: "a-load-fail-button",
					onClick: () => emit("reload"),
				}, "重新加载"), h('div', {
          class: "a-load-fail-close"
        }, closeButton)]
      );
    };
  },
});
