<template>
  <a-container
    :columns="columns"
    :action-get="fetch"
    :action-edit="editUser"
    :page-size="3"
  >
    <q-table></q-table>
    <a-form-dialog layout="12"></a-form-dialog>
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
    const { fetch, update: apiUpdate } = useMockApi();
    const $q = useQuasar();

    return {
      columns: defineColumns<DataItem>([
        {
          field: "user_name",
          label: "用户名",
        },
        {
          field: "level",
          label: "等级",
          custom: {
            map: {
              options: [
                {
                  label: "管理员",
                  value: 1,
                  color: "red-5",
                },
                {
                  label: "小组长",
                  value: 2,
                  color: "light-blue-3",
                },
                {
                  label: "组员",
                  value: 3,
                  color: "deep-purple-3",
                },
              ].map((item) => ({
                ...item,
                textColor: "white",
              })),
              formType: "radio",
            },
            action: {
              editable: true,
            },
            props: (from) => {
              if (from === "table") {
                return {
                  size: "xs",
                  square: true,
                };
              }
            },
          },
        },
        {
          custom: {
            buttons: ["edit"],
          },
        },
      ]),
      fetch: (data) => {
        return fetch({
          page: data.page,
          pageSize: data.pageSize,
        });
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
