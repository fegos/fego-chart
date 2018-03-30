---
layout: default
id: technicalline
title: Technicalindicators
---

## mobile

### MA

#### 使用示例

~~~

	<MA dataKey={'MA'} stroke={'blue'} />
								
~~~

### Props

| 属性 | 说明 | 类型 | isRequired| 默认值 |
|:-- | :-- | :-- |:-- |:-- |
| dataKey | 键值 | string | 是 | 无 |
| lineWidth | 线条粗细 | string | 否 | 1 |
| stroke | stroke颜色| string |是|无 |



### BOLL

#### 使用示例

~~~

	<BOLL dataKey={indicators.BOLL[0].dataKey} stroke={indicators.BOLL[0].stroke} />
								
~~~

### Props

| 属性 | 说明 | 类型 | isRequired| 默认值 |
|:-- | :-- | :-- |:-- |:-- |
| dataKey | 键值 | string | 是 | 无 |
| lineWidth | 线条粗细 | string | 否 | 1 |
| stroke | stroke颜色| string |是|无 |


### MACD

#### 使用示例

~~~

	<MACD dataKey={indicators.MACD[0].dataKey} stroke={indicators.MACD[0].stroke} barWidth={3} />
								
~~~

### Props

| 属性 | 说明 | 类型 | isRequired| 默认值 |
|:-- | :-- | :-- |:-- |:-- |
| dataKey | 键值 | string | 是 | 无 |
| stroke | stroke颜色| string |是|无 |
| lineWidth | 线条粗细 | string | 否 | StyleSheet.hairlineWidth |
| barWidth |柱状图粗细| string |否|无 |

### KDJ

#### 使用示例

~~~

	<KDJ dataKey={indicators.KDJ[0].dataKey} stroke={indicators.KDJ[0].stroke} />
								
~~~

### Props

| 属性 | 说明 | 类型 | isRequired| 默认值 |
|:-- | :-- | :-- |:-- |:-- |
| dataKey | 键值 | string | 是 | 无 |
| stroke | stroke颜色| string |是|无 |
| lineWidth | 线条粗细 | string | 否 | StyleSheet.hairlineWidth |

### RSI

#### 使用示例

~~~

	<RSI dataKey={indicators.RSI[0].dataKey} stroke={indicators.RSI[0].stroke} />
								
~~~

### Props

| 属性 | 说明 | 类型 | isRequired| 默认值 |
|:-- | :-- | :-- |:-- |:-- |
| dataKey | 键值 | string | 是 | 无 |
| stroke | stroke颜色| string |是|无 |
| lineWidth | 线条粗细 | string | 否 | StyleSheet.hairlineWidth |

