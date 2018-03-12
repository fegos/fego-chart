/**
 * ChartContainer组件 图表整体容器
 * # Props:
 * + frame 尺寸，布局
 * + data 原始数据
 * + xAccessor 获取X轴数据
 * + extraData 自定义计算数据字典
 * 
 * # State:
 * + containerFrame
 * + plotData
 * + plotConfig 图像尺寸设置
 * + events
 * + xScale
 * 
 * # Cache:
 * + canvas context
 * 
 * # Method:
 * + updateContainer: chartContainer状态控制，[props更新]或者[事件捕捉]都可以触发是否重绘的判断
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { scaleLinear, scaleTime } from 'd3-scale'
import { extent } from 'd3-array'
import { getContainerFrame, calcStateForDomain, calcBarWidth } from '../common/helper'
import { getMousePosition, getCurrentItem, getClosetItemIndex } from '../../util'
import { calculateXScale } from '../../scale'
import EventCapture from '../EventCapture/index.web'
import CalculateUtil from '../CalculateUtil'
import { isEqual } from 'lodash/lang'

const emptyEvent = {
	trigger: false,
	mouseX: null,
	mouseY: null
}

class ChartContainer extends Component {

	constructor(props) {
		super(props)
		let { frame } = this.props;
		//初始化ChartContainer内部状态
		this.state = {
			containerFrame: getContainerFrame(frame),
			events: {
				mouseEnter: emptyEvent,
				mouseDown: emptyEvent,
				mouseDrag: emptyEvent,
				mouseMove: emptyEvent,
				mouseLeave: emptyEvent,
				mouseWheel: emptyEvent
			},
			plotData: {
				indexs: [],
				currentData: []
			},
			plotConfig: {
				barWidth: 10, //K线宽度
				spacing: 5, //K线距离
				step: 15, //分时数据点距离
				zoomMultiplier: 1.05
			},
			xScale: null,
			currentZoom: 1,
			canvas: null
		}
		//初始化cache
		this.cache = {}
	}

	componentDidMount() {
		let canvas = this.cache.canvas
		if (canvas) {
			let context = canvas.getContext('2d')
			this.updateContainer(this.props)
		}
	}

	componentWillReceiveProps(nextProps) {
		//更新container状态
		this.updateContainer(nextProps)
	}

	// 设置事件状态，eventTypes支持传字符串和数组
	setEvent = (eventTypes, trigger = false, mouseX = null, mouseY = null, moreProps) => {
		let events = Object.assign({}, this.state.events), eventArr = []
		eventArr = typeof eventTypes === 'string' ? [eventTypes] : (Array.isArray(eventTypes) ? eventTypes : [])
		for (let item of eventArr) {
			events[item] ? events[item] = { trigger, mouseX, mouseY, ...moreProps } : null
		}
		this.setState({ events })
	}

	//设置context
	getChildContext() {
		let { plotData, plotConfig, containerFrame, events, xScale } = this.state;
		let { context, canvas } = this.cache;
		return {
			context,
			plotData,
			plotConfig,
			containerFrame,
			events,
			xScale,
			canvas
		}
	}

	//更新ChartContainer, 更新props或者事件触发
	updateContainer = (nextProps, moreProps, moreState) => {
		this.clearCanvas()
		//更新数据
		let plotData = this.getPlotData(nextProps, moreProps)
		//更新xScale
		let xScale = this.getXScale(plotData, moreProps)
		if (moreState && moreState.xScale) xScale = moreState.xScale
		this.setState({
			plotData,
			xScale,
			...moreState
		})
	}

	//通过对比新旧props判断是否更新
	shouldUpdateContainer(prevProps, nextProps) {
		return !isEqual(prevProps,nextProps)
	}

	//清除画布
	clearCanvas = () => {
		let { context } = this.cache;
		if (context) {
			context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight)
		}
	}

	//数据计算和选取
	getPlotData = (nextProps, moreProps) => {
		let { xExtents, data, indicators, newIndicators } = nextProps;
		if (moreProps) xExtents = moreProps.xExtents
		let plotData = {}
		if (data && data.length > 0) {
			//选取数据
			plotData.fullData = data
			plotData.dateTime = data.map(d => { return d[0] })
			plotData.indexs = xExtents || [0, 100]
			plotData.currentData = Array.from(data).slice(plotData.indexs[0], plotData.indexs[1])
			//计算indicators
			if (indicators) {
				if (!plotData.calcedData) plotData.calcedData = {}
				CalculateUtil.indicatorsHelper(indicators, plotData)
			}
		}
		return plotData
	}

	//计算xScale
	getXScale = (plotData, moreProps) => {
		let { xAccessor, totalCount } = this.props;
		let { containerFrame } = this.state;
		let { currentData } = plotData
		if (currentData && currentData.length > 0) {
			let xData;
			if (totalCount && !isNaN(+totalCount)) xData = [0, totalCount]
			else xData = [0, currentData.length - 1]
			let xScale = calculateXScale(xData, containerFrame, 'index')
			return xScale
		} else {
			return null
		}
	}

	isMouseBeyondLastItem = () => {}
	//鼠标移动事件

	handleMouseMove = (e) => {
		let { frame } = this.props;
		let { xScale, plotData } = this.state;
		this.clearCanvas()
		let rect = this.cache.canvas.getBoundingClientRect();
		let mouseX, mouseY, realMouseX;
		if (plotData.indexs) {
			mouseX = e.clientX - rect.left
			let lastItemX = xScale(plotData.currentData.length - 1) + frame.padding.left;
			realMouseX = mouseX
			mouseX = Math.min(mouseX, lastItemX)
			mouseY = e.clientY - rect.top
		}
		this.setEvent('mouseMove', true, mouseX, mouseY, { realMouseX })
		if (this.state.events.mouseWheel.trigger) {
			this.setEvent('mouseWheel')
		}
	}
	handleMouseEnter = (e) => {
		this.clearCanvas()
		this.setEvent('mouseEnter', true)
		this.setEvent('mouseLeave', false)
	}

	handleMouseLeave = (e) => {
		this.clearCanvas()
		this.setEvent(['mouseEnter', 'mouseDown'])
		this.setEvent('mouseLeave', true)
	}

	//鼠标拖动事件
	handleMouseDown = (e) => {
		this.clearCanvas()
		let { containerFrame, plotData, xScale } = this.state;
		let { onClick } = this.props
		let [mouseX, mouseY] = getMousePosition(e, this.cache.canvas, containerFrame);
		let item;
		this.setEvent('mouseDown', true)
		this.setEvent('mouseDrag', false, mouseX, mouseY)
		// onClick回调返回当前点击item的时间毫秒数
		onClick && (item = getCurrentItem(xScale, null, [mouseX, mouseY], plotData.currentData, 'index')) && onClick(plotData.currentData[item][0]) // onClick回调返回当前点击item的时间毫秒数
	}

	handleMouseDrag = (e) => {
		let { onLoadMore } = this.props;
		let { events } = this.state;
		let { context } = this.cache;

		if (events.mouseDown.trigger) {
			let { containerFrame, xScale, plotData, plotConfig } = this.state;
			let newXScale = xScale.copy()
			let [mouseX, mouseY] = getMousePosition(e, this.cache.canvas, containerFrame);
			let mouseDistance = mouseX - events.mouseDrag.mouseX;
			let barWidth = calcBarWidth(1, this.state)
			if (Math.abs(mouseDistance) < barWidth) return
			let shiftIndex = Math.ceil(mouseDistance / barWidth)
			let xExtents, plotDataNum = plotData.indexs[1] - plotData.indexs[0];
			if (plotData.indexs[0] + shiftIndex < 0) {
				if (onLoadMore && (typeof onLoadMore === 'function')) {
					onLoadMore()
					xExtents = [0, plotDataNum]
				} else {
					xExtents = [0, plotDataNum]
				}
			} else if (plotData.indexs[1] + shiftIndex > plotData.fullData.length) {
				xExtents = [plotData.fullData.length - plotDataNum, plotData.fullData.length]
			} else {
				xExtents = plotData.indexs.map((data, idx) => {
					return data + shiftIndex
				})
			}
			this.setEvent('mouseDrag', true, mouseX, mouseY)
			this.updateContainer(this.props, { xExtents }, { xScale: newXScale })
		}
	}

	handleMouseUp = () => {
		this.setEvent(['mouseDown', 'mouseDrag'])
	}

	//鼠标滚动
	handleMouseWheel = (e) => {
		e.preventDefault()
		let { thresholds } = this.props;
		let { containerFrame, xScale, plotData, plotConfig, currentZoom } = this.state;
		let zoomDirection = e.deltaY > 0 ? 1 : -1;
		if ((currentZoom < thresholds.minZoom && zoomDirection < 0) || (currentZoom > thresholds.maxZoom && zoomDirection > 0)) return;

		this.clearCanvas()
		let { zoomMultiplier } = plotConfig;
		let { indexs } = plotData
		let mouseXY = getMousePosition(e, this.cache.canvas, containerFrame)

		//根据缩放程度计算新domain
		let item, cx, c, newDomain
		item = getCurrentItem(xScale, null, mouseXY, plotData.currentData, 'index')
		cx = xScale(item)
		c = zoomDirection > 0 ? zoomMultiplier : 1 / zoomMultiplier
		newDomain = xScale.range().map(x => cx + (x - cx) * c).map(xScale.invert)
		let newZoom = c * currentZoom

		//计算新plotData和scale
		let shiftIndexs = zoomDirection > 0 ? [-1, 1] : [1, -1]
		let newIndexes = [Math.max(0, indexs[0] + shiftIndexs[0]), indexs[1] + shiftIndexs[1]]
		this.setEvent('mouseWheel', true)
		this.updateContainer(this.props, { xExtents: newIndexes }, { currentZoom: newZoom })
	}

	getCanvasRef = (node) => {
		if (node) {
			this.cache.canvas = node
			this.cache.context = node.getContext('2d')
		} else {
			this.cache.canvas = null
			this.cache.context = null
		}
	}

	render() {
		let { children, eventCaptures } = this.props;
		let { containerFrame } = this.state;
		let { width, height } = containerFrame;

		return (
			<div>
				<canvas
					ref={this.getCanvasRef}
					width={width}
					height={height}
				/>
				<EventCapture
					eventCaptures={eventCaptures}
					canvas={this.cache.canvas}
					onmouseenter={this.handleMouseEnter}
					onmousemove={[this.handleMouseMove, this.handleMouseDrag]}
					onmouseleave={this.handleMouseLeave}
					onmousewheel={this.handleMouseWheel}
					onmouseup={this.handleMouseUp}
					onmousedown={this.handleMouseDown}
				>
					{children}
				</EventCapture>
			</div>
		)
	}
}
ChartContainer.propTypes = {
	frame: PropTypes.object,
	data: PropTypes.array,
	xAccessor: PropTypes.func
}
ChartContainer.childContextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	plotConfig: PropTypes.object,
	containerFrame: PropTypes.object,
	xScale: PropTypes.func,
	events: PropTypes.object,
	canvas: PropTypes.object
}
ChartContainer.defaultProps = {
	xAccessor: (d) => { return d[0] },
	thresholds: {
		minZoom: 0.50,
		maxZoom: 2.0
	}
}

export default ChartContainer
