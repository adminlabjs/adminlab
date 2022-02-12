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
          field: "avatar",
          label: "头像",
          custom: {
            define: "avatar",
            name: "avatar",
          },
        },
        {
          label: "用户信息",
          custom: {
            template: "{{avatar}}{{user_name}}",
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
