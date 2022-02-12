<template>
  <div class="doc-layout-content full-width">
    <Layout v-if="isHome"></Layout>

    <div class="d-flex flex-column">
      <Content :class="{ 'doc-content': !mounted }" />
      <DocContentFooter v-if="!isHome" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import DefaultTheme from "vitepress/theme";
import { DocContentFooter } from "./doc-content-footer";

const { Layout } = DefaultTheme;

export default defineComponent({
  setup() {
    const mounted = ref(false);

    onMounted(() => (mounted.value = true));

    return {
      mounted,
    };
  },

  props: {
    isHome: Boolean,
  },

  components: {
    Layout,
    DocContentFooter,
  },
});
</script>

<style scoped lang="less">
.doc-layout {
  .doc-layout-content {
    padding: 20px 30px;
    display: flex;
    overflow-x: hidden;
		justify-content: center;

    > * {
      &:first-child {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
      }
    }

    a {
      font-family: monospace;
    }
  }

  .doc-layout-title {
    color: #2c3e50;
    font-weight: 600;
    text-indent: 1rem;
  }
}
</style>
