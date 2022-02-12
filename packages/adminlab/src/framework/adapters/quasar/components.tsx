import { ComponentType } from "adminlab";
import {
  QuasarDropdown,
  QuasarDropdownItem,
  QuasarDatePicker,
  QuasarColorPicker,
  QuasarRow,
  QuasarCol,
  QuasarDialog,
  QuasarProgress,
  QuasarRadioGroup,
} from "@/design";
import {
  useButton,
  useCol,
  useColorPicker,
  useDatePicker,
  useDialog,
  useDropdown,
  useDropdownItem,
  useForm,
  useImage,
  useInput,
  useOptionGroup,
  usePagination,
  useProgress,
  useRow,
  useSelect,
  useSwitch,
  useTable,
  useTag,
} from "./util";

import type { DirectiveArguments, Slots } from "vue";

let component: Record<
  ComponentType,
  {
    get: () => any;
    use?: (
      options: any,
      ext?: Record<string, any>
    ) => {
      props?: Record<string, any>;
      slots?: Slots;
      directives?: DirectiveArguments;
    };
  }
>;

export const getComponents = () => {
  return (
    component ||
    (component = {
      [ComponentType.Table]: {
        get: () => <q-table></q-table>,
        use: (options, ext) => useTable(options, ext),
      },
      [ComponentType.Pagination]: {
        get: () => <q-pagination></q-pagination>,
        use: usePagination,
      },
      [ComponentType.Form]: {
        get: () => <q-form></q-form>,
        use: useForm,
      },
      [ComponentType.Button]: {
        get: () => <q-btn></q-btn>,
        use: useButton,
      },
      [ComponentType.Select]: {
        get: () => <q-select></q-select>,
        use: useSelect,
      },
      [ComponentType.Input]: {
        get: () => <q-input></q-input>,
        use: useInput,
      },
      [ComponentType.Tag]: {
        get: () => <q-chip></q-chip>,
        use: useTag,
      },
      [ComponentType.Switch]: {
        get: () => <q-toggle></q-toggle>,
        use: useSwitch,
      },
      [ComponentType.Dialog]: {
        get: () => QuasarDialog,
        use: useDialog,
      },
      [ComponentType.DatePicker]: {
        get: () => QuasarDatePicker,
        use: useDatePicker,
      },
      [ComponentType.Row]: {
        get: () => QuasarRow,
        use: useRow,
      },
      [ComponentType.Col]: {
        get: () => QuasarCol,
        use: useCol,
      },
      [ComponentType.Dropdown]: {
        get: () => QuasarDropdown,
        use: useDropdown,
      },
      [ComponentType.DropdownItem]: {
        get: () => QuasarDropdownItem,
        use: useDropdownItem,
      },
      [ComponentType.Progress]: {
        get: () => QuasarProgress,
        use: useProgress,
      },
      [ComponentType.ColorPicker]: {
        get: () => QuasarColorPicker,
        use: useColorPicker,
      },
      [ComponentType.Image]: {
        get: () => <q-img></q-img>,
        use: useImage,
      },
      [ComponentType.RadioGroup]: {
        get: () => QuasarRadioGroup,
        use: useOptionGroup,
      },
    })
  );
};

export const isCustomComponent = (val: any) => {
  return [
    QuasarDropdown,
    QuasarDropdownItem,
    QuasarDatePicker,
    QuasarColorPicker,
    QuasarRow,
    QuasarCol,
    QuasarDialog,
    QuasarProgress,
    QuasarRadioGroup,
  ].includes(val);
};
