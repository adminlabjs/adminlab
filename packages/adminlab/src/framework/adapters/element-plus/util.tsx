import { h, mergeProps, resolveDirective } from "vue";
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
import { mergeObject, processUnixTimestamp } from "@/utils";
import { processSelectOptions } from "@/composables";

export const useTable = (options: UseTableOptions, ext?: Record<string, any>, tableProps?: Record<string, any>) => {
  const {
    listData,
    columns,
    generateCustomColumns,
    loading,
    onRequest,
    pagination,
    slots: tableSlots,
  } = options;
  const customColumns = generateCustomColumns((column) => ({
    field: column.prop,
    label: column.label,
    custom: column.custom,
  }));

  tableProps = tableProps || {};

  const slots = {
    default: () => {
      return columns.map((column, i) => {
        const customColumn = customColumns.find((item) => item.index === i);
        const slot =
          (column.prop && tableSlots[`item-${column.prop}`]) ||
          (customColumn
            ? {
                default: (scope: any) => customColumn.render(scope, scope.row),
              }
            : {});

        return h(
          <el-table-column></el-table-column>,
          {
            ...column,
            "sort-orders": column["sort-orders"] || [
              "descending",
              "ascending",
              null,
            ],
          },
          slot
        );
      });
    },
  };

  return {
    props: {
      ...tableProps,
      data: listData,
      onSortChange: (event: { column: any; prop: string; order: string }) => {
        const { column, prop, order } = event;

        if (column && column.sortable === "custom") {
          onRequest({
            ...pagination,
            sortBy: prop,
            descending: order === "descending",
          });
        }
      },
    },
    slots,
    directives: [[resolveDirective("loading"), loading]],
  };
};

export const useProgress = (options: UseProgressOptions) => {
  const { label, color, value, size, props = {} } = options;

  return {
    props: {
      "stroke-width": size,
      color,
      ...props,
      format: () => label || "",
      percentage: value,
    },
  };
};

export const useTag = (options: UseTagOptions) => {
  const { text, color, textColor, size, props = {} } = options;

  const typeOrColor: Partial<Record<"type" | "color", string>> = {};

  if (color) {
    if ("success/info/warning/danger".split("/").includes(color)) {
      typeOrColor.type = color;
    } else {
      typeOrColor.color = color;
    }
  }

  return {
    props: {
      ...typeOrColor,
      size,
      ...mergeProps(props, {
        style: textColor
          ? {
              color: textColor,
            }
          : {},
      }),
    },
    slots: {
      default: () => text,
    },
  };
};

export const useButton = (options: UseButtonOptions) => {
  const {
    label,
    text,
    color,
    loading,
    disabled,
    icon,
    onClick,
    props = {},
  } = options;
  let size = props.size || options.size;
  delete props.size;

  if (
    size === "mini" ||
    size === "x-small" ||
    size === "sm" ||
    size === "medium"
  ) {
    size = "small";
  }

  if (size === "x-large") {
    size = "large";
  }

  return {
    props: mergeObject(
      {
        size,
        type: text ? "text" : color,
        icon,
      },
      props,
      {
        loading,
        disabled,
        onClick,
      }
    ),
    slots: {
      default: () => label,
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
      ...props,
      onClick,
    },
    slots: {
      default: () => label,
    },
  };
};

export const useSelect = (options: UseSelectOptions) => {
  const {
    modelValue,
    options: selectOptions,
    props = {},
    placeholder,
    loading,
    showRefresh,
    onRefresh,
  } = options;
  return {
    props: {
      placeholder,
      ...props,
      "model-value": modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
      loading,
      showRefresh,
      onRefresh,
    },
    slots: {
      default: () => {
        return selectOptions.map((option) => {
          if (typeof option === "string")
            option = {
              label: option,
              value: option,
            };
          return (
            <el-option label={option.label} value={option.value}></el-option>
          );
        });
      },
    },
  };
};

