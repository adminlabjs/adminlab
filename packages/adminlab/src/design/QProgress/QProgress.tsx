import { defineComponent, h } from "vue";

export default defineComponent({
	name: "QuasarProgress",
	inheritAttrs: false,

	setup(props, { attrs }) {
		return () => h("div", null, [
			h("div", null, props.label),
			h(<q-linear-progress {...attrs}></q-linear-progress>)
		]);
	},

	props: {
		label: {
			type: String,
			default: "",
		}
	}
})
