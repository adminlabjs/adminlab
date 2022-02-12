import { defineComponent, h } from "vue";

export default defineComponent({
	name: "QuasarRow",
	inheritAttrs: false,

	setup(props, { slots }) {
		return () => h("div", {
			class: "row q-col-gutter-md"
		}, slots);
	}
})
