import { layout } from "./common";

export default {
  props: [
    {
      name: "auto-search",
      type: "boolean",
      default: true,
      description: "表单值发生变化后是否自动重新获取列表数据"
    },
    {
      name: "debounce",
      type: "number",
      default: 600,
      description: "输入框类型的表单值发生变化后触发搜索行为的频率限制，`auto-search`开启后生效"
    },
    {
      name: "defaultValue",
      type: "Object",
      description: "表单默认值",
    },
    ...layout,
  ],
};
