<template>
  <div class="element-demo-1">
    <el-table :data="tableData" v-loading="loading">
      <el-table-column prop="date" label="过期时间" width="180" />
      <el-table-column prop="name" label="用户姓名" width="180" />
      <el-table-column prop="address" label="住址" />

      <el-table-column width="100">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="text-center q-mt-md">
      <el-pagination
        :page="query.page"
        :page-size="query.pageSize"
        :total="total"
        @current-change="onPageChange"
        @size-change="onSizeChange"
        layout="prev,pager,next,sizes,total"
      ></el-pagination>
    </div>

    <el-dialog v-model="dialogVisible" title="编辑" width="36%">
      <el-form>
        <el-form-item label="过期时间">
          <el-date-picker v-model="formData.date"></el-date-picker>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
            placeholder="输入用户姓名"
            v-model="formData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="住址">
          <el-input
            placeholder="输入住址"
            v-model="formData.address"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";

export default defineComponent({
  setup() {
    const loading = ref(false);
    const tableData = ref<any[]>([]);
    const dialogVisible = ref(false);
    const formData = ref<any>({});

    const query = reactive({
      page: 1,
      pageSize: 10,
    });

    const total = ref(0);

    const loadData = (): Promise<{
      listData: any[];
      total: number;
    }> => {
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
    };

    const fetch = () => {
      loading.value = true;
      loadData()
        .then((response) => {
          tableData.value = response.listData;
          total.value = response.total;
        })
        .finally(() => {
          loading.value = false;
        });
    };

    fetch();

    return {
      loading,
      tableData,
      query,
      total,
      dialogVisible,
      formData,

      onPageChange(page: number) {
        query.page = page;
        fetch();
      },
      onSizeChange(size: number) {
        query.pageSize = size;
        fetch();
      },
      handleEdit(data: any) {
        dialogVisible.value = true;
        formData.value = Object.assign({}, data);
      },
    };
  },
});
</script>

<style scoped>
.element-demo-1 :deep(table) {
  margin: 0;
}
.element-demo-1 :deep(ul) {
  margin: 0;
}
</style>
