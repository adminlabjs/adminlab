<template>
  <div>{{ $adminlab.version }}</div>
  <div style="padding: 30px">
    <a-container
      :columns="columns"
      :action-get="fetch"
      :action-edit="update"
      :action-delete="deleteUser"
      :action-create="createUser"
      :show-when="showWhen"
    >
      <a-toolbar> </a-toolbar>
      <a-searcher layout="12" layout-md="6,6,4,4,4"></a-searcher>

      <q-table></q-table>

      <q-pagination></q-pagination>

      <a-form-dialog @change="onFormChange" layout="12" layout-sm="12,6,6,6,6,6,6,6"></a-form-dialog>
    </a-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, h } from "vue";
import { defineColumns } from "adminlab";
import {
  useMockApi,
  loadCities,
  loadProvinces,
  loadTeams,
} from "@adminlab/use-api";
import type { DataItem } from "@adminlab/use-api";

export default defineComponent({
  setup() {
    const n = ref(1);

    setInterval(() => (n.value = Math.random()), 1000);

    const {
      fetch,
      create: apiCreate,
      delete: apiDelete,
      update: apiUpdate,
    } = useMockApi();

    return {
      columns: defineColumns<DataItem>([
        {
          label: "ID",
          field: "id",
          name: "id",
          sortable: true,
          custom: {
            define: "link",
            transformer: (formData) => formData.link,
            action: {
              searchable: true,
            },
          },
        },
        {
          label: "用户等级",
          field: "level",
          custom: {
            map: {
              options: [
                {
                  label: "管理员",
                  value: 1,
                },
                {
                  label: "组长",
                  value: 2
                },
                {
                  label: "成员",
                  value: 3,
                }
              ],
              // formType: "input",
            },
            action: {
              creatable: true,
              editable: true,
            },
          },
        },
        {
          label: "用户名",
          field: "user_name",
          custom: {
            name: "name",
            action: {
              creatable: true,
              editable: true,
              searchable: true,
            },
            props: (type) => {
              if (type === "creator") {
                return {
                  readonly: true,
                };
              }
            },
          },
        },
        {
          label: "头像",
          field: "avatar",
          custom: {
            define: "avatar",
            name: "avatar",
            props: (from) => {
              if (from === "table")
                return {
                  "spinner-size": "12px",
                };
            },
          },
        },
        {
          field: "is_online",
          label: "状态",
          custom: {
            name: "status",
            map: {
              type: "status",
              options: [
                {
                  value: 0,
                  label: "在线",
                  color: "#50cf56",
                  props: () => ({
                    size: "sm",
                  }),
                },
                {
                  value: 1,
                  label: "离线",
                  color: "#6c6161",
                  props: () => ({
                    size: "sm",
                    square: true,
                  }),
                },
              ],
            },
          },
        },
        {
          label: "组合展示",
          custom: {
            template: {
              children: ["{{avatar}}{{name}}", "{{status}}"],
              style: {
                display: "flex",
                "flex-direction": "column",
              },
            },
          },
        },
        {
          label: "模板(Function)",
          custom: {
            template: (parse) => {
              const result = parse(["avatar", "name"]);
              return result.name ? result.name : h("div");
            },
          },
        },
        {
          label: "主色",
          field: "color",
          custom: {
            define: "color",
            action: {
              editable: true,
              creatable: true,
            },
            extension: {
              useInput: (type) => type === "editor",
            },
            props: (from) => {
              return {
                readonly: from === "creator",
              };
            },
          },
        },
        {
          label: "进度条",
          field: "progress",
          custom: {
            define: "progress",
            props: (from, row) => {
              if (from === "table") {
                return {
                  color: row && row.progress >= 50 ? "red" : "blue",
                };
              }
            },
          },
        },
        {
          label: "城市",
          field: "city",
          custom: {
            map: {
              loadOptions: loadCities,
            },
            action: {
              creatable: true,
              editable: true,
              searchable: true,
            },
          },
        },
        {
          label: "所在区",
          field: "province",
          custom: {
            map: {
              dependsOn: "city",
              loadOptions: (row) => loadProvinces(row.city),
            },
            action: {
              creatable: true,
              editable: true,
              searchable: true,
            },
          },
        },
        {
          label: "小组",
          field: "team",
          custom: {
            map: {
              dependsOn: "province",
              loadOptions: (row) => loadTeams(row.province),
            },
            action: {
              creatable: true,
              editable: true,
              searchable: true,
            },
          },
        },
        {
          label: "创建时间",
          field: "created_at",
          custom: {
            define: "datetime",
            action: {
              creatable: true,
              editable: true,
            },
          },
        },
        {
          label: "更新时间",
          field: "updated_at",
          custom: {
            define: "date",
            action: {
              creatable: true,
              editable: true,
            },
          },
        },
        {
          label: "操作",
          width: "390px",
          custom: {
            buttons: () => [
              "delete",
              "edit",
              {
                dropdown: {
                  buttons: ["copy", "create", "delete", () => "copy"],
                },
              },
              {
                action: "custom",
                confirm: {
                  title: "自定义Title",
                  content: "确定刷新页面？",
                },
                handler: () => Promise.resolve(),
                autoRefresh: false,
              },
              (row) => ({
                action: "Function",
                props: {
                  label: "function",
                  color: "warning",
                  disabled: !!row.is_deleted,
                },
                confirm: {
                  title: "提示哟",
                  content: `确定要指定${row.id}吗`,
                },
                handler: () => {},
              }),
            ],
          },
        },
      ]).map((item) => ({
        ...item,
        prop: item.field,
        sortable: "custom",
      })),
      n,

      fetch(data, ...args: any[]) {
        console.log("fetch", data, args);
        return fetch(data);
      },

      update: apiUpdate,
      createUser: apiCreate,
      deleteUser: (formData: DataItem) => {
        return apiDelete(formData.id);
      },

      showWhen(event: { formData: IObject; field: string; from: string }) {
        const { formData, field } = event;

        if (field === "task_id") {
          return formData.color === "#000";
        }

        return true;
      },

      onFormChange(formData: IObject) {
        console.log("Form-Dialog FormData changed", formData);
      },

      handleToolbarAction(action: string) {
        console.log("toolbar action", action);
      },

      handleClickCustomToolbarBtn() {
        console.log("点击了自定义按钮");
      },
    };
  },
});
</script>
