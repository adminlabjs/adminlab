# 布局

布局针对于 [ASearcher](/zh-CN/components/a-searcher.html)、[AFormDialog](/zh-CN/components/a-form-dialog.html)，这两个组件的核心内容就是表单，表单是基于`Grid`布局，所以可以轻而易举的完成一些复杂的布局或者对移动端简单的适配。

## 需知

如果你还不了解`Grid`布局、断点的概念，需要先熟悉下这个概念：

Quasar：https://quasar.dev/layout/grid/row

Vuetify: https://next.vuetifyjs.com/en/components/grids

ElementPlus: https://element-plus.org/zh-CN/component/layout.html

## 参数说明

这是组件中的布局属性参数，用于设置不同断点下的栅格数，这里有些断点在一些 UI 框架里是不支持的，请以使用框架的实际支持情况为准

```ts
{
	layout: string; // 设置默认栅格
	"layout-xs": string;
	"layout-sm": string;
	"layout-md": string;
	"layout-lg": string;
	"layout-xl": string;
}
```

::: tip
在不传任何`layout`属性的情况下内部会自动应用`layout="12", layout-sm="6"`进行简单的移动端适配
:::

只有一项时将应用到所有表单项，传多项用半角逗号(`,`)隔开，每一项将按顺序对应着每个表单项。

下面的示例中，搜索以及编辑弹层表单已经简单做了移动端的适配，可以通过浏览器模拟移动端环境来查看与 PC 端的区别

::: vue
apis/layout
:::
