import type { Slots, VNode } from "vue";

import type { breakpoints } from "@/composables";

export interface Pagination {
  page: number;
  pageSize: number;
  sortBy: string;
  descending: boolean;
}

export interface UseTableOptions<T = any> {
  listData: IObject[];
  columns: TableColumn<T>[];
  loading: boolean;

  onRequest: (event: Pagination) => void;
  pagination: Pagination;
  total: number;
  slots: Slots;

  generateCustomColumns: (
    makeInternalColumn: (column: T) => InternalTableColumn
  ) => {
    field: string;
    index: number;
    render: (scope: any, row: any) => VNode | VNode[];
  }[];
}

export interface UseProgressOptions {
  value: number;
  label?: string;
  color?: string;
  size?: string | number;
  props?: IObject;
}

export interface UseTagOptions {
  text: string;
  color?: string;
  textColor?: string;
  size?: string;
  icon?: string;
  props?: IObject;
}

export interface UseButtonOptions {
  label: string;
  text?: boolean;
  color?: string;
  textColor?: string;
  onClick?: Function;
  loading?: boolean;
  disabled?: boolean;
  size?: string;
  icon?: string;
  round?: boolean;
  props?: IObject;
}

export interface UseDropdownOptions {
  label: string;
  text?: boolean;
  color?: string;
  props?: IObject;
}

export interface UseDropdownItemOptions {
  label: string;
  onClick: (formData: IObject) => void;
  disabled?: boolean;
  props?: IObject;
}

export interface FormItemBaseOptions {
  modelValue: any;
  "onUpdate:modelValue": (newValue: any) => void;
  label?: string;
  placeholder?: string;
  props?: IObject;
  slots?: Slots;
}

export interface UseSelectOptions extends FormItemBaseOptions {
  options: SelectOption[];
  loading: boolean;
  showRefresh: boolean;
  onRefresh?: (...args: any[]) => any;
}

export interface UseDatePickerOptions extends FormItemBaseOptions {
  range?: boolean;
  datetime: boolean;
}

export interface UseTimerPickerOptions extends FormItemBaseOptions {
  range?: boolean;
}

export type UseColorPickerOptions = FormItemBaseOptions;
export type UseSwitchOptions = FormItemBaseOptions;
export interface UseInputOptions extends FormItemBaseOptions {
  textarea?: boolean;
}

export interface UseFormOptions {
  model: IObject;
  items: Array<
    GridFormItem & {
      render: () => VNode | VNode[];
    }
  >;
  props?: IObject;
  rules?: GridFormRules;
}

export interface UseColOptions
  extends Partial<Record<typeof breakpoints[number], string>> {
  default: string;
}

export interface UseDialogOptions {
  title?: string;
  content?: string;
  "max-width"?: string | number;
  "min-width"?: string | number;
  width?: string | number;
  persistent?: boolean;
  loading?: boolean;
  props?: IObject;
  slots?: Slots;
}

export interface UsePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (newPageNumber: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  props?: IObject;
  slots?: Slots;
}

export interface UseImageOptions {
  src: string;
  imgClass?: string;
  props?: IObject;
  slots?: Slots;
}

export type UseRadioGroupOptions = UseSelectOptions;
