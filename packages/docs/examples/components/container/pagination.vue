<template>
  <a-container :columns="columns" :action-get="fetch" :page-size="3">
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
          label: "#id",
        },
        {
          field: "user_name",
          label: "用户名",
        },
        {
          field: "updated_at",
          label: "更新时间",
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
