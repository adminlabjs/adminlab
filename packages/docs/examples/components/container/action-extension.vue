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
          label: "#id",
        },
        {
          field: "user_name",
          label: "用户名",
          custom: {
            action: {
              editable: true,
            },
          },
        },
        {
          field: "link",
          label: "用户主页",
          custom: {
            define: "link",
            action: {
              editable: true,
            }
          }
        },
        {
          label: "操作",
          custom: {
            buttons: (formData) => [
              {
                action: "edit",
                label: "编辑用户",
              },
              {
                label: "找回用户 " + formData.id,
                handler: () => {
                  $q.notify({
                    message: `功能暂未开放`,
                    position: "center",
                    color: "info",
                  });
                },
                confirm: {
                  title: "提示",
                  content: "你确定要这么做还是不确定呢"
                },
                props: {
                  disable: !!(formData.id % 2),
                },
              },
              {
                dropdown: {
                  label: "更多",
                  buttons: ["delete", {
                    action: "edit",
                    label: "编辑这个用户"
                  }, {
                    label: "不弹确认框",
                    handler: () => {
                      $q.notify({
                        message: "你看，这个没弹确认框吧",
                      })
                    }
                  }],
                },
              },
            ],
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
