<template>
  <q-drawer
    class="doc-toc"
    show-if-above
    side="right"
    :width="200"
    v-if="headers.length"
  >
    <q-scroll-area class="fit full-height">
      <q-list>
        <q-item
          v-for="item in headers"
          :inset-level="item.insetLevel"
          clickable
          dense
          :active="activeToc === item.slug"
          @click.prevent.stop="scrollTo(item.slug, $event)"
        >
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick, watchEffect } from "vue";

import { useData } from "vitepress";
import { useScroll } from "./use-scroll";
import { useQuasar } from "quasar";

export default defineComponent({
  setup(props, { emit }) {
    const { page } = useData();
    const showDrawer = ref(false);

    const $q = useQuasar();

    const { scrollTo, activeToc, tocList } = useScroll();
    const headers = computed(() =>
      tocList.value.map((item) => ({
        ...item,
        insetLevel: (item.level - 2) * 0.2,
      }))
    );

		watchEffect(() => {
			emit("changed", headers.value.length > 1);
		})

    return {
      headers,

      showDrawer,
      activeToc,
      scrollTo: (toc) => {
        if ($q.screen.width <= 1023) emit("close");

        nextTick(() => {
          scrollTo(toc);
        });
      },
    };
  },
});
</script>

<style lang="scss">
.doc-toc {
  flex: none;
  padding-top: 26px;

  .q-item {
    font-size: 13px;
    border-radius: 10px 0 0 10px;
    margin: 2px 0;
    color: rgba(0, 0, 0, 0.6);

    &.q-router-link--active {
      color: #1976d2;
      background: #e6f1fc;
    }
  }
}
</style>
