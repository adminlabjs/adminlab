# 快速开始

## 使用 npm 或 yarn 安装

```bash
# NPM
npm install adminlab -S

# Yarn
yarn add adminlab
```

## 示例

推荐使用 TypeScript 进行开发，通过内置的`defineConfig`方法，会有友好的代码提示（[所有配置项](/zh-CN/global/index.html)）

`framework`可选值请见 [适配说明](/zh-CN/adapters/index.html)

:::ts
quickstart/use-ts
:::

如果未使用 TypeScript，则无需引入`defineConfig`方法

:::js
quickstart/use-js
:::

## 常见问题

- 控制台警告：`Failed to resolve component: xxx`

全局注册对应组件

或者为在`components`字段中（与`framework`平级）为对应的组件赋值
