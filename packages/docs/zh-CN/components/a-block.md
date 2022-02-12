# ABlock

`ABlock`是一个`flex`布局的`div`，用于在`AContainer`或`ABlock`中包裹内部组件以及 UI 框架的`table`组件、`pagination`组件

```vue
<!-- 错误 -->
<a-container>
  <div>
    <a-searcher></a-searcher>
  </div>
</a-container>

<!-- 正确 -->
<a-container>
  <a-block>
    <a-searcher></a-searcher>
  </a-block>
</a-container>
```

## 属性 props

::: api-props
ABlock
:::
