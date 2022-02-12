import { defineComponent, h, ref, computed } from "vue";
import type { Ref, PropType } from "vue";
import { getRulesProps, makeRulesProps } from "@/composables";
import { formatTime } from "@/utils";
import { ComponentType, getProps } from "adminlab";

export default defineComponent({
	name: "QuasarDatePicker",
	inheritAttrs: false,

	setup(props, { attrs }) {
		const { isDateTime, range, clearable, placeholder, label } = props;
		const openRange = !isDateTime && range;

		// 将传进来的值进行格式化
		const formatValue = (val: string | number) => {
			if (!val) return "";

			const mask = isDateTime ? "yyyy/MM/dd HH:mm" : "yyyy/MM/dd";
			// unix
			if (typeof val === "number" && val.toString().length === 10) {
				val = val * 1000;
			}
			return formatTime(val, mask);
		}

		const propsModelValue = computed(() => {
			const modelValue = props.modelValue;
			if (!modelValue) return "";

			if (typeof modelValue === "object") {
				let { to, from } = modelValue;
				to = formatValue(to);
				from = formatValue(from);

				if (openRange) {
					return {
						to, from
					}
				}
				return from;
			} else {
				const val = formatValue(modelValue);
				if (openRange) {
					return {
						from: val,
						to: val,
					}
				}
				return val;
			}
		})

		const date = ref<typeof props.modelValue>(propsModelValue.value);

		const updateEventKey = "onUpdate:modelValue";

		const clearValue = () => date.value = "";

		const timePopupModel = ref(false);
		const datePopupModel = ref(false);

		const invokeUpdateModelCallback = (value: any) => {
			const update = attrs[updateEventKey];

			if (update instanceof Function) {
				if (openRange && typeof value !== "object") {
					value = {
						from: value,
						to: value
					}
				}

				update(value);
			}
		}

		const genPickerNode = (isTimePicker = false, popupModel: Ref<boolean>, mask: string) => {
			let iconName = "event";
			if (isTimePicker) {
				iconName = "access_time";
			}

			const changePopupModel = (value: boolean) => popupModel.value = value;

			const closePopup = () => changePopupModel(false);

			const onConfirm = () => {
				if (date.value !== props.modelValue) {
					invokeUpdateModelCallback(date.value);
				}

				closePopup();
			}

			const onCancel = () => {
				closePopup();
				date.value = props.modelValue;
			}

			const makeButtons = () => {
				return <div class={"row items-center justify-end"}>
					{/* todo: 多语言 */}
					<q-btn label={"清除"} color={"primary"} disabled={!date.value} flat onClick={clearValue} />
					<q-btn label={"确定"} color={"primary"} flat onClick={onConfirm} />
					<q-btn label={"关闭"} color={"primary"} flat onClick={onCancel} />
				</div>
			}

			const makePicker = () => {
				const range = {
					// datetime 与 time不支持范围选择
					range: openRange
				}
				return h(isTimePicker ? <q-time format24h></q-time> : <q-date {...range}></q-date>, {
					...attrs,
					mask,
					"model-value": date.value,
					[updateEventKey]: (newValue: any) => {
						date.value = newValue;
						if (newValue !== null) {
							if (!isTimePicker) {
								closePopup();
								invokeUpdateModelCallback(newValue);
							}
						}
					}
				}, () => makeButtons())
			}

			const makePopupProxy = () => {
				return h(<q-popup-proxy></q-popup-proxy>, {
					"transition-show": "scale",
					"transition-hide": "scale",
					"no-parent-event": true,
					"model-value": popupModel.value,
					"onUpdate:modelValue": changePopupModel,
				}, () => makePicker())
			}

			return h(<q-icon></q-icon>, {
				name: iconName,
				class: "cursor-pointer",
				onClick: () => changePopupModel(true),
			}, () => makePopupProxy())
		}

		const makeInputSlots = () => {
			if (props.isDateTime) {
				return {
					prepend: () => genPickerNode(false, datePopupModel, "YYYY/MM/DD HH:mm"),
					append: () => genPickerNode(true, timePopupModel, "YYYY/MM/DD HH:mm")
				}
			}

			return {
				append: () => genPickerNode(false, datePopupModel, "YYYY-MM-DD")
			}
		}

		const inputValue = computed(() => {
			const modelValue = propsModelValue.value;

			if (typeof modelValue === "object") {
				const { from, to } = modelValue;
				return `${from} - ${to}`;
			}

			return modelValue;
		});

		return () => h(<q-input></q-input>, {
			...getProps(ComponentType.Input),
			...getRulesProps(),
			"model-value": inputValue.value,
			"onUpdate:modelValue": invokeUpdateModelCallback,
			clearable,
			readonly: attrs.readonly || attrs.disabled || false,
			onKeyup: attrs.onKeyup,
			placeholder,
			label,
		}, makeInputSlots());
	},

	props: {
		...makeRulesProps(),
		modelValue: {
			type: [Object, String, Number] as PropType<string | number | {
				from: string | number;
				to: string | number;
			}>,
		},
		isDateTime: {
			type: Boolean,
			default: false,
		},
		range: {
			type: Boolean,
			default: false,
		},
		clearable: Boolean,
		placeholder: String,
		label: String,
	}
})
