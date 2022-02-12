<template>
  <a-container :columns="columns" :action-get="fetch" :page-size="3">
    <q-table></q-table>
  </a-container>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
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
          label: "#id",
        },
        {
          field: "user_name",
          label: "用户名",
          custom: {
            render: (scope) => {
              return h("div", null, `用户名：${scope.row.user_name}`);
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
