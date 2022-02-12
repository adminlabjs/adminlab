import { ComponentType, getProps } from "adminlab";
import { defineComponent, h, ref } from "vue";

export default defineComponent({
	name: "ElementColorPicker",
	inheritAttrs: false,

	setup(props, { attrs, emit }) {
		const { onKeyup, placeholder, clearable } = props;
		const modelValue = ref("");

		const initModelValue = () => {
			modelValue.value = props.modelValue || "";
		}

		const onChange = (value: string) => {
			modelValue.value = value;
		}

		const submit = () => {
			emit("update:model-value", modelValue.value);
		}


		return () => {
			initModelValue();

			const commonProps = {
				"model-value": modelValue.value,
				"onUpdate:modelValue": (newValue: string) => {
					onChange(newValue);
					submit();
				},
			}

			const disabled = attrs.disabled || attrs.readonly;

			return h("div", {
				class: "a-flex"
			}, [
				h(<el-input></el-input>, {
					...getProps(ComponentType.Input),
					...commonProps,
					onKeyup,
					placeholder,
					readonly: disabled,
					clearable,
				}),
				h(<el-color-picker {...attrs}></el-color-picker>, {
					...commonProps,
					...attrs,
					disabled,
				})
			])
		}
	},

	props: {
		modelValue: String,
		placeholder: String,
		clearable: Boolean,
		onKeyup: Function,
	}
})
