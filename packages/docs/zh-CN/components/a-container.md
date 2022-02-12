# AContainer

## 简介

它是入口组件，包括却不仅限于这些功能：

### 解析 UI 框架组件

考虑到大家的使用习惯，`Adminlab`支持解析 UI 框架的下列组件

（这样做的好处是在内部接管了繁琐逻辑的基础上，保留开发者对这些组件最大的可操作空间，还可自由布局、使用组件实例方法、插槽、监听事件等）

- `table` 组件解析

只需要将获取列表数据的方法传给`a-container`组件，表格数据赋值、`loading`状态控制这些无需开发者再去自己控制

- `pagination` 组件解析

内部接管分页事件（页码变化、分页大小变化），这里有一个小优化，频繁请求时也会以最后一次请求的数据返回结果为准，开发者无需再去处理这个逻辑

```vue
<!-- quasar -->
<a-container :action-get="loadData" :columns="columns">
  <q-table></q-table>
  <q-pagination></q-pagination>
</a-container>

<!-- element-plus -->
<a-container :action-get="loadData" :columns="columns">
  <el-table></el-table>
  <el-pagination></el-pagination>
</a-container>

<!-- 可以搭配使用 -->
<a-container :action-get="loadData" :columns="columns">
  <!-- vuetify	 -->
  <v-table></v-table>
  <!-- quasar -->
  <q-pagination></q-pagination>
</a-container>
```

### 解析内部组件

- [AToolbar](/zh-CN/components/a-toolbar.html) 生成常用功能按钮（新建、刷新等）

- [ASearcher](/zh-CN/components/a-searcher.html) 生成搜索表单模块

- [AFormDialog](/zh-CN/components/a-form-dialog.html) 生成`新建/编辑`操作的表单弹窗模块

- [ABlock](/zh-CN/components/a-block.html) 包裹内部组件，用于自定义组件外层样式

## 属性 Props

::: api-props
AContainer
:::

## 实例方法 Methods

::: api-methods
AContainer
:::

## custom 字段详解

`custom`里一些比较灵活的字段会在这里做一个比较详细的介绍

### buttons

`buttons`作为一个使用比较频繁的字段，类型是`Array`，或者是`(row) => Array`，`row`是当前行数据

数组里的每一项就是一个按钮或下拉按钮菜单，可以传字符串，也可以传对象，下面来逐个的说明一下

- 字符串

字符串只能填默认支持的几个操作，`edit`、`copy`、`delete`，这是为了帮助开发者快速完成对应功能在内部做了一个简单的封装，除此之外的字符串内部是无法识别的。

- 对象

按钮的参数：

```ts
interface BtnOptions {
  // 按钮的名称
  label?: string;
  // 可以传内部支持的操作，那就无需再写`handler`函数了
  action?: string;
  // 点击确认后的回调函数
  // 返回Promise可使弹窗/询问框进入loading状态
  handler?: (row: any, scope: any, action: string) => Promise<any> | any;
  // Promise结束后是否自动刷新页面 默认 true
  autoRefresh?: boolean;
  // 点击按钮是否弹窗以及弹窗的配置
  confirm?:
    | boolean
    | {
        title?: string;
        content?: string;
      };
  // 按钮的属性，这个属性是直接传给对应UI框架的按钮组件的
  props?: any;
}
```

传参举例

```ts
{
  custom: {
    buttons: [
      "delete",
      {
        label: "自定义按钮",
        handler: () => console.log("点击了自定义按钮"),
        props: {
          size: "sm",
        },
      },
    ];
  }
}
```

如果想生成的是下拉按钮菜单：

```ts
{
  dropdown: {
    // 这里的`buttons`等同于上方
    buttons: BtnOptions[];
    icon?: string;
    label?: string;
    // 按钮的属性，这个属性是直接传给UI框架对应的组件的
    props?: any;
  }
}
```

传参举例

```ts
{
  custom: {
    buttons: [
      {
        dropdown: {
          label: "更多",
          buttons: [
            "delete",
            {
              label: "自定义按钮",
              handler: () => console.log("点击了自定义按钮"),
            },
          ],
        },
      },
    ];
  }
}
```

### map

`map`功能可以分为两块

