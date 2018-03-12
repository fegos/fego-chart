/**
 * ChartContainer通用辅助函数
 */

//计算图表尺寸和布局
export function getContainerFrame(frame) {
	let padding = frame.padding || { left: 0, right:0, top:0, bottom: 0}
	return {
		height: frame.height,
		width: frame.width,
		padding: padding,
		chartWidth: frame.width - padding.left - padding.right,
		chartHeight: frame.height - padding.top - padding.bottom
	}
}

export function getChartFrame(frame){
	let padding = frame.padding || { left: 0, right:0, top:0, bottom: 0}
	return {
		height: frame.height,
		width: frame.width,
		padding: padding,
		chartWidth: frame.width - padding.left - padding.right,
		chartHeight: frame.height - padding.top - padding.bottom
	}
}

export function calcStateForDomain(newDomain,props,state) {
	let { data } = props;
	let { xScale, plotData } = state;
	let xAccessor = (d) => {return d[0]}
	let newExtents = extentsWrapper(data,newDomain,xAccessor,xScale,plotData,xScale.domain())
	return newExtents
}

//根据new domain计算新的plotData
function extentsWrapper (data,newDomain,xAccessor,currXScale,currPlotData,currDomain) {
	let left = newDomain[0]
	let right = newDomain[newDomain.length-1]
	let filterData = calcFilteredData(data,left,right,xAccessor)
	let first = filterData[0]
	let last = filterData[filterData.length-1]
	let realInputDomain = [xAccessor(first),xAccessor(last)]
	return {
		plotExtents: filterData.extents,
		plotData: filterData,
		domain: realInputDomain
	}
}

function calcFilteredData (data,left,right,xAccessor) {
	const newLeftIndex = getClosetItemIndex(data, left, xAccessor).right;
	const newRightIndex = getClosetItemIndex(data, right, xAccessor).left;
	const filteredData = data.slice(newLeftIndex, newRightIndex + 1);
	filteredData.extents = [newLeftIndex, newRightIndex]
	return filteredData;
}

export function getCurrentItem(xScale,xAccessor,location,plotData,scaleType){
	if(!xAccessor) xAccessor = (d) => { return d[0] }
	if(!xScale) return;
	let xValue, item
	xValue = xScale.invert(location[0])
	if(scaleType === 'index') return Math.round(xValue)
	item = getClosetItem(plotData,xValue,xAccessor,'index')
	return item;
}

function getClosetItem(plotData,xValue,xAccessor){
	const { left, right } = getClosetItemIndex(plotData,xValue,xAccessor)
	if(left === right){
		return plotData[left]
	}
	const closet = (Math.abs(xAccessor(plotData[left]-xValue)) < Math.abs(xAccessor(plotData[right])-xValue)) ?
	plotData[left]:plotData[right];
	return closet
}

function getClosetItemIndex(plotData,xValue,xAccessor){
	let lo = 0, hi = plotData.length - 1
	while ((hi - lo) > 1){
		const mid = Math.round((lo + hi) / 2)
		if(xAccessor(plotData[mid]) <= xValue){
			lo = mid;
		} else {
			hi = mid;
		}
	}
	if(xAccessor(plotData[lo]).valueOf() === xValue.valueOf()) hi = lo
	if(xAccessor(plotData[hi]).valueOf() === xValue.valueOf()) lo = hi
	if(xAccessor(plotData[lo]) < xValue &&  xAccessor(plotData[hi]) < xValue) lo = hi
	if(xAccessor(plotData[lo]) > xValue &&  xAccessor(plotData[hi]) > xValue) hi = lo
	return { left: lo, right: hi}
}

//通过containerFrame和chartFrame计算绘制区域偏移量
export function calcOffset(containerFrame,chartFrame){
	let xOffset = (containerFrame ? containerFrame.padding.left : 0) + (chartFrame ? chartFrame.origin[0] : 0)
	//chartFrame.top即为最上方图表
	let yOffset = ((containerFrame && chartFrame && chartFrame.top) ? containerFrame.padding.top : 0) + (chartFrame ? chartFrame.origin[1] : 0)
	return [xOffset,yOffset]
}

export function calcBarWidth(props,chartContext,moreProps){
	let { containerFrame, plotData, plotConfig } = chartContext
	let barWidth = 0
	let dataLength = plotData.indexs[1] - plotData.indexs[0] + 1
	barWidth = Math.floor((containerFrame.chartWidth - (plotConfig.spacing)*(dataLength-1))/dataLength);
	return barWidth;
}

//判断某一点是否在当前Chart内
export function isDotInsideChart(location,frame){
	//location是相对chartContainer的坐标
	let locX = +location[0]
	let locY = +location[1]
	if(locX < frame.x) return false
	if(locX > (frame.x + frame.width)) return false
	if(locY < frame.y) return false
	if(locY > (frame.y + frame.height)) return false
	return true
}