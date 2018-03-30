---
layout: default
id: line
title: LineSeries
---

## mobile

### 使用示例

~~~

	<LineSeries yExtents={d => [+d[2]]} stroke={'#EC912E'} />
	<LineSeries dataKey={'timeline'} yExtents={d => [+d[1]]} riseColor={'#F05B48'} fallColor={'#10BC90'} lightRiseColor={'#F05B4800'} lightFallColor={'#10BC9000'} strokeWidth={1} />
								
~~~

### Props

| 属性 | 说明 | 类型 | isRequired| 默认值 |
|:-- | :-- | :-- |:-- |:-- |
| dataKey | 键值 | string | 否 | 无 |
| stroke | 线条颜色 | string | 否 | black |
| riseColor | 上涨颜色 | string |否| red |
| fallColor | 下跌颜色 | string | 否 | green |
| yExtents | 数据选择子 | function | 是 | 无 |
