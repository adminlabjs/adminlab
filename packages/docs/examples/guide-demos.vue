<template>
  <a-container
    :action-get="get"
    :action-edit="update"
    :action-delete="actionDelete"
    :action-create="create"
    :columns="columns"
    :show-when="showWhen"
    ref="container"
  >
    <a-toolbar :search="false" class="wrap">
      <a-toolbar-btn outline @click="handlePrintData"
        >在控制台打印当前页数据</a-toolbar-btn
      >
    </a-toolbar>
    <a-searcher layout="12" layout-sm="6,6,4,4,4"></a-searcher>
    <a-form-dialog layout="12" layout-sm="12,6,6,6,6,6"></a-form-dialog>

    <q-table flat></q-table>
    <q-pagination></q-pagination>
  </a-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  loadCities,
  loadProvinces,
  loadTeams,
  useMockApi,
} from "@adminlab/use-api";
import type { DataItem } from "@adminlab/use-api";
import { defineColumns } from "adminlab";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const { fetch, update, create, delete: actionDelete } = useMockApi();
    const containerRef = ref<any>(null);
    const $q = useQuasar();

    return {
      get: fetch,
      update,
      create,
      actionDelete: (data) => {
        return actionDelete(data.id);
      },
      handlePrintData() {
        console.log(containerRef.value.getTableData());
      },

      container: containerRef,

      columns: defineColumns<DataItem>([
        {
          field: "id",
          label: "#id",
          custom: {
            action: {
              searchable: true,
            },
            props: (from) => {
              if (from === "searcher") {
                return {
                  placeholder: "请输入ID",
                  label: "ID",
                };
              }
            },
          },
        },
        {
          field: "level",
          label: "用户级别",
          custom: {
            action: {
              creatable: true,
              editable: true,
            },
            map: {
              options: [
                {
                  label: "管理员",
                  value: 1,
                  color: "red-5",
                  textColor: "white",
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
              ],
              formType: "radio",
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
          field: "user_name",
          label: "名称",
          custom: {
            name: "user_name",
            action: {
              creatable: true,
              editable: true,
              searchable: true,
            },
            visible: false,
          },
        },
        {
          field: "avatar",
          label: "头像",
          custom: {
            name: "avatar",
            define: "avatar",
            props: (type) => {
              if (type === "table") {
                return {
                  "spinner-size": "12px", // quasar
                };
              }
            },
            visible: false,
          },
        },
        {
          field: "progress",
          label: "任务进度",
          custom: {
            define: "progress",
            props: (from, row) => {
              if (from === "table") {
                return {
                  color: row.progress > 0.5 ? "red" : "blue",
                  size: "10px",
                  stripe: true,
                  rounded: true,
                };
              }
            },
          },
        },
        {
          field: "is_online",
          label: "用户状态",
          custom: {
            name: "is_online",
            map: {
              type: "status",
              options: [
                {
                  label: "在线",
                  value: 1,
                  color: "rgb(80, 207, 86)",
                },
                {
                  label: "离线",
                  value: 0,
                  color: "#9d6666",
                },
              ],
            },
            visible: false,
          },
        },
        {
          label: "用户",
          custom: {
            template: {
              children: [
                "{{avatar}}",
                {
                  children: "{{user_name}}{{is_online}}",
                  style: {
                    display: "flex",
                    "justify-content": "center",
                    "flex-direction": "column",
                    "margin-left": "10px",
                    "margin-top": 0,
                  },
                },
              ],
              style: {
                display: "flex",
                "align-items": "center",
              },
            },
          },
        },
        {
          field: "city",
          label: "所在城市",
          custom: {
            visible: false,
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
          field: "province",
          label: "所在区",
          custom: {
            visible: false,
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
          field: "team",
          label: "所属小组",
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
          field: "color",
          label: "随机色",
          custom: {
            define: "color",
          },
        },
        {
          field: "link",
          label: "个人主页",
          custom: {
            define: "link",
          },
        },
        {
          field: "updated_at",
          label: "更新时间",
          custom: {
            define: "datetime",
          },
        },
        {
          label: "操作",
          custom: {
            buttons: (row) => [
              "edit",
              "delete",
              {
                label: "发消息",
                props: {
                  disabled: !row.is_online,
                },
                confirm: {
                  title: "提示",
                  content: `确定要给用户 ${row.user_name} 发送消息吗`,
                },
                handler: () => {
                  $q.notify({
                    message: "功能未开放",
                    color: "warning",
                    position: "center",
                    icon: "warning",
                  });
                },
              },
              {
                dropdown: {
                  buttons: ["copy"],
                },
              },
            ],
          },
        },
      ]),

      showWhen: (event: {
        formData: DataItem;
        from: string;
        field: string;
      }) => {
        const { formData, from, field } = event;
        if (from !== "searcher") {
          if (field === "province") {
            return !!formData.city;
          }
          if (field === "team") {
            return !!formData.province;
          }
        }
        return true;
      },
    };
  },
});
</script>
