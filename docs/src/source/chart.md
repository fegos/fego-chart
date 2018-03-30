---
layout: default
id: chart
title: Chart组件
---

设置图标位置和高度，计算Y坐标轴范围

### 示例代码
```js
/*web*/
<Chart
	frame={{
		height: 350,
		origin: [0, 0]
	}}
	yExtents={[
		d => +d[2], 
		d => [+d[1], +d[2], +d[3], +d[4]],
		indicators.MA[0].dataKey, indicators.MA[1].dataKey,
		indicators.MA[2].dataKey
	]}
>
</Chart>

/*mobile*/

<Chart
	style={{ flex: 1 }}
	insetBottom={30}
	yExtents={[d => [+d[1]]]}
	indicators={['BOLL']}
	yAxisMargin={20}
	yGridLineNum={2}
>
	{...children}
</Chart>


```

### props列表
| 属性 | 说明 | 类型 | 默认值 |
|:-- | :-- | :-- |:-- |
| frame | 图表的高度和位置，web端有，mobile端没有 | object | 无 |
| indicators | chart中包含的指标类型 | array | 无 |
| yExtends | 要计算数据的取值函数集合 | array(元素类型为func或string) | 无 |
| insertBottom | 底部缩进距离 | number | 0 |
| yAxisMargin | y轴值域扩展的范围(web),Y轴极值距边界的距离(mobile) | array(web),number(mobile) | [0.90, 1.10]（web），无(mobile)|
| yGridLineNum | Y轴网格线的数量 | number | 4 |

### frame属性（web）

| 属性 | 说明 | 类型 | 默认值 |
|:-- | :-- | :-- |:-- |
| height | 图表的高度 | number |  |
| origin | 图表的位置坐标 | array |  |
