import { defineConfig } from "vitepress";
import { ExampleBlockPlugin } from "./node/plugins";
import * as path from "path";

import * as componentApiData from "../data/api";

export default defineConfig({
  title: "Adminlab",
  description: "基于 Vue3.x 的 Web 管理后台高效开发工具",

  themeConfig: {
    sidebar: [
      {
        text: "指南",
        icon: "start",
        children: [
          {
            text: "简介",
            link: "/zh-CN/guide/index.html",
          },
          {
            text: "演示",
            link: "/zh-CN/guide/demo.html",
          },
          {
            text: "快速开始",
            link: "/zh-CN/guide/quickstart.html",
          },
        ],
      },
      {
        text: "核心功能",
        icon: "hdr_strong",
        link: "/zh-CN/examples/index.html",
      },
      {
        text: "组件",
        icon: "dashboard_customize",
        children: [
          {
            text: "AContainer",
            link: "/zh-CN/components/a-container.html",
          },
          {
            text: "ASearcher",
            link: "/zh-CN/components/a-searcher.html",
          },
          {
            text: "AToolbar",
            link: "/zh-CN/components/a-toolbar.html",
          },
          {
            text: "AToolbarBtn",
            link: "/zh-CN/components/a-toolbar-btn.html",
          },
          {
            text: "AFormDialog",
            link: "/zh-CN/components/a-form-dialog.html",
          },
          {
            text: "ABlock",
            link: "/zh-CN/components/a-block.html",
          },
        ],
      },
      {
        text: "布局",
        icon: "grid_view",
        link: "/zh-CN/layout/index.html",
      },
      {
        text: "全局配置",
        icon: "javascript",
        link: "/zh-CN/global/index.html",
      },
      {
        text: "适配器",
        icon: "model_training",
        children: [
          {
            text: "适配器说明",
            link: "/zh-CN/adapters/index.html",
          },
          {
            text: "quasar 适配器",
            link: "/zh-CN/adapters/quasar/index.html",
          },
          {
            text: "element-plus 适配器",
            link: "/zh-CN/adapters/element-plus.html",
          },
        ],
      },
    ],
  },

  markdown: {
    config: (md) =>
      ExampleBlockPlugin(md, {
        wrap: (type, code = false) =>
          code || type !== "vue" ? "AppCode" : "Examples",
        root: path.resolve(__dirname, "../examples"),
        api: {
          component: "ApiComponent",
          data: componentApiData,
        },
      }),
  },

  head: [
    [
      "script",
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?c0a0c2647a38a7e12bdfee1d3990ef97";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `,
    ],
  ],
});
