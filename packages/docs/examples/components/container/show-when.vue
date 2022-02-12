<template>
  <a-container
    :columns="columns"
    :action-get="fetch"
    :action-edit="editUser"
    :action-create="createUser"
    :page-size="3"
    :show-when="showWhen"
  >
    <a-toolbar :actions="['create']"></a-toolbar>
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
    const { fetch, create: apiCreate, update: apiUpdate } = useMockApi();
    const $q = useQuasar();

    return {
      columns: defineColumns<DataItem>([
        {
          field: "id",
          label: "#id",
        },
        {
          field: "user_name",
          label: "用户名",
          custom: {
            name: "user_name",
          },
        },
        {
          field: "city",
          label: "所在地",
          custom: {
            action: {
              editable: true,
              creatable: true,
            },
            map: {
              loadOptions: () => loadCities(),
            },
            props: (from) => {
              if (from !== "table") {
                return {
                  clearable: true,
                };
              }
            },
          },
        },
        {
          field: "province",
          label: "所在区",
          custom: {
            action: {
              editable: true,
              creatable: true,
            },
            map: {
              dependsOn: "city",
              loadOptions: (formData) => loadProvinces(formData.city),
            },
            props: (from) => {
              if (from !== "table") {
                return {
                  clearable: true,
                };
              }
            },
          },
        },
        {
          field: "team",
          label: "所属小组",
          custom: {
            action: {
              editable: true,
              creatable: true,
            },
            map: {
              dependsOn: "province",
              loadOptions: (formData) => loadTeams(formData.province),
            },
            props: (from) => {
              if (from !== "table") {
                return {
                  clearable: true,
                };
              }
            },
          },
        },
        {
          custom: {
            buttons: ["edit", "copy"],
          },
        },
      ]),
      fetch: (data) => {
        return fetch({
          page: data.page,
          pageSize: data.pageSize,
        });
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
      showWhen: (event) => {
        const { from, field, formData } = event;
        if (from === "creator") {
          if (field === "province") {
            return !!formData.city;
          }
          if (field === "team") {
            return !!formData.province;
          }
          return true;
        }
        return true;
      },
    };
  },
});
</script>
