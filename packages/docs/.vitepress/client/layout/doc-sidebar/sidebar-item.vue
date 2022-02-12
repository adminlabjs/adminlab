<template>
  <q-expansion-item
    dense
    v-if="menu.children"
    :icon="menu.icon"
    :label="menu.text"
    default-opened
    :group="group"
  >
    <sidebar-item
      v-for="child in menu.children"
      :key="child.link"
      :menu="child"
      :group="menu.text"
      :path="path"
      is-child
      @click="onClickItem"
    ></sidebar-item>
  </q-expansion-item>

  <q-item
    v-ripple
    clickable
    v-else
    :key="menu.link"
    :href="menu.link"
    :class="{ 'q-item-active': active }"
    :inset-level="isChild ? 1.0 : 0"
    dense
    @click="onClickItem"
  >
    <q-item-section avatar v-if="menu.icon">
      <q-icon :name="menu.icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ menu.text }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, watch, computed } from "vue";
import { useRoute } from "vitepress";

export default defineComponent({
  name: "SidebarItem",

  setup(props, { emit }) {
    const route = useRoute();
    const currentPath = props.path;
    const currentLink = props.menu.link;

    const isOpen = () => {
      const children = props.menu.children;
      if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
          const path = children[i].link;
          if (currentPath.startsWith(path)) return true;
        }
      }
      return false;
    };

    return {
      isOpen: isOpen(),
      active: computed(() => props.path.startsWith(currentLink)),
      onClickItem: (e) => emit("change"),
    };
  },

  props: {
    menu: {
      type: Object,
      default: () => ({}),
    },

    group: String,
    path: String,
    isChild: Boolean,
  },
});
</script>

<style lang="scss">
.q-item-active {
  color: #1976d2;
  background: #e6f8ff;
}
</style>
