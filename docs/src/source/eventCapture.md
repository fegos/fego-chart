---
layout: default
id: eventCapture
title: EventCapture组件
---



## 移动端

### props列表

|属性  | 类型 | 参数 | 默认值 | 描述  |
| --- | --- |  --- |  ---  | ---  |
|eventCaptures|array|无|[]|支持的手势类型|
|shouldCaptureMoveGesture|bool|无|false|是否捕获移动手势|
|shouldCapturePressGesture|bool|无|false|是否捕获点击手势|
|shouldTerminationRequest|bool|无|true|是否出让手势|
|shouldBlockNativeResponder|bool|无|true|是否冻结native手势响应|
|longPressTimeoutInterval|number|无|500|长按手势时间阈值ms|
|doublePressTimeoutInterval|number|无|300|双击手势时间阈值ms|
|onPan|function|(e, gestureState)|null|滑动手势回调|
|onPinch|function|(e, scale, updateScale)|null|放缩手势回调|
|onPress|function|(e, gestureState)|null|单击手势回调|
|onLongPress|function|(e, gestureState)|null|长按手势回调|
|onDoublePress|function|(e, gestureState)|null|双击手势回调|
