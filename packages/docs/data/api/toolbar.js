export default {
  props: [
    {
      name: "actions",
      type: "Array<'create' | 'refresh' | 'search' | 'reset'>",
      description: "渲染哪些按钮",
    },
    {
      name: "create",
      type: "boolean",
      default: true,
      description: "是否显示新建按钮",
    },
    {
      name: "refresh",
      type: "boolean",
      default: true,
      description: "是否显示刷新按钮",
    },
    {
      name: "search",
      type: "boolean",
      default: true,
      description: "是否显示搜索按钮",
    },
    {
      name: "reset",
      type: "boolean",
      default: true,
      description: "是否显示重置按钮",
    },
    {
      name: "btn-[key]",
      type: "any",
      description:
        "设置按钮属性，`key`这里是个泛指，对应UI框架的`Button`组件属性名，比如`btn-size`，注意这个设置是针对所有按钮的",
    },
  ],

  slots: [
    {
      name: "default",
      description:
        "会将内容渲染到内置按钮的尾部，详细见下方*插槽用法示例*"
    },
  ],

  events: [
    {
      name: "action",
      type: "string",
      description:
        "如果`AToolbarBtn`设置的`action`非内部功能且未注册点击事件，点击后触发该事件",
    },
  ],
};
