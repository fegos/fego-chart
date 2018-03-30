---
layout: default
id: overview
title: 行情渲染引擎工作流程
---

引擎工作流程及架构
## Workflow:

### Data Management
+ 获取和预处理
	+ 数据格式转化
+ 保存
+ 计算
+ 分发

### Event Management
+ 监听
+ 识别及处理事件(事件冲突)
+ 分发事件

### Layout, Style & Draw
+ 整体布局
+ Chart内布局
+ Chart间布局

---
## 引擎架构
+ ChartContainer: 图表整体容器，唯一的数据管理以及事件监听容器
+ Chart
+ Components

### 组件功能
1. chartContainer: 获取数据，整体frame，(optional props: xExtents, indicators), 获取data和frame后，计算plotData, xScale
2. chart: 获取chartFrame, yExtents, 计算yScale
3. components: 根据xScale,yScale和data，结合组件自身的绘制规则进行绘制

---
流程

<div id="graph"></div>
<script src="https://gw.alipayobjects.com/as/g/datavis/g6/1.2.0/g6.min.js"></script>
<script src="https://gw.alipayobjects.com/as/g/datavis/g6-plugins/1.0.0/g6-plugins.min.js"></script>
<script>
const data = {
	"nodes": [
		{id:'0',label:'Data 数据'},
		{id:'1',label:'ChartContainer 图表容器'},
		{id:'2',label:'Chart 布局容器'},
		{id:'3',label:'全局视觉组件(如Background)'},
		{id:'4',label:'EventCapture 事件捕捉'},
		{id:'5',label:'视觉组件(如Axis)'},
		{id:'6',label:'视觉组件(如CandleStickSeries)'},
	],
	"edges": [
		{id:'0-1',source:'0',target:'1'},
		{id:'1-2',source:'1',target:'2'},
		{id:'1-3',source:'1',target:'3'},
		{id:'1-4',source:'1',target:'4'},
		{id:'2-5',source:'2',target:'5'},
		{id:'2-6',source:'2',target:'6'},
	]
};
const dagre = new G6.Plugins['layout.dagre']({
  rankdir: 'LR',
  nodesep: 100,
  ranksep: 100,
});
const net = new G6.Net({
  id: 'graph',
  height: window.innerHeight,
  fitView: 'autoZoom',
  plugins: [dagre]
});
net.source(data.nodes, data.edges);
net.edge().shape('arrow');
net.render();
</script>

