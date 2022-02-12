<template>
  <div class="element-demo-2">
    <a-container :action-get="actionGet" :columns="columns">
      <el-table></el-table>
      <el-pagination></el-pagination>
      <a-form-dialog layout="12"></a-form-dialog>
    </a-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { defineColumns } from "adminlab";

export default defineComponent({
  setup() {
    return {
      actionGet: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const data = [
              {
                date: "2016-05-03",
                name: "Tom",
                address: "No. 189, Grove St, Los Angeles",
              },
              {
                date: "2016-05-02",
                name: "Tom",
                address: "No. 189, Grove St, Los Angeles",
              },
              {
                date: "2016-05-04",
                name: "Tom",
                address: "No. 189, Grove St, Los Angeles",
              },
            ];
            resolve({
              listData: data,
              total: data.length,
            });
          }, 1600);
        });
      },

      columns: defineColumns([
        {
          prop: "date",
          label: "过期时间",
          width: "180",
          custom: {
            define: "date",
            action: {
              editable: true,
            },
          },
        },
        {
          prop: "name",
          label: "用户姓名",
          width: "180",
          custom: {
            action: {
              editable: true,
            },
          },
        },

        {
          prop: "address",
          label: "住址",
          custom: {
            action: {
              editable: true,
            },
          },
        },
        {
          width: "100",
          custom: {
            buttons: ["edit"],
          },
        },
      ]),
    };
  },
});
</script>

<style scoped>
.element-demo-2 :deep(table) {
  margin: 0;
}
.element-demo-2 :deep(ul) {
  margin: 0;
}
</style>
