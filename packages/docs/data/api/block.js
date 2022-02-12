export default {
  props: [
    {
      name: "justify",
      type: `// flex-start、center、flex-end
"start" | "center" | "end"`,
      default: "'start'",
      description: "设置 `justify-content` 属性",
    },
    {
      name: "align",
      type: `// flex-start、center、flex-end
"start" | "center" | "end"`,
      default: "'center'",
      description: "设置 `align-items` 属性",
    },
    {
      name: "column",
      type: "boolean",
      default: false,
      description: "`flex-direction` 是否为 `'column'`",
    },
  ],
};
