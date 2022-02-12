# ElementPlus 适配器

## 链接

- ElementPlus 官方文档

https://element-plus.org

## 使用

```ts
import { Adminlab, ElementPlusAdapter } from "adminlab";

app.use(Adminlab, {
  framework: "element-plus",
  adapters: [new ElementPlusAdapter()]
})
```

## 布局说明

由于`element-plus`的栅栏`24`列，但在`Adminlab`布局里统一是`12`列，所以在适配器里会统一将用户传入的列数乘 2。

就是传参范围请控制在`1-12`。

## 表格 columns 说明

`element-plus`里的表格是通过模板的方式写的，比如

::: vue
components/container/element-1
:::

但是在`Adminlab`里是通过`columns`来实现的，就是将写在`el-table-column`组件上的属性写到 [columns](/zh-CN/examples/index.html#columns) 里

那么对应着上面的格式，在`Adminlab`需要这样写：

::: vue
components/container/element-2
:::

## 组件表

下面将标注对应的组件是通过`ElementPlus`中的哪些组件完成的（也就是说对应`props`属性会传递给哪个组件）

```ts
{
  // https://element-plus.org/zh-CN/component/table.html
  Table = "Table",

  // https://element-plus.org/zh-CN/component/pagination.html
  Pagination = "Pagination",

  // https://element-plus.org/zh-CN/component/form.html
  Form = "Form",

  // https://element-plus.org/zh-CN/component/button.html
  Button = "Button",

  // https://element-plus.org/zh-CN/component/select.html
  Select = "Select",

  // https://element-plus.org/zh-CN/component/input.html
  Input = "Input",

  // https://element-plus.org/zh-CN/component/tag.html
  Tag = "Tag",

  // https://element-plus.org/zh-CN/component/date-picker.html
  DatePicker = "DatePicker",

  // https://element-plus.org/zh-CN/component/color-picker.html
  ColorPicker = "ColorPicker",

  // https://element-plus.org/zh-CN/component/progress.html
  Progress = "Progress",

  // https://element-plus.org/zh-CN/component/switch.html
  Switch = "Switch",

  // https://element-plus.org/zh-CN/component/image.html
  Image = "Image",

  // https://element-plus.org/zh-CN/component/dialog.html
  Dialog = "Dialog",

  // https://element-plus.org/zh-CN/component/dropdown.html
  Dropdown = "Dropdown",

  // https://element-plus.org/zh-CN/component/dropdown.html#dropdown-item-attributes
  DropdownItem = "DropdownItem",

  // https://element-plus.org/zh-CN/component/radio.html
  RadioGroup = "RadioGroup"

  // https://element-plus.org/zh-CN/component/layout.html#row-%E5%B1%9E%E6%80%A7
  Row = "Row",

  // https://element-plus.org/zh-CN/component/layout.html#col-%E5%B1%9E%E6%80%A7
  Col = "Col",
};
```
