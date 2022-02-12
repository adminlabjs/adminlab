# 核心功能

::: tip 阅读提示
有些部分文字较多，觉得看起来比较累的话可以直接看演示，然后结合示例代码一看就明白了

遇到了问题或者找不到你想要的了，你再去看看字儿找 API 翻一翻也不迟
:::

## 使用

一切都要从 [a-container](/zh-CN/components/a-container.html) 开始，它是所有子组件的入口

`a-container`主要的两个参数为:

### action-get

用于获取列表数据，查看[详细介绍](/zh-CN/components/a-container.html#action-get)

需要开发者返回如下的定义：

```ts
{
  // 列表数据
  listData: any[];
  // 数据总数
  total: number;
}
```

### columns

`columns` 是一个数组，用于定义哪些字段在表格中展示

用过 vuetify 或 quasar 的朋友理解起来应该非常简单，这个在 vuetify 的 v-table 里对应的是`headers`，在 quasar 的 q-table 里对应的是`columns`

对于只用过 element-plus 这种直接写在模板里的方式的朋友，理解难度也非常低，可以看一下这里的[说明](/zh-CN/adapters/element-plus.html#表格-columns-说明)

在原有框架表格属性的基础上，Adminlab 的`columns`属性对列的配置里扩展了一个`custom`字段，这也是 Adminlab 的核心配置，比如：类型定义、描述哪些字段在表单（搜索、新增、编辑）里展示、表单联动等等，接下来请看下面的例子

## 搜索栏 工具栏 分页

搜索栏：[ASearcher](/zh-CN/components/a-searcher.html)，工具栏：[AToolbar](/zh-CN/components/a-toolbar.html)

::: vue
components/container/toolbar-searcher-pagination
:::

## 类型定义

通过`define`字段定义一些内置类型，可以达到快速展示某些元素的效果，比如头像、链接、时间戳格式化等等

### 图片、头像、链接

指定`define`为`image`时，即可作为图片展示

指定`define`为`avatar`时，即可作为头像展示

指定`define`为`link`时，即可渲染一个可点击的链接

::: vue
components/container/image-avatar-link
:::

### 颜色、时间戳、进度条

指定`define`为`datetime`或`date`即可将时间戳格式化

- 如果是 10 位的数字将认为是 unix 时间戳，会自动乘以`1000`后再格式化

- `datetime`默认格式是`yyyy/MM/dd hh:mm:dd`，`date`默认格式是`yyyy/MM/dd`，自定义可通过`extension.format`字段实现

指定`define`为`color`，即可把对应的颜色展示出来

指定`define`为`progress`，即可作为进度条来展示

- `progress`范围`0~100`

**点击编辑按钮你会发现：时间戳相关的字段以时间选择器组件显示，颜色相关的字段以颜色选择器渲染**

::: vue
components/container/color-timestamp-progress
:::

## 操作按钮

通过配置 `buttons` 字段即可快速生成对应操作按钮，[详细用法](/zh-CN/components/a-container.html#buttons)

::: tip 提示
传入的方法返回值是`Promise`的话，页面或弹窗会自动进入`loading`状态

如果是弹窗，`loading`时将会被置为**不可关闭**状态
:::

### 内置操作

已内置了几个常用的操作，只需按提示传入对应的方法配置好即可具备对应功能

- `edit`

编辑操作，需为`a-container`传入`action-edit`方法，配置`action.editable`使对应字段出现在编辑表单中

- `copy`

复制操作，需为`a-container`传入`action-delete`方法，配置`action.creatable`使对应字段出现在新增表单中

- `delete`

删除操作，需为`a-container`传入`action-edit`方法

在最后一页时，成功删掉最后一项的时候，会将当前页码减`1`后再刷新页面的数据（不包括只有 1 页数据时）

::: vue
components/container/actions
:::

### 扩展操作

上面介绍的内置操作只需要传对应的字符串就可以了，但是如果想要扩展更多功能，比如说**自定义事件**、**自定义标题**、**自定义属性**的话，传参就要稍微复杂一点

_除了按钮还能配置**下拉按钮菜单**，适用于按钮较多的时候_

另外，如果你需要根据每行的数据不同渲染不同状态的按钮或下拉按钮菜单，可以通过给`buttons`传函数的方式去实现

::: vue
components/container/action-extension
:::

## map

**点击编辑按钮你会发现：配置了`map`的字段在表单里是通过下拉框展示的**

### 状态映射

::: vue
components/container/map
:::

### 表单类型

通过上面打开编辑浮层可以看到，配置了`map`的字段在表单中默认是以`select`组件展示的

如果想要通过别的组件展示，比如`radio`，可配置`formType`属性，[查看详细](/zh-CN/components/a-container.html#map)

::: vue
components/container/map-form-type
:::

### 远程加载 Select 联动

- 远程加载

在操作的时候，有些下拉框的列表需要从服务器获取数据，配置`map.loadOptions`即可

- Select 联动

有时候下拉框 C 的列表依赖于下拉框 B 的值，下拉框 B 的列表又依赖于下拉框 A 的值等等以此类推，配置`map.dependsOn`为该字段配置所依赖的字段名即可

::: vue
components/container/map-load
:::

## 更多功能

### 组合展示

同时展示多个字段，比如用户名和头像放一起展示，怎么做？

这时需要用到`name`与`template`属性

::: vue
components/container/template
:::

这时候已经不需要单独展示用户名与头像了，指定`visible`属性即可将其隐藏

::: vue
components/container/template-only
:::

点击这里了解该属性的[详细说明以及更多用法](/zh-CN/components/a-container.html#template)

### render 函数

`render`函数的优先级仅低于`template`字段

在没有使用`template`字段的情况下，使用此字段后除了`visible`字段之外的字段都将失效

::: vue
components/container/render
:::

### 数据清洗与格式化

结合示例代码更容易理解

- transformer

用于数据清洗

- formatter

用于格式化表格展示的内容（传参为字符串时支持变量，比如<span v-pre>`{{id}}`</span>）

::: vue
components/container/transformer-formatter
:::

### 表单项动态展示与隐藏

在很多场景里一些表单项是默认不展示的，只有当特定条件达成时才会展示。

这时候要用到`a-container`的 [showWhen](/zh-CN/components/a-container.html#show-when) 属性。

下面的演示将上面远程加载的演示做了一个小改动，点击新建按钮和编辑按钮查看区别

::: vue
components/container/show-when
:::

### 表单验证

表单验证为 `AContainer` 组件传 `rules` 属性

`rules`是个对象，`key`为字段名，`value`为验证规则

::: vue
components/container/rule
:::

### 加载失败

下面的示例有 50%的加载失败率，多点几下刷新或切换几次分页就可以看到加载失败时的表现

这个样式后续会进行优化

::: vue
components/container/load-fail
:::
