export default {
  props: [
    {
      name: "action",
      type: ["create", "refresh", "search", "reset"].map((item) => `'${item}'`),
      description: "传入`AToolbar`内部所支持的功能，点击时内部会触发对应的功能",
    },
  ],
};
