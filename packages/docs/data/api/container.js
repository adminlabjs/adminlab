export default {
  props: [
    {
      name: "page",
      type: "number",
      description: "默认页码",
      default: 1,
    },
    {
      name: "page-size",
      type: "number",
      description: "默认分页大小",
      default: 20,
    },
    {
      name: "auto-trim",
      type: "boolean",
      description: "是否对搜索表单的`string`类型的值去除首尾空格",
      default: true,
    },
    {
      name: "action-get",
      type: `// 注意一定要返回这个结构
interface Response {
  listData: any[];
  total: number;
}
(params: any) => Promise<Response>`,
      description: `获取列表数据用的方法，[详细介绍](/zh-CN/components/a-container.html#action-get)`,
    },
    {
      name: "action-edit",
      type: `(formData: any) => Promise<any>`,
      description: "用于更新某条列表数据",
    },
    {
      name: "action-delete",
      type: "(formData: any) => Promise<any>",
      description: "用于删除某条列表数据",
    },
    {
      name: "action-create",
      type: "(formData: any) => Promise<any>",
      description: "用于新增数据",
    },
    {
      name: "show-when",
      type: `(event: {
  from: 'searcher' | 'creator' | 'editor', 
  formData: any, 
  field: string
}) => boolean`,
      description:
        "用于控制对应表单项是否展示, [详细介绍](/zh-CN/components/a-container.html#show-when) 或者 [查看示例](/zh-CN/examples/index.html#render-函数)",
    },
    {
      name: "rules",
      type: "Record<string, any>",
      description: "[查看示例](/zh-CN/examples/index.html#表单验证)",
    },
    {
      name: "columns",
      type: `Array<{
	// 这里写UI框架表格组件的属性
	[key: string]: any,
  // Adminlab列扩展配置项，展开查看详细类型
	custom?: Custom
}>`,
      description: "列定义，每列的类型描述请展开查看详细",
      children: [
        {
          name: "define",
          type: ["link", "datetime", "date", "image", "avatar"].map(
            (item) => `'${item}'`
          ),
          description:
            "字段类型定义，[查看示例](/zh-CN/examples/index.html#类型定义)",
        },
        {
          name: "action",
          type: `{
	creatable?: boolean;	// 是否在新建表单里出现
	editable?: boolean;		// 是否在编辑表单里出现
	searchable?: boolean;	// 是否在搜索表单里出现
}
									`,
          description:
            "定义行为字段，[可参考](/zh-CN/examples/index.html#搜索栏-工具栏-分页)",
        },
        {
          name: "buttons",
          type: `any[] | (row) => any[] // 详细属性以及介绍请参考描述里的详细介绍`,
          description:
            "操作按钮配置，[详细介绍](/zh-CN/components/a-container.html#buttons) 或者 [查看示例](/zh-CN/examples/index.html#操作按钮)",
        },
        {
          name: "map",
          type: `Object // 详细属性以及介绍请参考描述里的详细介绍`,
          description:
            "用于配置字段映射或表单下拉框，[详细介绍](/components/a-container.html#map) 或者 [查看示例](/zh-CN/examples/index.html#map)",
        },
        {
          name: "formatter",
          type: ["string", "(row: any, scope: any) => string"],
          description:
            "格式化内容，[示例](/zh-CN/examples/index.html#transformer-formatter)",
        },
        {
          name: "transformer",
          type: "(row: any, scope: any) => any",
          description:
            "对源数据进行处理 (不改变源数据)，[示例](/zh-CN/examples/index.html#transformer-formatter)",
        },
        {
          name: "extension",
          type: "Object",
          description: "扩展项",
          children: [
            {
              name: "range",
              type: [
                "boolean",
                '(from: "searcher" | "creator" | "editor") => boolean',
              ],
              description: "时间戳字段是否为范围类型",
            },
            {
              name: "format",
              type: "string",
              description: "自定义时间戳解析的格式",
            },
            {
              name: "textarea",
              type: "boolean",
              description: "在表单中是否表现为多行输入框",
              default: false,
            },
          ],
        },
        {
          name: "visible",
          type: "boolean",
          description: "是否在表格中展示此字段",
          default: "true",
        },
        {
          name: "name",
          type: "string",
          description:
            "用于组合展示，[查看示例](/zh-CN/examples/index.html#组合展示)",
        },
        {
          name: "render",
          type: "(row) => VNode",
          description: "自定义渲染表格内容块，优先级仅次于`template`",
        },
        {
          name: "template",
          type: "string | Object | Function // 详细属性以及介绍请参考描述里的详细介绍",
          description:
            "自定义渲染表格内容块，优先级最高，一般用于组合展示，[详细介绍](/zh-CN/components/a-container.html#template) 或者 [查看示例](/zh-CN/examples/index.html#组合展示)",
        },
        {
          name: "props",
          type: `// props在渲染[表格、搜索、新增、编辑]时都会执行一次
// 所以执行时机不同返回值所传递给的组件也不同
(from: "table" | "searcher" | "creator" | "editor", row?: any) => Object | undefined`,
          description: "设置组件属性，只有当`type`为`'editor'`时`row`才会有值",
        },
      ],
    },
    {
      name: "list-data",
      type: "any[]",
      description: `表格列表数据

在不需要通过接口获取数据时可使用此字段填充数据`,
      default: "[]",
    },
  ],
  slots: [],
  methods: [
    {
      name: "getTableData",
      type: "() => any[]",
      description: "获取当前表格数据",
    },
  ],
  events: [],
};
