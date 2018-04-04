'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContainerFrame = getContainerFrame;
exports.getChartFrame = getChartFrame;
exports.calcStateForDomain = calcStateForDomain;
exports.getCurrentItem = getCurrentItem;
exports.calcOffset = calcOffset;
exports.calcBarWidth = calcBarWidth;
exports.isDotInsideChart = isDotInsideChart;
/**
 * ChartContainer通用辅助函数
 */

// 计算图表尺寸和布局
function getContainerFrame(frame) {
  var padding = frame.padding || {
    left: 0, right: 0, top: 0, bottom: 0
  };
  return {
    height: frame.height,
    width: frame.width,
    padding: padding,
    chartWidth: frame.width - padding.left - padding.right,
    chartHeight: frame.height - padding.top - padding.bottom
  };
}

function getChartFrame(frame) {
  var padding = frame.padding || {
    left: 0, right: 0, top: 0, bottom: 0
  };
  return {
    height: frame.height,
    width: frame.width,
    padding: padding,
    chartWidth: frame.width - padding.left - padding.right,
    chartHeight: frame.height - padding.top - padding.bottom
  };
}

function getClosetItemIndex(plotData, xValue, xAccessor) {
  var lo = 0;
  var hi = plotData.length - 1;
  while (hi - lo > 1) {
    var mid = Math.round((lo + hi) / 2);
    if (xAccessor(plotData[mid]) <= xValue) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  if (xAccessor(plotData[lo]).valueOf() === xValue.valueOf()) hi = lo;
  if (xAccessor(plotData[hi]).valueOf() === xValue.valueOf()) lo = hi;
  if (xAccessor(plotData[lo]) < xValue && xAccessor(plotData[hi]) < xValue) lo = hi;
  if (xAccessor(plotData[lo]) > xValue && xAccessor(plotData[hi]) > xValue) hi = lo;
  return { left: lo, right: hi };
}

function calcFilteredData(data, left, right, xAccessor) {
  var newLeftIndex = getClosetItemIndex(data, left, xAccessor).right;
  var newRightIndex = getClosetItemIndex(data, right, xAccessor).left;
  var filteredData = data.slice(newLeftIndex, newRightIndex + 1);
  filteredData.extents = [newLeftIndex, newRightIndex];
  return filteredData;
}

// 根据new domain计算新的plotData
function extentsWrapper(data, newDomain, xAccessor) {
  var left = newDomain[0];
  var right = newDomain[newDomain.length - 1];
  var filterData = calcFilteredData(data, left, right, xAccessor);
  var first = filterData[0];
  var last = filterData[filterData.length - 1];
  var realInputDomain = [xAccessor(first), xAccessor(last)];
  return {
    plotExtents: filterData.extents,
    plotData: filterData,
    domain: realInputDomain
  };
}

function calcStateForDomain(newDomain, props, state) {
  var data = props.data;
  var xScale = state.xScale,
      plotData = state.plotData;

  var xAccessor = function xAccessor(d) {
    return d[0];
  };
  var newExtents = extentsWrapper(data, newDomain, xAccessor, xScale, plotData, xScale.domain());
  return newExtents;
}

function getClosetItem(plotData, xValue, xAccessor) {
  var _getClosetItemIndex = getClosetItemIndex(plotData, xValue, xAccessor),
      left = _getClosetItemIndex.left,
      right = _getClosetItemIndex.right;

  if (left === right) {
    return plotData[left];
  }
  var closet = Math.abs(xAccessor(plotData[left] - xValue)) < Math.abs(xAccessor(plotData[right]) - xValue) ? plotData[left] : plotData[right];
  return closet;
}

function getCurrentItem(xScale, xAccessor, location, plotData, scaleType) {
  if (!xAccessor) xAccessor = function xAccessor(d) {
    return d[0];
  };
  if (!xScale) return null;
  var xValue = xScale.invert(location[0]);
  if (scaleType === 'index') {
    return Math.round(xValue);
  }
  var item = getClosetItem(plotData, xValue, xAccessor, 'index');
  return item;
}

// 通过containerFrame和chartFrame计算绘制区域偏移量
function calcOffset(containerFrame, chartFrame) {
  var xOffset = (containerFrame ? containerFrame.padding.left : 0) + (chartFrame ? chartFrame.origin[0] : 0);
  // chartFrame.top即为最上方图表
  var yOffset = (containerFrame && chartFrame && chartFrame.top ? containerFrame.padding.top : 0) + (chartFrame ? chartFrame.origin[1] : 0);
  return [xOffset, yOffset];
}

function calcBarWidth(props, chartContext) {
  var containerFrame = chartContext.containerFrame,
      plotData = chartContext.plotData,
      plotConfig = chartContext.plotConfig;

  var barWidth = 0;
  var dataLength = plotData.indexs[1] - plotData.indexs[0] + 1;
  barWidth = Math.floor((containerFrame.chartWidth - plotConfig.spacing * (dataLength - 1)) / dataLength);
  return barWidth;
}

// 判断某一点是否在当前Chart内
function isDotInsideChart(location, frame) {
  // location是相对chartContainer的坐标
  var locX = +location[0];
  var locY = +location[1];
  if (locX < frame.x) return false;
  if (locX > frame.x + frame.width) return false;
  if (locY < frame.y) return false;
  if (locY > frame.y + frame.height) return false;
  return true;
}