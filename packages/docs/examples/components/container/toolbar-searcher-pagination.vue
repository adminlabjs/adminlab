<template>
  <a-container
    :columns="columns"
    :action-get="fetch"
    :action-create="createUser"
    :action-edit="editUser"
    :page-size="3"
  >
    <a-toolbar></a-toolbar>
    <a-searcher></a-searcher>
    <q-table></q-table>
    <q-pagination></q-pagination>
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
    const { fetch, create: apiCreate, update: apiUpdate } = useMockApi();
    const $q = useQuasar();

    return {
      columns: defineColumns<DataItem>([
        {
          field: "id",
          label: "id",
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
              creatable: true,
              searchable: true,
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
              editable: true,
            },
          },
        },
        {
          field: "city",
          label: "所在市",
          custom: {
            action: {
              searchable: true,
              creatable: true,
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
              searchable: true,
              creatable: true,
            },
            map: {
              dependsOn: "city",
              loadOptions: (formData) => loadProvinces(formData.city),
            },
          },
        },
        {
          field: "team",
          label: "小分队",
          custom: {
            map: {
              dependsOn: "province",
              loadOptions: (formData) => loadTeams(formData.province),
            },
            action: {
              searchable: true,
              creatable: true,
            },
          },
        },
        {
          field: "keyword",
          label: "关键字",
          custom: {
            visible: false,
            action: {
              searchable: true,
            }
          }
        },
        {
          custom: {
            buttons: ["edit", "copy"],
          },
        },
      ]),
      fetch: (data) => {
        return fetch(data);
      },
      createUser: (formData: DataItem) => {
        return apiCreate(formData).then(() => {
          $q.notify({
            message: "已新增用户",
            color: "positive",
            position: "top",
            icon: "done",
          });
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
