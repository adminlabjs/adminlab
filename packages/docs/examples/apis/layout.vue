<template>
  <a-container
    :columns="columns"
    :action-get="fetch"
    :action-edit="editUser"
    :page-size="3"
  >
    <a-searcher layout="12" layout-sm="6,6,12"></a-searcher>
    <q-table></q-table>
    <a-form-dialog layout="12" layout-sm="6"></a-form-dialog>
  </a-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMockApi } from "@adminlab/use-api";
import type { DataItem } from "@adminlab/use-api";
import { defineColumns } from "adminlab";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const { fetch, update: apiUpdate } = useMockApi();

    return {
      columns: defineColumns<DataItem>([
        {
          field: "id",
          label: "#ID",
          custom: {
            action: {
              searchable: true,
            },
          },
        },
        {
          field: "user_name",
          label: "用户名",
          custom: {
            action: {
              searchable: true,
              creatable: true,
              editable: true,
            },
          },
        },
        {
          field: "link",
          label: "个人主页",
          custom: {
            define: "link",
            action: {
              creatable: true,
              editable: true,
              searchable: true,
            },
          },
        },
        {
          label: "操作",
          custom: {
            buttons: ["edit"],
          },
        },
      ]),
      fetch: (data) => {
        return fetch(data);
      },
      editUser: (formData: DataItem) => {
        return apiUpdate(formData).then(() => {
          $q.notify({
            message: "已更新",
            color: "positive",
            position: "top",
            icon: "done",
          });
        });
      },
    };
  },
});
</script>
