---
layout: default
id: loadMoreView
title: LoadMoreView组件
---

## Workflow
|State|UI|
|--|--|
|event: onPan, start = 0 && dx > 0, 触发onLoadMore判断|图表向左滑动|
|onLoadMore: preload|LoadMoreView出现|
|event: release, 通过dx判断是否触发loading||
|onLoadMore: loading|LoadingMoreView:loading|
|onLoadMore: inactive|LoadMoreView消失|

## Props
|name|value|default|备注|
|--|--|--|--|
|visible|boolean|true|控制显示loadMoreView视觉元素|
|position||||
|width||||
|height||||

## State
|name|value|default|备注|
|--|--|--|--|
|loading|boolean|false|控制显示加载状态的文案和icon|

## 其他
+ ChartContainer的onLoadMore传入的函数须返回Promise，用于控制onLoadMore事件的loading状态