export const useDatePicker = (options: UseDatePickerOptions) => {
  const { modelValue, props, placeholder, range, datetime } = options;

  const genModelValue = () => {
    const value = processUnixTimestamp(modelValue);
    return range ? handleRangeTimeVariable(value) : value;
  };

  return {
    props: {
      type: (datetime ? "datetime" : "date") + (range ? "range" : ""),
      placeholder,
      ...props,
      "model-value": genModelValue(),
      "onUpdate:modelValue": (newValue: Date | Date[]) => {
        let val: any = newValue;
        if (range) {
          if (Array.isArray(newValue)) {
            val = {
              from: newValue[0],
              to: newValue[1],
            };
          }
        }
        options["onUpdate:modelValue"](val);
      },
    },
  };
};

export const useTimePicker = (options: UseTimerPickerOptions) => {
  const { modelValue, props, placeholder, range } = options;

  const genModelValue = () => {
    return range ? handleRangeTimeVariable(modelValue) : modelValue;
  };

  return {
    props: {
      "is-range": range,
      placeholder,
      ...props,
      "model-value": genModelValue(),
      "onUpdate:modelValue": (newValue: Date | Date[]) => {
        let val: any = newValue;
        if (range) {
          if (Array.isArray(newValue)) {
            val = {
              from: val[0],
              to: val[1],
            };
          }
        }
        options["onUpdate:modelValue"](val);
      },
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
  const { items, props = {}, rules = {}, model } = options;

  return {
    props: {
      ...props,
      rules,
      model,
    },

    slots: {
      default: () =>
        items.map((item) => {
          const { render, field, label, props } = item;
          return (
            <el-form-item prop={field} label={label} {...props}>
              {render()}
            </el-form-item>
          );
        }),
    },
  };
};

export const useCol = (options: UseColOptions) => {
  const processVal = (val: any) => {
    if (!val) return void 0;
    val = Number(val);
    if (isNaN(val)) return void 0;

    return val * 2;
  };

  const opts = Object.entries(options).reduce((obj, val) => {
    const value = processVal(val[1]);
    if (value) {
      obj[val[0]] = value;
    }

    return obj;
  }, {} as Record<string, number>);

  return {
    props: {
      ...opts,
      default: void 0,
      span: opts.default,
    },
  };
};

export const useInput = (options: UseInputOptions) => {
  const { placeholder, modelValue, props = {}, textarea } = options;
  const type = textarea ? "textarea" : "text";

  return {
    props: {
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
  const {
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    props = {},
  } = options;
  const width = window.screen.width;

  let maxPages = 11;

  if (width > 500 && width < 600) {
    maxPages = 9;
  }

  if (width < 500) {
    maxPages = 5;
  }

  return {
    props: {
      layout: "prev, pager, next, sizes, total",
      "page-size": pageSize,
      total,
      "pager-count": maxPages,
      "current-page": page,
      "onUpdate:currentPage": onPageChange,
      "onUpdate:pageSize": onPageSizeChange,
    },
  };
};

export const useSwitch = (options: UseSwitchOptions) => {
  const { modelValue, props = {} } = options;

  return {
    props: {
      "left-label": true,
      ...props,
      modelValue: modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
    },
  };
};

export const useRow = (options: any = {}) => {
  const { props = {} } = options;
  return {
    props: {
      gutter: 10,
      ...props,
    },
  };
};

export const useImage = (options: UseImageOptions) => {
  const { src, props = {}, imgClass } = options;

  return {
    props: mergeProps(
      {
        class: imgClass,
        src,
      },
      props
    ),
  };
};

function handleRangeTimeVariable(val: any) {
  let value = processUnixTimestamp(val);

  if (value) {
    if (typeof value === "object") {
      value = [value.from, value.to];
    } else {
      value = [value, value];
    }
  }

  return value;
}

export const useRadioGroup = (options: UseRadioGroupOptions) => {
  const { modelValue, props = {}, options: optionGroupOptions } = options;

  return {
    props: {
      ...props,
      modelValue,
      "onUpdate:modelValue": options["onUpdate:modelValue"],
    },

    slots: {
      default: () => {
        return processSelectOptions(optionGroupOptions).map((option) => {
          return <el-radio label={option.value}>{option.label}</el-radio>;
        });
      },
    },
  };
};
