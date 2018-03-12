---
layout: default
id: toolTip
title: toolTip组件
---

## BaseTooltip

### 示例代码

```js
let { BaseTooltip } = Tooltip;

<BaseTooltip xPos={10} yPos={20} formatter={{
	selector: d => [moment(d[0]).format('MM/DD'), d[1], d[2], d[3]],
	name: ['时间', '最新价', '波动点', '涨跌幅'],
	textColor: ['', '', d=>{return d>0 ? 'red':'green'}, d=>{return d>0 ? 'red':'green'}],
}} font={''} bgColor={''} alpha={0.4} />

```

### props列表

| 属性 | 说明 | 类型 | 默认值 |
|:--:| :-- | -- |:-- |
| xPos | x轴坐标 | number | 10 |
| yPos | y轴坐标 | number | 20 |
| formatter | 用来格式化图例文本，显示分时和K线数据时必传 | object | { selector: [], name: [], textColor: 'string'或[] } |
| visible | 是否显示 | bool | true |
| font | 字体设置 | string | "italic 25px" | 
| bgColor | 背景色 | string | '#000'
| alpha | 背景透明度 | number(0-1) | 0.4 |

### fromatter规则

| 属性 | 说明 | 类型 | 默认值 |
|:--:| :-- | -- |:-- |
| selector | 数据存取器 | array(元素类型为func) |  |
| name | 显示的图例名称 | array |  |
| textColor | 图例文字颜色 | string或array(元素类型为string或func) |  |

## TechTooltip 包括(MATooltip, RSITooltip, MACDTooltip, BOLLTooltip, KDJTooltip)

### 示例代码

```js
let { MATooltip, RSITooltip, MACDTooltip } = Tooltip;

let indicators = {
	MA: [{
		selector: (data) => { return +data[1] },
		stroke: 'red',
		dataKey: 'MA' + firstMAPeriod
	}, {
		stroke: 'blue',
		selector: (data) => { return +data[1] },
		dataKey: 'MA' + secondMAPeriod
	}],
	MACD: [{
		stroke: {
			MACD: "#FF0000",
			DIFF: "#00F300",
			DEA: "#4682B4"
		},
		dataKey: 'MACD'
	}]
}

<MATooltip xPos={10} yPos={100} indicators={indicators.MA} />
<MACDTooltip indicators={indicators.MACD} visible={showMACD} />
```

### props列表

| 属性 | 说明 | 类型 | 默认值 |
|:--:|:--:|:--:|:--:|
| xPos | x轴坐标 | number | 10 |
| yPos | y轴坐标 | number | 20 |
| indicators | 背景透明度 | number(0-1) | 0.4 |
| visible | 是否显示 | bool | true |
| font | 字体设置 | string | "italic 25px" |
| bgColor | 背景色 | string | '#000' |

### indicators规则

| 属性 | 说明 | 类型 | 默认值 |
|:--:| :-- | -- |:-- |
| dataKey | 标注key值，用于取数据 | string | |
| stroke | 图例文字颜色 | string或array(支持元素类型为func) |  |