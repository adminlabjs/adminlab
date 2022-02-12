import { framework, ComponentType } from "@/framework";
import { defineComponent, h } from "vue";

export default defineComponent({
	name: "AToolbarBtn",
	inheritAttrs: false,

	setup(props, { attrs, slots, emit }) {
		const { action } = props;
		return () => h(framework.makeNode(ComponentType.Button, {
			props: attrs,
			...attrs,
			onClick: attrs.onClick || (() => {
				if (action) emit("action", action);
			})
		}), () => slots.default ? slots.default() : "")
	},

	props: {
		action: String,
	}
})
