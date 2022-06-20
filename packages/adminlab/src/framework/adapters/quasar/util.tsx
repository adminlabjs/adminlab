import { h } from "vue";
import type { VNode } from "vue";
import type {
  UseTableOptions,
  UseProgressOptions,
  UseTagOptions,
  UseButtonOptions,
  UseDropdownOptions,
  UseDropdownItemOptions,
  UseSelectOptions,
  UseDatePickerOptions,
  UseTimerPickerOptions,
  UseColorPickerOptions,
  UseFormOptions,
  UseColOptions,
  UseInputOptions,
  UseDialogOptions,
  UsePagination,
  UseSwitchOptions,
  UseImageOptions,
  UseRadioGroupOptions,
} from "@/types/components";
import { QuasarAdapterOptions } from ".";

// doc: 传入的props，除了非受控状态属性之外，全部以props的优先级最高
interface QuasarTablePagination {
  descending: boolean;
  page: number;
  rowsNumber: number;
  rowsPerPage: number;
  sortBy: string | null;
}

export const useTable = (options: UseTableOptions, ext?: QuasarAdapterOptions, tableProps?: Record<string, any>) => {
  const {
    listData,
    columns,
    loading,
    generateCustomColumns,
    onRequest,
    total,
    pagination,
    slots: tableSlots,
  } = options;

  tableProps = tableProps || {}

  const { defaultColumn = {} } = ext || {};

  const request = (pagination: QuasarTablePagination) => {
    const { page, rowsPerPage, sortBy, descending } = pagination;

    onRequest({
      page,
      pageSize: rowsPerPage,
      sortBy: sortBy || "",
      descending,
    });
  };

  const customColumns = generateCustomColumns((column) => ({
    field: column.field,
    label: column.label,
    custom: column.custom,
  }));

  const slots: Record<string, (scope: any) => VNode> = {
    loading: () => (
      <q-inner-loading showing>
        <q-spinner-ball color="primary" size="2em" />
      </q-inner-loading>
    ),
  };

  return {
    props: {
      "column-sort-order": "da",
      color: "primary",
      pagination: {
        sortBy: pagination.sortBy || null,
        descending: pagination.descending,
        page: pagination.page,
        rowsPerPage: pagination.pageSize,
        rowsNumber: total,
      },
      ...tableProps,
      rows: listData,
      loading: loading || tableProps.loading,
      onRequest: (event: { pagination: QuasarTablePagination }) => {
        request(event.pagination);
      },
      "onUpdate:pagination": (pagination: QuasarTablePagination) => {},
      columns: columns.map((column, i) => {
        column = Object.assign({}, defaultColumn, column);

        const { field } = column;
        let { name } = column;

        const customColumn = customColumns.find((item) => item.index === i);
        if (customColumn) {
          const { align, style, classes } = column;

          if (!name) {
            name = field || `CUSTOM_COLUMN_${i}`;
          }

          slots[`body-cell-${name}`] = (scope) => {
            let classList: string[] = [];

            classList.push(`text-${align || "right"}`);
            if (typeof classes === "string") {
              classList.push(classes);
            } else if (classes instanceof Function) {
              classList.push(classes(scope.row));
            }

            return h(
              <q-td style={style} class={classList.join(" ")}></q-td>,
              null,
              {
                default: () => customColumn.render(scope, scope.row),
              }
            );
          };
        }

        return {
          ...column,
          name,
          custom: void 0,
        };
      }),
    },
    slots: Object.assign(tableSlots, slots),
  };
};

export const useProgress = (options: UseProgressOptions) => {
  const { label, color, value, size, props = {} } = options;

  return {
    props: {
      color,
      size,
      label,
      ...props,
      value: value / 100,
    },
  };
};

export const useTag = (options: UseTagOptions) => {
  const { text, color, textColor, size, props = {} } = options;

  return {
    props: {
      color,
      textColor,
      size,
      ...props,
      label: text,
    },
  };
};

export const useButton = (options: UseButtonOptions) => {
  const {
    label,
    text,
    color,
    textColor,
    loading,
    disabled,
    icon,
    onClick,
    props = {},
  } = options;
  let size = props.size || options.size;

  if (size === "mini" || size === "x-small") {
    size = "xs";
  }
  if (size === "small") {
    size = "sm";
  }
  if (size === "default") {
    size = "";
  }
  if (size === "medium") {
    size = "md";
  }
  if (size === "large") {
    size = "lg";
  }
  if (size === "x-large") {
    size = "xl";
  }

  return {
    props: {
      flat: !!text,
      color,
      textColor,
      loading,
      disabled,
      icon,
      ...props,
      onClick,
      label,
    },
  };
};