- [状态映射](/zh-CN/examples/index.html#状态映射)

这时候`map`的相关字段为：

```ts
{
  type?: "text" | "status";
  options?: Array<{
    label: string;
    value: any;
    icon?: string;
    color?: string;
    textColor?: string;
    props?: (type: "table" | "searcher" | "creator" | "editor") => Object; // 传给UI框架对应组件的属性
  }>;
  loadOptions?: () => Array<{
    label: string;
    value: any;
  }>;
  // 该字段在表单中使用什么组件展示
  formType?: "select" | "radio" | "input" | ((from: "searcher" | "creator" | "editor") => "select" | "radio" | "input")
}
```

`options`与`loadOptions`两个属性任传其一即可，后者优先级比较高。

`type`、`options`中每列`icon`、`color`、`textColor`这些字段只适用于表格展示，在表单组件中无效。

- [表单类型](/zh-CN/examples/index.html#表单类型)

此时表单组件中默认的展示形式是下拉框，如果想要通过输入框的形式可以设置`map.formType`属性：

```ts
{
  custom: {
    map: {
      options: [...],
      formType: "radio"
    },
  }
}
```

- [远程加载&联动功能](/zh-CN/examples/index.html#状态映射)

这个功能只针对于表单了，下拉框的值通过网络请求加载，或者下拉框与下拉框之间的加载有依赖关系。

```ts
type Options = Array<{
  label: string;
  value: any;
}>
{
  options?: Options;
  loadOptions?: (row?: any) => Promise<Options> | Options;
  dependsOn?: string;
}
```

::: tip
`loadOptions`此时最好返回`Promise`，否则程序会进行状态映射。

`loadOptions`在渲染表格数据时，传参`row`没有值。
:::

`options`与`loadOptions`任传其一即可。

如果下拉框依赖于另一个下拉框的值，将所依赖的字段名赋值给`dependsOn`即可，当依赖值发生改变后会自动刷新下拉框列表并重置下拉框的值。

### template

`template`需要`name`属性配合，建议看过 [template 示例](/zh-CN/examples/index.html#组合展示) 再看这个介绍

这个属性适合一些比较简单的多字段结构，复杂的结构也支持。

如示例，头像和用户名只需要通过<span v-pre>`{{avatar}}{{user_name}}`</span>，就会在一个`flex`布局下的`div`里渲染那两个元素，已经通过设置默认类名`a-template`为元素之间设置了默认间隔。

当你想为里面的元素自定义样式时，那就使用对象形式。

```ts
{
  custom: {
    template: {
      style: {
        "font-size": "16px",
      },
      // 数组里每一项渲染都会渲染成一个`div`
      children: ["{{user_avatar}}{{username}}", "支持传style与css", {
        // 可以传对象
        children: ["自定义内容", "{{username}}"]
        // 设置类名后会覆盖默认类名
        classes: "text-black",
      }],
    }
  }
}
```

复杂结构使用函数

```ts
{
  custom: {
    template: (parse) => {
      // parser函数传`string`或`string[]`
      // 内容是在`custom.name`定义好的，对应的值是 VNode
      const { username, user_avatar } = parse(["username", "user_avatar"]);
      return h("div", null, [username, user_avatar]);
    };
  }
}
```

::: vue
components/container/template-simple
:::

## props 详解

一些需要额外说明的组件属性

### action-get

`action-get`用于获取列表数据，方法执行时会传入分页信息、排序信息以及对应搜索区的表单值

```ts
{
  // 搜索区的表单值
  [key: string]: any;
  // 分页信息
  page: number;
  pageSize: number;
  // 用户排序后会传入下面两个字段
  sortBy?: string;
  sortOrder?: 'desc' | 'asc'
}
```

方法返回的数据格式需要为

注意：如果返回不是`Promise`，将不会触发`loading`状态

```ts
{
  listData: any[];
  total: number;
}
```

### show-when

`show-when`属性用于控制对应表单项是否展示，[查看示例](/zh-CN/examples/index.html#表单项动态展示与隐藏)

这个函数会用在三个地方，分别是搜索区表单、新增表单、编辑表单，介绍下函数的参数：

- <pre>from</pre>

表示当前应用的场景，`'searcher'`表示是搜索区表单，`'creator'`表示是新建浮层里的表单，`'editor'`表示是编辑浮层里的表单

- <pre>formData</pre>

当前表单对象的值

- <pre>field</pre>

具体的表单项字段名称，`showWhen`函数控制该字段是否在表单中展示

```ts
(event: {
  from: 'searcher' | 'creator' | 'editor', 
  formData: any, 
  field: string
}) => boolean
```

