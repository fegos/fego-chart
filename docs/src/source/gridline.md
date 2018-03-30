---
layout: default
id: gridline
title: GridLine
---

## mobile

### 使用示例

~~~

	<GridLine row={1} lineColor={‘gray’} lineWidth={StyleSheet.hairlineWidth} dash={[3, 1.5]} />
								
~~~

### Props

| 属性 | 说明 | 类型 | isRequired| 默认值 |
|:-- | :-- | :-- |:-- |:-- |
| dash | 虚线配置，不设置即为实现 | array |否| 无 |
| lineColor | 线条颜色 | string | 是 | 无 |
| lineWidth | 线条粗细 | number | 是 | 无 |
| row | 网格横线数量 | number |是| 无 |
| colume | 网格竖线数量 | number |否| 无 |
