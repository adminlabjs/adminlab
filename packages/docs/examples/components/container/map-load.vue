<template>
  <a-container
    :columns="columns"
    :action-get="fetch"
    :action-edit="editUser"
    :page-size="3"
  >
    <q-table></q-table>
  </a-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  useMockApi,
  loadCities,
  loadProvinces,
  loadTeams,
} from "@adminlab/use-api";
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
          field: "user_name",
          label: "用户名",
          custom: {
            action: {
              creatable: true,
              editable: true,
            },
          },
        },
        {
          field: "city",
          label: "所在市",
          custom: {
            action: {
              editable: true,
            },
            map: {
              loadOptions: () => loadCities(),
            },
          },
        },
        {
          field: "province",
          label: "所在区",
          custom: {
            action: {
              editable: true,
            },
            map: {
              dependsOn: "city",
              loadOptions: (formData) => loadProvinces(formData.city),
            },
          },
        },
        {
          field: "team",
          label: "小组",
          custom: {
            action: {
              editable: true,
            },
            map: {
              dependsOn: "province",
              loadOptions: (formData) => loadTeams(formData.province),
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
