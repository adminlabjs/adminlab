import { makeActionButtonProps, makeActionButtons } from "@/composables";
import { defineComponent, h } from "vue";

export default defineComponent({
	name: "ElementDialog",
	inheritAttrs: false,
	emits: ["cancel", "confirm", "update:model-value"],

	setup(props, { slots, attrs, emit }) {
		const genStyle = () => {
			const keys = ["width", "minWidth", "maxWidth"] as const;

			return keys.reduce((style, key) => {
				const val = props[key];
				if (val) {
					const suffix = isNaN(Number(val)) ? "" : "px";
					style[key] = `${val}${suffix}`;
				}
				return style;
			}, {} as Record<typeof keys[number], string>);
		}

		return () => {
			const { title, content, loading, cancelButtonEvent, class: className } = props;

			const styles = genStyle();

			const dialogProps = {
				width: styles.width,
				title,
				"custom-class": className,
				...attrs,
				"close-on-click-modal": loading ? false : attrs["close-on-click-modal"],
				"close-on-press-escape": loading ? false : attrs["close-on-press-escape"],
				"show-close": loading ? false : attrs["show-close"],
				modelValue: props.modelValue,
				"onUpdate:modelValue": (value: boolean) => {
					emit("update:model-value", value);
				},
			}

			const buttons = makeActionButtons({
				onCancel: () => {
					emit('cancel');
					if (cancelButtonEvent) {
						emit('update:model-value', false);
					}
				},
				onConfirm: () => emit("confirm"),
				loading,
			});


			return h(<el-dialog></el-dialog>, dialogProps, {
				default: slots.default || (() => content),
				footer: buttons ? () => buttons : void 0
			})
		}
	},

	props: {
		...makeActionButtonProps(),
		title: {
			type: String,
			default: "",
		},
		content: {
			type: String,
			default: "",
		},
		width: {
			type: [Number, String],
		},
		minWidth: {
			type: [Number, String],
		},
		maxWidth: {
			type: [Number, String],
		},
		loading: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
		// 点击取消按钮自动关闭dialog
		cancelButtonEvent: {
			type: Boolean,
			default: true,
		},
		class: {
			type: String,
			default: ""
		}
	}
})
