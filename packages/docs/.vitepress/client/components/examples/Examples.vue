<template>
  <q-card class="doc-example">
    <q-toolbar class="doc-example-toolbar">
      <q-space></q-space>

      <div class="col-auto" v-if="components[path]">
        <q-btn dense flat round @click="openGitee">
          <svg
            t="1643288414357"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1491"
            width="23"
            height="23"
          >
            <path
              d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z"
              fill="#354050"
              p-id="1492"
            ></path>
          </svg>
          <q-tooltip>在 Gitee 上查看</q-tooltip>
        </q-btn>

        <q-btn dense flat round icon="fab fa-github" @click="openGitHub">
          <q-tooltip>在 GitHub 上查看</q-tooltip>
        </q-btn>

        <q-btn dense flat round icon="code" @click="expanded = !expanded">
          <q-tooltip>查看源代码</q-tooltip>
        </q-btn>
      </div>

      <span v-else>正在加载中..</span>
    </q-toolbar>

    <q-separator v-if="components[path]"></q-separator>

    <q-slide-transition>
      <div v-if="components" v-show="expanded">
        <q-tabs
          v-model="currentTab"
          align="left"
          :breakpoint="0"
          active-color="blue-5"
          indicator-color="blue-5"
        >
          <q-tab
            v-for="{ tab } in tabs"
            :key="`tab-${tab}`"
            :label="tab"
            :name="tab"
          ></q-tab>
        </q-tabs>

        <q-separator></q-separator>

        <q-tab-panels animated v-model="currentTab">
          <q-tab-panel
            v-for="{ tab, type, value } in tabs"
            :key="`panel-${tab}`"
            :name="tab"
          >
            <!-- <div v-html="value" class="doc-code"></div> -->
            <doc-code :html="value" :type="type"></doc-code>
          </q-tab-panel>
        </q-tab-panels>
        <q-separator></q-separator>
      </div>
    </q-slide-transition>

    <div class="row">
      <q-linear-progress
        v-if="!components"
        color="primary"
        indeterminate
      ></q-linear-progress>
      <vue-file
        v-else-if="components"
        :component="components[path].default"
      ></vue-file>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef, computed } from "vue";
import type { Prop } from "vue";
import VueFile from "./VueFile.vue";
import { openURL } from "quasar";
import config from "../../config";

const keys = ["template", "script"] as const;

const makeProps = () => {
  return keys.reduce((props, key) => {
    props[key] = String;
    return props;
  }, {} as Record<typeof keys[number], Prop<string>>);
};

export default defineComponent({
  inheritAttrs: false,

  setup(props, { attrs }) {
    const getSourceProps = () => {
      const obj = keys.reduce((obj, key) => {
        const val = props[key];
        if (val) {
          obj[key] = val;
        }
        return obj;
      }, {} as Record<typeof keys[number], string>);

      let all = "";

      keys.forEach((key) => {
        const val = props[key];
        if (!val) return;
        const prefix = all ? "\n\n" : "";
        all = `${all}${prefix}${val}`;
      });

      if (all) {
        obj["all"] = all;
      }

      return obj;
    };

    const tabs = Object.entries(getSourceProps()).map((item) => {
      const [key, value] = item;
      return {
        tab: key,
        type: key === "style" ? "css" : "markup",
        value,
      };
    });

    const currentTab = ref(tabs.length ? tabs[0].tab : "");
    const loading = ref(false);
    const file = shallowRef<any>();

    return {
      tabs,
      currentTab,
      file,
      loading,
      expanded: ref(false),
      openGitHub() {
        let url = props.path.replace("../../", "");
        url = `${config.github}/blob/master/packages/docs/${url}`;
        openURL(url);
      },
      openGitee() {
        const url = props.path.replace("../../", "");
        const prefix =
          `${config.gitee}/blob/master/packages/docs`;
        openURL(`${prefix}/${url}`);
      },
    };
  },

  props: {
    ...makeProps(),
    path: String,
    components: {
      type: Object,
      required: true,
    },
  },

  components: {
    VueFile,
  },
});
</script>

<style lang="less">
.doc-example {
  border: thin solid rgba(0, 0, 0, 0.12);

  .doc-example-toolbar {
    box-sizing: border-box !important;
  }

  .q-tab-panel {
    box-sizing: border-box;
    background: #f5f5f5 !important;
    padding: 0px;
  }
}
</style>
