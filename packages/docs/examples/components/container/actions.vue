<template>
  <a-container
    :columns="columns"
    :action-get="fetch"
    :action-create="createUser"
    :action-edit="editUser"
    :action-delete="deleteUser"
    :page-size="3"
  >
    <q-table></q-table>
    <q-pagination></q-pagination>
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

    const { fetch, create: apiCreate, delete: apiDelete, update: apiUpdate } = useMockApi();

    return {
      columns: defineColumns<DataItem>([
        {
          field: "id",
          label: "#ID",
        },
        {
          field: "user_name",
          label: "用户名",
          custom: {
            action: {
              creatable: true,
              editable: true,
            }
          }
        },
        {
          field: "link",
          label: "个人主页",
          custom: {
            define: "link",
            action: {
              creatable: true,
              editable: true,
            }
          }
        },
        {
          label: "操作",
          custom: {
            buttons: ["edit", "copy", "delete"],
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
      deleteUser: (formData: DataItem) => {
        return apiDelete(formData.id).then(() => {
          $q.notify({
            message: "已删除",
            color: "positive",
            position: "top",
            icon: "done",
          })
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
