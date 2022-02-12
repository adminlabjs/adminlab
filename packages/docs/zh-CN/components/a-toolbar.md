# AToolbar

自动生成工具栏，必须在 [AContainer](/zh-CN/components/a-container.html) 中使用

组件内置支持几种功能的按钮：

- `create`

新建按钮，点击后会弹出新建表单弹层

- `refresh`

刷新按钮，点击后会刷新当前页面表格的数据

- `search`

搜索按钮，点击后会立刻执行`action-get`方法

- `reset`

重置按钮，点击后会重置搜索区表单的值

## 属性 props

::: api-props
AToolbar
:::

## 事件 events

::: api-events
AToolbar
:::

## 插槽 slots

::: api-slots
AToolbar
:::

## 插槽用法示例

- 内部组件`a-toolbar-btn`

`a-toolbar-btn`有一个`action`属性，传入内置功能的话比如`create`会直接唤起新建按钮浮层。详情请前往[AToolbarBtn组件](/zh-CN/components/a-toolbar-btn.html)查看

- 任意元素

传入非`a-toolbar-btn`组件内部将不作任何干涉

::: vue
components/toolbar/slot-default
:::
