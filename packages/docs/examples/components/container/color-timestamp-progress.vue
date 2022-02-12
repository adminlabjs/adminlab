<template>
  <a-container :columns="columns" :action-get="fetch" :action-edit="editUser" :page-size="3">
    <q-table></q-table>
  </a-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMockApi } from "@adminlab/use-api";
import type { DataItem } from "@adminlab/use-api";
import { defineColumns } from "adminlab";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const { fetch, update: apiUpdate } = useMockApi();

    return {
      columns: defineColumns<DataItem>([
        {
          field: "created_at",
          label: "date",
          custom: {
            define: "date",
            action: {
              editable: true,
            }
          },
        },
        {
          field: "updated_at",
          label: "datetime",
          custom: {
            define: "datetime",
            action: {
              editable: true,
            }
          },
        },
        {
          field: 'last_login_time',
          label: "time",
          custom: {
            define: "time",
            action: {
              editable: true,
            }
          }
        },
        {
          field: "progress",
          label: "progress",
          custom: {
            define: "progress",
          },
        },
        {
          field: "color",
          label: "color",
          custom: {
            define: "color",
            action: {
              editable: true,
            }
          }
        },
        {
          custom: {
            buttons: ['edit']
          }
        }
      ]),
      fetch: (data) => {
        return fetch({
          page: data.page,
          pageSize: data.pageSize,
        });
      },
      editUser: (formData: DataItem) => {
        return apiUpdate(formData).then(() => {
          $q.notify({
            message: "已更新",
            color: "positive",
            position: "top",
            icon: "done",
          });
        });
      },
    };
  },
});
</script>
