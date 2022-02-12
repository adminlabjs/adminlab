# 全局配置

安装 Adminlab 时的配置项

## 配置项

### framework

定 UI 框架，必填。类型：`string`

内部所渲染的所有[组件](/zh-CN/global/index.html#组件表)比如`Button`、`Input`、`Select`等都将使用该框架里的组件。

内部已支持的框架列表请查看[适配器](/zh-CN/adapters/index.html)。

### adapters

UI 框架适配器，类型`Array`

不传或留空将内置`Quasar`、`ElementPlus`两个适配器

有的适配器有可配置参数项，具体请参考对应的适配器页面

```ts
import { Adminlab, QuasarAdapter } from "adminlab";

app.use(Adminlab, {
  framework: "quasar",
  adapters: [new QuasarAdapter()]
})
```

### components

优先级最高的组件指定方式，可指定的组件列表见下方[组件表](/zh-CN/global/index.html#组件表)

```ts
app.use(Adminlab, {
  framework: "quasar",
  components: {
    // 指定该组件使用其它UI框架
    Button: "vuetify",
    // 指定某组件使用自定义组件
    Select: h("div"),
  },
});
```

### componentProps

组件通用属性配置，`global`可以设置全部的组件，其余部分可设置的组件列表参考下方[组件表](/zh-CN/global/index.html#组件表)

- <pre>global</pre>

设置组件表中所有组件的默认属性，优先级最低

- <pre>table</pre>

设置表格模块中所用到的组件的默认属性

- <pre>formDialog</pre>

设置弹层模块中所用到的组件的默认属性

- <pre>searcher</pre>

设置搜索模块中所用到的组件的默认属性

- <pre>toolbar</pre>

设置工具栏模块中所用到的组件的默认属性

```ts
app.use(Adminlab, {
  framework: "quasar",
  componentProps: {
    global: {
      Select: {
        // 将针对所有的 Select 组件
        clearable: true,
      },
    },
    table: {},
    formDialog: {},
    searcher: {},
    toolbar: {},
  },
});
```

### modules

- <pre>table</pre>

```ts
{
  // 如果操作区域的按钮数量超过设定数量，将多余部分的按钮通过下拉菜单的形式展示
  maxButtonCount: number;
  // 设置头像样式
  avatar: {
    size?: number | string;
    // 赋值给UI框架`Image`组件的属性
    componentProps?: Record<string, any>;
  };
  color: {
    classes: string;
    style: Record<string, any>;
  };
}
```

- <pre>searcher</pre>

```ts
{
  // 是否让搜索表单里所有支持`clearable`属性组件的`clearable`开启
  clearable: boolean;
}
```

- <pre>formDialog</pre>

```ts
{
  // 是否让弹层表单里所有支持`clearable`属性组件的`clearable`开启
  clearable: boolean;
}
```

## 组件表

下方注释表示组件都用在了哪些地方

下方的组件名就对应着 UI 框架中的组件，比如`Form`对应着`quasar`里的`q-form`

有些组件名在有些 UI 框架并没有对应的组件，比如`Tag`在`vuetify`与`quasar`里就不存在，这时候大家可以去对应的适配器里找（入口左侧菜单），里面会说明是用什么组件实现的

```ts
{
  Table = "Table",
  Pagination = "Pagination",
  Form = "Form",
  Dialog = "Dialog",

  // table
  Tag = "Tag",
  Dropdown = "Dropdown",
  DropdownItem = "DropdownItem",
  Progress = "Progress",
  Image = "Image",

  // formDialog searcher
  DatePicker = "DatePicker",
  Row = "Row",
  Col = "Col",
  ColorPicker = "ColorPicker",
  Switch = "Switch",
  Select = "Select",
  Input = "Input",
  RadioGroup = "RadioGroup",

  // formDialog searcher toolbar
  Button = "Button",
}
```
