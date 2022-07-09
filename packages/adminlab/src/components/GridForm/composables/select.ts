import { ref, watch } from "vue";
import type { Ref } from "vue";
import { isPromise } from "@/utils";
import { processSelectOptions } from "@/composables";

export const useSelectRecord = (models: IObject) => {
  const dict: Record<
    string,
    {
      value: any;
      loading: Ref<boolean>;
      error: Ref<string>;
      timestamp: number;
      options: Ref<SelectOption[]>;
      showRefresh: Ref<boolean>;
      loadOptions?: LoadOptions;
      dependsOn?: string;
      preload?: boolean;
    }
  > = {};

  const set = (item: GridFormItem) => {
    const { field, config = {} } = item;

    if (!dict[field]) {
      // @ts-ignore
      const { loadOptions, options = [], dependsOn, preload } = config;
      const selectOptions = loadOptions instanceof Function ? [] : options;
      dict[field] = {
        loading: ref(false),
        error: ref(""),
        options: ref(selectOptions),
        loadOptions,
        value: models[field],
        dependsOn,
        timestamp: -1,
        showRefresh: ref(false),
        preload,
      };

      loadSelectOptions(field);
    }

    return dict[field];
  };

  const loadSelectOptions = (field: string, reset = false) => {
    const select = dict[field];
    const {
      loadOptions,
      options,
      loading,
      error,
      dependsOn,
      showRefresh,
      preload,
    } = select;

    if (!(loadOptions instanceof Function)) return;

    if (dependsOn && dependsOn !== field) {
      const val = models[dependsOn];
      if (!val && val !== 0 && !preload) {
        return;
      }
    }

    if (reset) {
      models[field] = "";
      options.value = [];
    }

    const timestamp = (select.timestamp = Date.now());
    const result = loadOptions(Object.assign({}, models));

    const callback = (response: SelectOption[]) => {
      if (timestamp !== select.timestamp) return;
      options.value = processSelectOptions(response);
    };

    if (isPromise(result)) {
      loading.value = true;
      showRefresh.value = false;

      result
        .then(callback)
        .catch((err) => (error.value = err.message))
        .finally(() => {
          loading.value = false;
          showRefresh.value = true;
        });
    } else {
      callback(result);
    }
  };

  const findDependent = (field: string) => {
    return Object.entries(dict).filter((item) => item[1].dependsOn === field);
  };

  const onModelsChange = () => {
    for (const key in models) {
      const select = dict[key];
      if (select) {
        const newValue = models[key];
        if (newValue !== select.value) {
          select.value = newValue;
          const dependents = findDependent(key);
          if (dependents.length) {
            dependents.forEach((item) => {
              const key = item[0];
              if (newValue || newValue === 0) {
                loadSelectOptions(key, true);
              } else {
                models[key] = "";
                resetSelect(key);
              }
            });
          }
        }
      }
    }
  };

  const resetSelect = (field: string) => {
    const select = dict[field];
    select.options.value = [];
    select.loading.value = false;
    select.error.value = "";
    select.timestamp = -1;
  };

  watch(models, onModelsChange);

  return {
    set,
    loadSelectOptions,
  };
};
