import { ComponentType } from "adminlab";
import { ElDropdown, ElColorPicker, ElDialog, ElSelect } from "@/design";
import { useButton, useCol, useColorPicker, useDatePicker, useDialog, useDropdown, useDropdownItem, useForm, useImage, useInput, usePagination, useProgress, useRadioGroup, useRow, useSelect, useSwitch, useTable, useTag } from "./util";

let component: Record<ComponentType, {
	get: () => any;
	use?: (options: any) => any;
}>;

export const getComponents = () => {
	return component || (component = {
		[ComponentType.Table]: {
			get: () => <el-table></el-table>,
			use: useTable,
		},
		[ComponentType.Pagination]: {
			get: () => <el-pagination></el-pagination>,
			use: usePagination,
		},
		[ComponentType.Form]: {
			get: () => <el-form></el-form>,
			use: useForm,
		},
		[ComponentType.Button]: {
			get: () => <el-button></el-button>,
			use: useButton,
		},
		[ComponentType.Select]: {
			get: () => ElSelect,
			use: useSelect,
		},
		[ComponentType.Input]: {
			get: () => <el-input></el-input>,
			use: useInput,
		},
		[ComponentType.Tag]: {
			get: () => <el-tag></el-tag>,
			use: useTag,
		},
		[ComponentType.Switch]: {
			get: () => <el-switch></el-switch>,
			use: useSwitch,
		},
		[ComponentType.Dialog]: {
			get: () => ElDialog,
			use: useDialog,
		},
		[ComponentType.DatePicker]: {
			get: () => <el-date-picker></el-date-picker>,
			use: useDatePicker,
		},
		[ComponentType.Row]: {
			get: () => <el-row></el-row>,
			use: useRow,
		},
		[ComponentType.Col]: {
			get: () => <el-col></el-col>,
			use: useCol,
		},
		[ComponentType.Dropdown]: {
			get: () => ElDropdown,
			use: useDropdown,
		},
		[ComponentType.DropdownItem]: {
			get: () => <el-dropdown-item></el-dropdown-item>,
			use: useDropdownItem,
		},
		[ComponentType.Progress]: {
			get: () => <el-progress></el-progress>,
			use: useProgress,
		},
		[ComponentType.ColorPicker]: {
			get: () => ElColorPicker,
			use: useColorPicker,
		},
		[ComponentType.Image]: {
			get: () => <img></img>,
			use: useImage,
		},
		[ComponentType.RadioGroup]: {
			get: () => <el-radio-group></el-radio-group>,
			use: useRadioGroup,
		}
	})
}

export const isCustomComponent = (val: any) => {
	return [ElDropdown, ElColorPicker, ElDialog, ElSelect].includes(val);
}
