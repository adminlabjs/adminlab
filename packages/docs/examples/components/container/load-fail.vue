<template>
  <a-container :columns="columns" :action-get="fetch" :page-size="3">
    <a-toolbar :actions="['refresh']"></a-toolbar>
    <q-table></q-table>
    <q-pagination></q-pagination>
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
          label: "#ID",
        },
        {
          field: "user_name",
          label: "用户名",
        },
        {
          field: "link",
          label: "个人主页",
          custom: {
            define: "link",
          },
        },
      ]),
      fetch: (data) => {
        return fetch({
          page: data.page,
          pageSize: data.pageSize,
        }).then((response) => {
          return Math.random() > 0.5 ? Promise.reject("load fail") : response;
        });
      },
    };
  },
});
</script>
