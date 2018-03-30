---
layout: default
id: chartContainer
title: ChartContainer
---

### 使用示例

~~~``

/*分时图*/
<ChartContainer
	style={{ flex: 1, paddingHorizontal: 10, paddingTop: StyleSheet.hairlineWidth, backgroundColor: Const.bgColor2 }}
	data={timelineData.result}
	horizontal={this.props.isHorizontal}
	statusBarHeight={Const.statusBarHeight}
	preClosedPrice={timelineData.lastClosePrice}
	totalCount={1321}
	xDateTicks={['06:00', '17:00', '04:00']}
	chartType={'timeline'}
	eventCaptures={['longPress', 'doublePress']}
	plotState={plotState}
	plotConfig={this._plotConfig}
	onLoadMore={() => this._onLoadMore()}
	onLongPress={this._onLongPress}
	onDoublePress={this._onDoublePress}
>
	{...children}
</ChartContainer>

/*五日图*/
<ChartContainer
	style={{ flex: 1, paddingHorizontal: 10, paddingTop: StyleSheet.hairlineWidth, backgroundColor: Const.bgColor2 }}
	data={fivedayData}
	horizontal={this.props.isHorizontal}
	statusBarHeight={Const.statusBarHeight}
	preClosedPrice={this._lastClosePrice}
	totalCount={1321 * 5}
	xDateTicks={this._dateStrArray}
	chartType={'fiveday'}
	dataOffset={this.state.dataOffset}
	eventCaptures={['longPress', 'doublePress']}
	plotState={plotState}
	plotConfig={this._plotConfig}
	onLongPress={this._onLongPress}
	onDoublePress={this._onDoublePress}
>
	{...children}
</ChartContainer>

/*K线图*/
<ChartContainer
	style={{ flex: 1, paddingHorizontal: 10, paddingBottom: paddingBottom, paddingTop: StyleSheet.hairlineWidth, backgroundColor: Const.bgColor2 }}
	data={klineData}
	horizontal={this.props.isHorizontal}
	statusBarHeight={Const.statusBarHeight}
	chartType={'kline'}
	indicators={this.state.indicators}
	threshold={60}
	domain={domain}
	plotState={plotState}
	plotConfig={this._plotConfig}
	hasMore={hasMore}
	onLoadMore={() => this._onLoadMore()}
	updateDomain={(chartType, domain) => this._updateDomain(chartType, domain)}
	updatePlotState={(plotState) => this._updatePlotState(plotState)}
	eventCaptures={['pan', 'press', 'longPress', 'doublePress', 'pinch']}
	onLongPress={this._onLongPress}
	onPress={this._onPress}
	onPan={this._onPan}
	onDoublePress={this._onDoublePress}
>
	{...children}
</ChartContainer>


~~~

### props列表

|属性  | 类型 | 参数 | 默认值 | 是否为必须 | 描述  |
| --- | --- |  --- |  ---  | ---| ---  |
|chartType|string|无|无|是|当前图表类型（timeline \| kline）|
|horizontal|bool|无|false|否|是否为横屏|
|statusBarHeight|number|无|0|否|导航栏高度|
|dataOffset|number|无|0|否|数据偏移量，主要用于不从起始位置开始的五日图|
|preClosedPrice|string|无|无|否|昨日收盘价，假如为5日图，则为早一天的昨日收盘价|
|totalCount|number|无|无|否|分时图、五日图的总数据量|
|xDateTicks|array|无|无|否|分时图、五日图的横坐标数组|
|threshold|number|无|无|否|加载更多阈值(K线左侧距离左边界的距离)，一般设置为60|
|data|array|无|无|是|图表原始数据|
|indicators|object|无|无|否|图表技术指标|
|eventCaptures|array|无|[]|否|支持手势数组,假如不设置则不支持交互，支持手势种类(pan \| pinch \| press \| longPress \| doublePress)|
|domain|object|无|无|否|数据显示区间，{start:XX, end:YY}|
|plotConfig|object|无|{spacing:2, barWidth:6}|否|图标配置|
|plotState|object|无|无|否|图标状态{currScale:aa, currBarWidth:bb, currStep:cc, xGridGap:dd}|
|hasMore|bool|无|无|否|是否有更多历史数据|
|onLoadMore|function|无|无|否|加载更多历史数据|
|onDoublePress|function|无|无|否|触发双击事件|
|onLongPress|function|(currentItem)|无|否|触发长按事件|
|onPan|function|(dx,dy)|无|否|滑动事件回调|
|updateDomain|function|（chartType, newDomain）|无|否|更新数据显示区间|
|updatePlotState|function|(newPlotState)|无|否|更新图标状态|


