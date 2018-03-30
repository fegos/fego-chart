---
layout: default
id: axes
title: Axes
---

坐标轴 Axes组件
## General
+ props
	+ min: domain最小值
	+ max: domain最大值
	+ tickNums: 一共生成tickNums个tick(tickNums-1个区间)
	+ ticks: 设置固定ticks,按Axis均匀排列

## XAxis
+ Ordinal sacle
+ Domain: [0,plotData.length-1] 当前屏幕内数据

## YAxis
+ Linear Scale
+ Domain: 手动设置[min,max],自动计算[min,max],允许加上一定的offset