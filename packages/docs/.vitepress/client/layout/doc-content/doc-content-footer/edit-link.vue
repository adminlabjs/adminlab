<template>
  <div class="footer-edit-link text-center q-mt-md text-body2">
    <div>
      发现了错误或者想要为文档做贡献？
      <a
        class="cursor-pointer github-link"
        :href="link"
        target="_blank"
        ref="noopener noreferrer"
        >在 GitHub 上编辑此页</a
      >
    </div>

    <div class="q-mt-sm">
      最后更新于：<span class="text-blue-grey-9">{{ updatedAt }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useData } from "vitepress";
import { formatTime } from "../../../util";
import config from "../../../config";

export default defineComponent({
  setup() {
    const { page } = useData();
    const updatedAt = computed(() => formatTime(page.value.lastUpdated));
    const link = computed(() => {
      return `${config.github}/edit/master/packages/docs/${page.value.relativePath}`;
    });

    return {
      updatedAt,
      link,
    };
  },
});
</script>

<style scoped lang="less">
.footer-edit-link {
  border: 1px solid #eaecef;
  border-radius: 5px;
  padding: 1rem;
}

.github-link {
  &:hover {
    text-decoration: none;
  }
}
</style>
