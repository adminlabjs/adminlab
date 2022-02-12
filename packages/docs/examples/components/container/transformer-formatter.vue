<template>
  <a-container :columns="columns" :action-get="fetch" :page-size="3">
    <q-table></q-table>
  </a-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMockApi } from "@adminlab/use-api";
import type { DataItem } from "@adminlab/use-api";
import { defineColumns } from "adminlab";

export default defineComponent({
  setup() {
    const { fetch } = useMockApi();

    return {
      columns: defineColumns<DataItem>([
        {
          field: "id",
          label: "ID",
          custom: {
            formatter: "#{{id}}",
          },
        },
        {
          field: "user_name",
          label: "用户名",
          custom: {
            formatter: (row) => "U:" + row.user_name,
          },
        },
        {
          field: "level",
          label: "是否管理员",
          custom: {
            transformer: (row) => (row.level === 1 ? 1 : 0),
            map: {
              options: [
                {
                  value: 1,
                  label: "管理员",
                  color: "primary",
                  textColor: "white",
                },
                {
                  value: 0,
                  label: "非管理",
                },
              ],
            },
            props: () => ({
              size: "sm",
            }),
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
