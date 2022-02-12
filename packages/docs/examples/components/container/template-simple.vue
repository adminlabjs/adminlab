<template>
  <a-container :columns="columns" :action-get="fetch" :page-size="1">
    <q-table hide-pagination></q-table>
  </a-container>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import { useMockApi } from "@adminlab/use-api";
import type { DataItem } from "@adminlab/use-api";
import { defineColumns } from "adminlab";

export default defineComponent({
  setup() {
    const { fetch, setFetchDelay } = useMockApi();
    setFetchDelay(0); // 忽视这段代码

    return {
      columns: defineColumns<DataItem>([
        {
          field: "user_name",
          label: "用户名",
          custom: {
            name: "username",
            visible: false,
          },
        },
        {
          field: "avatar",
          label: "头像",
          custom: {
            define: "avatar",
            name: "user_avatar",
            visible: false,
          },
        },
        {
          field: "is_online",
          custom :{
            visible: false,
            name: "level",
            map: {
              options: [
                {
                  value: 0,
                  label: "离线",
                },
                {
                  value: 1,
                  label: "在线",
                  color: "primary",
                  textColor: "white"
                },
              ]
            }
          }
        },
        {
          label: "简单用法",
          custom: {
            template: "{{user_avatar}}{{username}}",
          },
        },
        {
          label: "数组布局",
          custom: {
            template: {
              children: ["{{user_avatar}}{{username}}", "支持传style与css", {
                children: ["状态: {{level}}"],
                classes: "text-black q-flex",
                style: {
                  "font-size": "12px",
                }
              }],
              style: {
                "font-size": "16px",
              },
              classes: "text-primary",
            },
          },
        },
        {
          label: "函数",
          custom: {
            template: (parser) => {
              const result = parser(["user_avatar", "username"]);
              return h("div", null, [result.user_avatar]);
            },
          },
        },
      ]),
      fetch: (data) => {
        return fetch({
          page: data.page,
          pageSize: data.pageSize,
        });
      },
    };
  },
});
</script>
