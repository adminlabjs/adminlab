import { getProps, ComponentType } from "adminlab";
import { getRulesProps, makeRulesProps } from "@/composables";
import { defineComponent, h, ref } from "vue";

export default defineComponent({
	name: "QuasarColorPicker",
	inheritAttrs: false,
	emits: ["update:model-value"],

	setup(props, { attrs, emit }) {
		const { label, placeholder, clearable } = props;
		const modelValue = ref("");

		const initModelValue = () => {
			modelValue.value = props.modelValue;
		}

		const onChange = (value: string) => {
			modelValue.value = value;
		}

		const submit = () => {
			emit("update:model-value", modelValue.value);
			(popupRef.value as any).hide();
		}

		const popupRef = ref(null);

		const colorPickerProps = Object.assign({}, attrs, {
			"onUpdate:modelValue": onChange,
		});

		return () => {
			return h(<q-input></q-input>, {
				...getProps(ComponentType.Input),
				...getRulesProps(),
				"model-value": props.modelValue,
				"onUpdate:modelValue": (newValue: string) => {
					onChange(newValue);
					submit();
				},
				onKeyup: attrs.onKeyup,
				label,
				placeholder,
				// 禁用Picker的时候，输入框也要被禁用
				readonly: attrs.readonly || attrs.disabled,
				clearable: clearable,
			}, {
				append: () => {
					return h(<q-icon name={"colorize"} class={"cursor-pointer"}>
						<q-popup-proxy cover transition-show={"scale"} transition-hide={"scale"} ref={popupRef} onBeforeShow={initModelValue}>
							<q-color model-value={modelValue.value} {...colorPickerProps} />
							{/* todo: 国际化 */}
							<q-btn class={"full-width"} color={"primary"} flat onClick={submit}>提交</q-btn>
						</q-popup-proxy>
					</q-icon>)
				}
			})
		}
	},

	props: {
		...makeRulesProps(),
		modelValue: {
			type: String,
			default: "",
		},
		placeholder: {
			type: String,
			default: "",
		},
		label: {
			type: String,
			default: ""
		},
		clearable: Boolean,
	}
})
