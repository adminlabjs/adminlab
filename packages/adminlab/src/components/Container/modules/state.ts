import {
  getCurrentInstance,
  reactive,
  toRefs,
  watchEffect,
} from "vue";
import type { PropType, ExtractPropTypes } from "vue";

import { isPromise, EventEmitter } from "@/utils";
import { Pagination } from "@/types/components";
import { makeActionProps } from "@/composables/container";
import { OpenFormDialogEvent } from "@/components/FormDialog/AFormDialog";
import { makeFormFunctionProps, makeRulesProps } from "@/composables";

export interface ActionGetResponse {
  listData: any[];
  total: number;
}

export type UsePropsReturn = ExtractPropTypes<ReturnType<typeof useProps>>;
export type UseStateReturn = ReturnType<typeof useState>;
export type UseFetchReturn = ReturnType<typeof useFetch>;
export type UseSearchReturn = ReturnType<typeof useSearch>;
export type ContainerCore = ReturnType<typeof useCore>;

type OpenFormDialog = (e: OpenFormDialogEvent) => void;

const useSearch = (state: UseStateReturn, fetch: UseFetchReturn) => {
  return () => {
    const { pagination } = state;
    pagination.value.page = 1;
    fetch();
  };
};

const useFetch = (state: UseStateReturn) => {
  const { listData, total, loading, pagination, error, refs } = state;
  type Params = Omit<typeof pagination.value, "descending" | "sortBy"> &
    Partial<{
      sortBy: string | undefined;
      sortOrder: "desc" | "asc";
    }>;

  const vm = getCurrentInstance()!;
  const emit = vm.emit;
  const props = vm.props as UsePropsReturn;

  const makeParams = (): Params => {
    const { page, pageSize, sortBy, descending } = pagination.value;

    const params: Params = {
      page,
      pageSize,
    };

    if (sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = descending ? "desc" : "asc";
    }

    return params;
  };

  const processQuery = () => {
    const query = refs.searcher.value ? refs.searcher.value.getModel() : {};

    return Object.entries(query).reduce((query, kv) => {
      const key = kv[0];
      let value = kv[1];

      if (props.autoTrim) {
        if (typeof value === "string") {
          value = value.trim();
        }
      }

      if (typeof value === "boolean") {
        value = Number(value);
      }

      if (value || value === 0) {
        query[key] = value;
      }

      return query;
    }, {} as Record<string, any>);
  };

  let latestRequestTimestamp = -1;

  const fetch = () => {
    error.value = false;
    const emitValue = {
      params: makeParams(),
      pagination: Object.assign({}, pagination.value),
      query: processQuery(),
    };

    emit("request", emitValue);

    const actionGet = props.actionGet;

    if (actionGet instanceof Function) {
      const timestamp = (latestRequestTimestamp = Date.now());

      const setValue = (response: ActionGetResponse) => {
        if (timestamp === latestRequestTimestamp) {
          listData.value = response.listData;
          total.value = response.total;
        }
      };

      const result = actionGet({
        ...emitValue.params,
        ...emitValue.query,
      }, emitValue.pagination, emitValue.query);
      if (isPromise(result)) {
        loading.value.table = true;
        result.then(setValue).catch(() => {
          if (timestamp === latestRequestTimestamp) error.value = true;
        }).finally(() => {
          loading.value.table = false;
        });
      } else {
        setValue(result);
      }
    }
  }

  return () => {
    if (refs.searcher.value) {
      refs.searcher.value.submit().then(fetch)
    } else {
      fetch()
    }
  };
};

export const useProps = () => {
  return {
    ...makeActionProps(),
    ...makeFormFunctionProps(),
    ...makeRulesProps(),
    columns: {
      type: Array as PropType<TableColumn<any>[]>,
      default: () => [],
    },
    actionGet: {
      type: Function as PropType<
        (params: IObject, pagination: IObject, query: IObject) => ActionGetResponse | Promise<ActionGetResponse>
      >,
    },
    autoTrim: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    page: {
      type: Number,
      default: 1,
    },
    listData: {
      type: Array,
    },
    autoFetch: {
      type: Boolean,
      default: true,
    }
  };
};

const useState = () => {
  const props = getCurrentInstance()!.props as UsePropsReturn;

  const { listData, actionGet } = props;

  const state = reactive({
    listData: [] as any[],
    total: 0,
    loading: {
      table: false,
    },
    visible: {},
    error: false,
    pagination: {
      page: props.page,
      pageSize: props.pageSize,
      sortBy: null as string | null,
      descending: false,
    } as Pagination,
  });
  
  if (Array.isArray(listData) && !(actionGet instanceof Function)) {
    watchEffect(() => {
      state.listData = props.listData!
    })
  }

  const refs = {
    ...toRefs(
      reactive({
        confirm: null as any,
        formDialog: null as any,
        searcher: null as any,
      })
    ),
  };

  const formDialog = {
    copy: null as IObject | null,
    edit: null as IObject | null,
  };

  return {
    ...toRefs(state),
    refs,
    formDialog,

    internalColumns: [] as InternalTableColumn[],
    openFormDialog: () =>
      (refs.formDialog.value.open as OpenFormDialog)(formDialog),
  };
};

export const useCore = () => {
  const state = useState();
  const fetch = useFetch(state);
  const search = useSearch(state, fetch);

  return {
    state,
    fetch,
    search,
    emitter: new EventEmitter(),
    props: (getCurrentInstance()!.props as UsePropsReturn),
  }
};
