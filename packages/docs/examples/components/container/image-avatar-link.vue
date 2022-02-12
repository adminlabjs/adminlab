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
          field: "avatar",
          label: "用户头像",
          custom: {
            define: "avatar",
            props: () => ({
              "spinner-size": "20px"
            })
          },
        },
        {
          field: "link",
          label: "用户主页",
          custom: {
            define: "link",
          },
        },
        {
          field: "image",
          label: "封面",
          custom: {
            define: "image",
            props: () => ({
              "spinner-size": "20px"
            })
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
