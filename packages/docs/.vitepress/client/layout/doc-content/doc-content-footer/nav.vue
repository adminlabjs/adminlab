<template>
  <div class="row doc-content-footer-nav">
    <div v-if="siblings.prev">
      <a :href="siblings.prev.link">
        <q-icon name="navigate_before" size="26px"></q-icon>
        {{ siblings.prev.text }}
      </a>
    </div>

    <q-space></q-space>

    <div v-if="siblings.next">
      <a :href="siblings.next.link">
        {{ siblings.next.text }}
        <q-icon name="navigate_next" size="26px"></q-icon>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useData } from "vitepress";

export default defineComponent({
  setup() {
    const { site, page } = useData();

    const sidebar = computed(() => site.value.themeConfig?.sidebar || []);

    const index = computed(() => {
      const index: [number?, number?] = [];

      let path = page.value.relativePath.replace(/\.md/, ".html");

      if (!path.startsWith("/")) {
        path = `/${path}`;
      }

      const i = sidebar.value.findIndex((item) => {
        if (item.link === path) return true;

        if (item.children && item.children.length) {
          const subindex = item.children.findIndex((val) => val.link === path);
          if (subindex > -1) {
            index.push(subindex);
            return true;
          }
        }
        return false;
      });

      if (i > -1) {
        index.unshift(i);
      }

      return index;
    });

    const hasChildren = (data: any) => {
      return data && Array.isArray(data.children) && data.children.length > 0;
    };

    const siblings = computed(() => {
      const _index = index.value;
      const _sidebar = sidebar.value;

      const siblings = {
        prev: null,
        next: null,
      };

      const firstIndex = _index[0];
      const secondIndex = _index[1];

      let prev;

      if (isNaN(secondIndex) || secondIndex === 0) {
        prev = _sidebar[firstIndex - 1];
      } else {
        prev = _sidebar[firstIndex].children[secondIndex - 1];
      }

      if (hasChildren(prev)) {
        prev = prev.children.slice(-1)[0];
      }

      let next = _sidebar[firstIndex];

      if (isNaN(secondIndex) || secondIndex === next.children.length - 1) {
        next = _sidebar[firstIndex + 1];
      } else {
        next = next.children[secondIndex + 1];
      }

      if (hasChildren(next)) {
        next = next.children[0];
      }

      if (prev) siblings.prev = prev;
      if (next) siblings.next = next;

      return siblings;
    });

    return {
      siblings,
    };
  },
});
</script>

<style scoped lang="less">
.doc-content-footer-nav {
	a {
		display: flex;
		align-items: center;
		
		&:hover {
			text-decoration: none;
		}
	}
}
</style>
