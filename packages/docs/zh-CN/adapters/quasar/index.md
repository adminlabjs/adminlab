# Quasar 适配器

## 链接

- Quasar 官方文档

https://quasar.dev

## 使用

- 用法

```ts
import { Adminlab, QuasarAdapter } from "adminlab";

app.use(Adminlab, {
  framework: "quasar",
  adapters: [new QuasarAdapter({
    defineColumn: {
      align: "left"
    }
  })]
})
```

- 参数类型

```ts
interface QuasarAdapterOptions {
  // 将与`columns`中的每项进行合并
  // 优先级较低，只覆盖没有的字段
  defineColumn?: Record<string, any>;
}
```

## 组件表

下面将标注对应的组件是通过`Quasar`中的哪些组件完成的（也就是说对应`props`属性会传递给哪个组件）

```ts
{
  // https://quasar.dev/vue-components/table
  Table = "Table",

  // https://quasar.dev/vue-components/pagination
  Pagination = "Pagination",

  // https://quasar.dev/vue-components/form
  Form = "Form",

  // https://quasar.dev/vue-components/button
  Button = "Button",

  // https://quasar.dev/vue-components/select
  Select = "Select",

  // https://quasar.dev/vue-components/input
  Input = "Input",

  // https://quasar.dev/vue-components/chip
  Tag = "Tag",

  // https://quasar.dev/vue-components/date
  DatePicker = "DatePicker",

  // https://quasar.dev/vue-components/color-picker
  ColorPicker = "ColorPicker",

  // https://quasar.dev/vue-components/linear-progress
  Progress = "Progress",

  // https://quasar.dev/vue-components/toggle
  Switch = "Switch",

  // https://quasar.dev/vue-components/img
  Image = "Image",

  // https://quasar.dev/vue-components/dialog
  Dialog = "Dialog",

  // https://quasar.dev/vue-components/button-dropdown
  Dropdown = "Dropdown",

  // https://quasar.dev/vue-components/list-and-list-items#qitem-api
  DropdownItem = "DropdownItem",

  // https://quasar.dev/vue-components/option-group
  RadioGroup = "RadioGroup"

  // Row 和 Col 基于 quasar 的 grid 相关类名封装，不接受参数
  Row = "Row",
  Col = "Col",
};
```
