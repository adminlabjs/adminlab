<template>
  <a-container
    :action-get="get"
    :action-create="createUser"
    :columns="columns"
    :page-size="3"
    :rules="rules"
  >
    <a-toolbar :actions="['create']"></a-toolbar>
    <q-table></q-table>
  </a-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { defineColumns } from "adminlab";
import { useMockApi } from "@adminlab/use-api";
import type { DataItem } from "@adminlab/use-api";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const { fetch, create: apiCreate } = useMockApi();
    const $q = useQuasar();

    return {
      get: fetch,
      columns: defineColumns<DataItem>([
        {
          field: "user_name",
          label: "用户名",
          custom: {
            action: {
              creatable: true,
            },
            props: (from) => {
              if (from === "creator") {
                return {
                  label: "用户名 *",
                };
              }
            },
          },
        },
        {
          field: "link",
          label: "用户主页",
          custom: {
            action: {
              creatable: true,
            },
            props: (from) => {
              if (from === "creator") {
                return {
                  label: "用户主页 *",
                };
              }
            },
          },
        },
      ]),
      createUser: (formData) => {
        return apiCreate(formData).then(() => {
          $q.notify({
            message: "新增用户成功",
            position: "top",
          });
        });
      },
      rules: {
        user_name: (user_name: string) => {
          return user_name
            ? user_name.length > 5 || "用户名长度必须要大于5位"
            : "请输入用户名";
        },
        link: (link) => {
          return !!link || "用户主页为必填项";
        },
      },
    };
  },
});
</script>

<style scoped lang="less"></style>
