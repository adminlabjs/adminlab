<template>
  <q-layout class="container doc-layout" view="hHh LpR fFf">
    <q-header bordered class="bg-white">
      <q-toolbar>
        <ClientOnly>
          <q-btn
            dense
            flat
            round
            icon="menu"
            @click="toggleLeftDrawer"
            class="text-black"
            v-if="!leftDrawerOpen && !isHome"
          />
        </ClientOnly>

        <q-toolbar-title class="doc-layout-title">
          <a class="nav-bar-title" href="/">Adminlab</a>
        </q-toolbar-title>

        <q-btn-dropdown
          :label="'v' + $adminlab.version"
          class="text-secondary"
          flat
          no-caps
          stretch
          v-if="$q.screen.gt.xs"
        >
          <q-list dense padding>
            <q-item-label header
              >Adminalb v{{ $adminlab.version }}</q-item-label
            >
            <q-item
              clickable
              tag="a"
              href="https://github.com/adminlabjs/adminlab/issues"
              target="_blank"
              rel="noopener"
            >
              <q-item-section> BUG 反馈 </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <ClientOnly>
          <q-btn flat round class="text-black" @click="openGitee">
            <svg
              t="1643345843395"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1440"
              width="23"
              height="23"
            >
              <path
                d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z"
                fill="#C71D23"
                p-id="1441"
              ></path>
            </svg>
            <q-tooltip>前往Gitee</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            icon="fab fa-github"
            class="text-black"
            @click="openGitHub"
          >
            <q-tooltip>前往GitHub</q-tooltip>
          </q-btn>

          <q-btn
            dense
            flat
            round
            icon="menu_book"
            @click="toggleRightDrawer"
            class="text-black"
            v-show="!rightDrawerOpen && !isHome && showToc"
          />
        </ClientOnly>
      </q-toolbar>
    </q-header>

    <ClientOnly v-if="!isHome">
      <doc-sidebar
        v-model="leftDrawerOpen"
        @close="leftDrawerOpen = false"
        :path="currentPath"
      ></doc-sidebar>

      <doc-toc
        v-model="rightDrawerOpen"
        @close="rightDrawerOpen = false"
        @changed="onTocChange"
      ></doc-toc>
    </ClientOnly>

    <q-page-container class="full-width">
      <doc-content :is-home="isHome"></doc-content>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, watch, computed, ref, onMounted } from "vue";

import { DocSidebar } from "./doc-sidebar";
import { DocContent } from "./doc-content";
import { DocToc } from "./doc-toc";

import { useData, useRoute } from "vitepress";
import { openURL } from "quasar";
import config from "../config";
import { useProgress } from "./use-progress";

export default defineComponent({
  setup() {
    const { page } = useData();
    const route = useRoute();
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const showToc = ref(true);

    onMounted(() => {
      useProgress();
    });

    return {
      currentPath: computed(() => route.path),
      leftDrawerOpen,
      rightDrawerOpen,

      toggleLeftDrawer: () => {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      toggleRightDrawer: () => {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },

      openGitHub() {
        openURL(config.github);
      },

      openGitee() {
        openURL(config.gitee);
      },

      onTocChange(visible: boolean) {
        showToc.value = visible;
      },

      isHome: computed(() => page.value.frontmatter?.home),
      showToc,
    };
  },

  components: {
    DocSidebar,
    DocToc,
    DocContent,
  },
});
</script>

<style lang="scss">
.q-link:hover {
  text-decoration: none;
}

.doc-content {
  opacity: 0;
}

.nav-bar-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text);
  // display: flex;
  // justify-content: center;
  // align-items: center;
  &:hover {
    text-decoration: none;
  }
}
</style>
