# components
---
## 容器组件
### ChartContainer: 最外层图表容器，保存数据, canvas context, chartConfig等核心配置
#### props
+ width: 宽度
+ height：高度
+ margin：边距
+ data: 原始数据
#### state
+ plotData: 经过计算选出需要在屏幕展示的数据
+ chartConfig: 图表整体设置信息，包括长、宽、内部边距
+ eventCapture: 事件对象
### Chart: 图表容器，ChartContainer下可以有个多个Chart, 可见元素都放在Chart里, chart维护一个chart在图表上的位置
#### props
+ width: 当前chart的宽度
+ height： 当前chart的高度
+ origin： 当前chart起始位置
---
## 绘制组件
### GenericComponent: 绘制组件基类
### Axes: 轴
### Series: 图表
### Tooltip: 标注
### Interaction: 绘图