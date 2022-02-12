import { defineComponent } from "vue";
import { makeActionButtonProps, makeActionButtons } from "@/composables";

export default defineComponent({
	name: "QuasarDialog",
	inheritAttrs: false,
	emits: ["update:model-value", "confirm", "cancel"],

	setup(props, { attrs, slots, emit }) {
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
			const { title, content, cancelButtonEvent, loading } = props;

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

			const dialogProps = {
				...attrs,
				persistent: loading || attrs.persistent,
				modelValue: props.modelValue,
				"onUpdate:modelValue": (value: boolean) => {
					emit("update:model-value", value);
				}
			}

			return <q-dialog {...dialogProps}>
				<q-card style={genStyle()}>
					{
						title ? <q-card-section>
							<div class="text-h6">{title}</div>
						</q-card-section> : null
					}
					<q-card-section class={"row " + (title ? "q-pt-none" : "q-mt-md")}>
						{slots.default ? slots.default() : content}
					</q-card-section>
					{
						buttons ? <q-card-actions>
							{buttons}
						</q-card-actions> : null
					}
				</q-card>
			</q-dialog>
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
		}
	}
})