export const useDropdown = (options: UseDropdownOptions) => {
  const { label, text, color, props = {} } = options;

  return {
    props: {
      flat: !!text,
      color,
      label,
      ...props,
    },
  };
};

export const useDropdownItem = (options: UseDropdownItemOptions) => {
  const { label, onClick, props = {} } = options;

  return {
    props: {
      label,
      ...props,
      onClick,
    },
  };
};

export const useSelect = (options: UseSelectOptions) => {
  const {
    label,
    modelValue,
    options: selectOptions,
    props = {},
    placeholder,
    loading,
    onRefresh,
    showRefresh,
  } = options;

  return {
    props: {
      "emit-value": true,
      "map-options": true,
      label,
      placeholder,
      ...props,
      options: selectOptions,
      "model-value": modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
      loading,
    },
    slots: {
      append: () =>
        showRefresh ? [h(
          <q-btn
            icon={"refresh"}
            flat
            round
            onClick={(e: Event) => {
              e.stopPropagation();
              onRefresh && onRefresh();
            }}
          ></q-btn>
        )] : [],
    },
  };
};

export const useDatePicker = (options: UseDatePickerOptions) => {
  const { label, modelValue, props, placeholder, range, datetime } = options;

  return {
    props: {
      label,
      placeholder,
      ...props,
      range,
      isDateTime: datetime,
      "model-value": modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
    },
  };
};

// 用不到
export const useTimePicker = (options: UseTimerPickerOptions) => {
  const { label, modelValue, props, placeholder } = options;

  return {
    props: {
      label,
      placeholder,
      ...props,
      isTime: true,
      "model-value": modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
    },
  };
};

export const useColorPicker = (options: UseColorPickerOptions) => {
  const { modelValue, label, placeholder, props = {} } = options;

  return {
    props: {
      label,
      placeholder,
      ...props,
      "model-value": modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
    },
  };
};

export const useForm = (options: UseFormOptions) => {
  const { items, props = {}, rules = {} } = options;

  return {
    props,
    slots: {
      default: () =>
        items.map((item) => {
          const { render, field } = item;
          const props: IObject = {};
          if (field && rules && rules[field]) {
            props.rules = [rules[field]];
          }
          return h(render(), props);
        }),
    },
  };
};

export const useCol = (options: UseColOptions) => {
  const cols = options.default;

  return {
    props: {
      ...options,
      cols,
      default: void 0,
    },
  };
};

export const useInput = (options: UseInputOptions) => {
  const { placeholder, label, modelValue, props = {}, textarea } = options;
  const type = textarea ? "textarea" : "text";

  return {
    props: {
      label,
      placeholder,
      type,
      ...props,
      "model-value": modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
    },
  };
};

export const useDialog = (options: UseDialogOptions) => {
  const { props } = options;
  delete options.props;

  return {
    props: {
      ...props,
      ...options,
    },
  };
};

export const usePagination = (options: UsePagination) => {
  const { page, pageSize, total, onPageChange, props = {} } = options;
  const width = window.screen.width;

  let maxPages = 10;

  if (width > 500 && width < 600) {
    maxPages = 9;
  }

  if (width < 500) {
    maxPages = 6;
  }

  return {
    props: {
      "max-pages": maxPages,
      ...props,
      "model-value": page,
      "onUpdate:modelValue": onPageChange,
      max: Math.ceil(total / pageSize),
    },
  };
};

export const useSwitch = (options: UseSwitchOptions) => {
  const { modelValue, label, props = {} } = options;

  return {
    props: {
      label,
      "left-label": true,
      ...props,
      modelValue: modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
    },
  };
};

export const useRow = (options: any) => {
  return {
    props: {},
  };
};

export const useImage = (options: UseImageOptions) => {
  const { src, props = {}, imgClass } = options;

  return {
    props: {
      "img-class": imgClass,
      ...props,
      src,
    },
  };
};

export const useOptionGroup = (options: UseRadioGroupOptions) => {
  const {
    modelValue,
    props = {},
    options: optionGroupOptions,
    label,
    placeholder,
    loading,
    showRefresh,
    onRefresh,
  } = options;

  return {
    props: {
      color: "primary",
      inline: true,
      label,
      placeholder,
      ...props,
      options: optionGroupOptions,
      loading,
      modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
    },
    slots: {
      append: () =>
        showRefresh ? [h(
          <q-btn
            icon={"refresh"}
            flat
            round
            onClick={(e: Event) => {
              e.stopPropagation();
              onRefresh && onRefresh();
            }}
          ></q-btn>
        )] : [],
    },
  };
};
