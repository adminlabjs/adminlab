# 框架适配说明

`Adminlab`内部通过*适配器*实现同一功能支持不同 UI 框架的能力，即：你只需要传入对应的 UI 框架名称，页面上即可渲染出对应框架的组件

下面列出已经支持和即将支持的 UI 框架列表

## 已经适配

想要使用哪个框架，就把对应名称传给`framework`即可，详细用法参考对应的适配器文档

- [quasar](/zh-CN/adapters/quasar/index.html)

- [element-plus](/zh-CN/adapters/element-plus.html)

## 即将支持

- vuetify 3.x

现在 vuetify 还处于 alpha 版本，而且部分组件还未适配 vue3

等 beta 版或 Adminlab 里所需的组件 vuetify 3.x 版本中都正常可用后会第一时间进行适配

## 扩展：自行适配

`Adminlab`未来将支持开发者自行适配任何基于`Vue3.x`的 UI 框架，现在此功能测试中，暂时不开放
