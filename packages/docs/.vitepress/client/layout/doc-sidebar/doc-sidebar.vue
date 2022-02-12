<template>
  <q-drawer show-if-above :width="300" side="left" class="doc-sidebar">
    <q-scroll-area class="fit full-height">
      <q-list padding dense>
        <sidebar-item
          v-for="menu in menus"
          :menu="menu"
          :key="menu.text"
          :path="path"
          @change="onClickItem"
        ></sidebar-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import SidebarItem from "./sidebar-item.vue";
import { useRoute, useData } from "vitepress";
import { useQuasar } from "quasar";

export default defineComponent({
  setup(props, { emit }) {
    const { page, site } = useData();
    const { sidebar } = site.value.themeConfig;
    const route = useRoute();
    const $q = useQuasar();

    return {
      menus: sidebar,
      onClickItem: (e) => {
        if ($q.screen.width <= 1023) emit("close")
      }
    };
  },

  components: {
    SidebarItem,
  },

  props: {
    path: String,
  },
});
</script>

<style lang="less">
.doc-sidebar {
  .q-item {
    font-size: 0.9em;
    // color: #2c3e50;
    font-weight: 400;
  }

  .q-item__section--avatar {
    color: #00b4ff;
  }

  a:hover {
    text-decoration: none !important;
  }

  .q-list > * {
    margin-top: 0.6rem;

    .q-item {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}
</style>
