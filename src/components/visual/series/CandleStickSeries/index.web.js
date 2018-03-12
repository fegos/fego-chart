/**
 * K线图组件
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { calcOffset, calcBarWidth } from '../../common/helper'
import { getMousePosition, getCurrentItem, getClosetItemIndex } from '../../../util'

class CandleStickSeries extends Component {
	cache = {
		isMouseEvent: false
	}
	static defaultProps = {
		yAccessor: (d) => { return [d[1], d[2], d[3], d[4]] },
		barWidth: 8,
		lineWidth: 1,
		strokeStyle: '#3E3E3E',
		fill: (d) => { return d[1] > d[2] ? "#6BA583" : "#D75442" },
		onClick: () => { }
	}
	static propTypes = {
		yAccessor: PropTypes.func,
		barWidth: PropTypes.number,
		lineWidth: PropTypes.number,
		strokeStyle: PropTypes.string,
		fill: PropTypes.func,
		onClick: PropTypes.func
	}
	constructor(props) {
		super(props)
		this.state = {}
	}
	componentWillReceiveProps(nextProps, nextContext) {
		this.draw(nextProps, nextContext)
		this.addMouseEvent(nextContext)
	}
	// 添加鼠标移动时事件监听
	addMouseEvent = (nextContext, eventHandler) => {
		let { events, canvas, plotData } = nextContext;
		let { mouseDrag, mouseWheel, mouseDown } = events;
		// 拖动和滚轮时清空事件监听
		if ((mouseDrag.trigger || mouseWheel.trigger) && this.cache.isMouseEvent) {
			canvas.removeEventListener('mousemove', this.mouseHandler.bind(this, nextContext, ''))
			canvas.removeEventListener('mousedown', this.mouseHandler.bind(this, nextContext, 'down'))
			this.cache.isMouseEvent = false
		}
		// 第一次鼠标移动时添加事件监听
		if (this.cache.isMouseEvent || mouseDrag.trigger || mouseWheel.trigger) return
		if (plotData.macdRegion) {
			canvas.addEventListener('mousemove', this.mouseHandler.bind(this, nextContext, ''))
			canvas.addEventListener('mousedown', this.mouseHandler.bind(this, nextContext, 'down'))
			this.cache.isMouseEvent = true
		}
	}
	// 鼠标事件回调
	mouseHandler = (nextContext, type='', e) => {
		let { onClick } = this.props;
		let { canvas, plotData, containerFrame, xScale, events } = nextContext;
		let [mouseX, mouseY] = getMousePosition(e, canvas, containerFrame);
		let item = getCurrentItem(xScale, null, [mouseX, mouseY], plotData.currentData, 'index');
		mouseX += containerFrame.padding.left
		mouseY += containerFrame.padding.top
		let isInRect = this.isInRect([mouseX, mouseY], plotData.macdRegion[item])
		canvas.style.cursor = isInRect ? 'pointer' : 'default'
		// onClick props回调
		if(type === 'down' && isInRect) {
			onClick && plotData.currentData[item] && onClick(plotData.currentData[item][0])
		}
	}
	// 判断是否在矩形区域内
	isInRect = (mouse, rect) => {
		if (!rect) return false
		let [x, y] = mouse, [x1, y1, width, height] = rect;
		if (x >= x1 && y >= y1 && x <= x1 + width && y <= y1 + height) {
			return true
		}
		return false
	}
	//绘制K线
	draw(nextProps, nextContext) {
		let { context, plotData, containerFrame, chartFrame, xScale, yScale, canvas } = nextContext;
		if (!plotData.dateTime) return;

		//计算数据
		let data = []
		data = plotData.dateTime.map((dt, idx) => {
			return [dt].concat(nextProps.yAccessor(plotData.fullData[idx]))
		})
		data = data.slice(plotData.indexs[0], plotData.indexs[1])
		plotData.macdRegion = []
		//绘制K线
		for (let i = 0; i < data.length; i++) {
			let d = data[i]
			let candleStickObj = this.calcCandleStick(d, nextProps, nextContext, i, data.length - 1)
			plotData.macdRegion[i] = this.drawEachCandle(candleStickObj, nextProps, nextContext)
		}
	}

	//计算每条K线的绘制属性
	calcCandleStick = (candle, props, chartContext, idx, lastIdx) => {
		let { fill } = this.props
		let { xScale, yScale } = chartContext
		let xPos = xScale(idx),
			openPos = yScale(candle[1]),
			closePos = yScale(candle[2]),
			highPos = yScale(candle[3]),
			lowPos = yScale(candle[4]),
			fillStyle = fill(candle),
			isFirst = (+idx === 0),
			isLast = (+idx === +lastIdx);

		return {
			xPos,
			openPos,
			closePos,
			highPos,
			lowPos,
			fillStyle,
			isFirst,
			isLast
		}
	}

	//绘制单条K线
	drawEachCandle = (candle, props, chartContext) => {
		let { barWidth, spacing, strokeStyle } = props
		let { context, containerFrame, chartFrame } = chartContext
		if (!context) return;
		barWidth = calcBarWidth(props, chartContext) || barWidth
		let offsets = calcOffset(containerFrame, chartFrame);
		let candleRegion = [];
		candle.xPos = candle.xPos + offsets[0]
		candle.openPos = candle.openPos + offsets[1]
		candle.closePos = candle.closePos + offsets[1]
		candle.highPos = candle.highPos + offsets[1]
		candle.lowPos = candle.lowPos + offsets[1]

		context.save()
		//绘制方块, 本身值越高则pos值越低, 因为在计算yScale的时候的range是[heihgt,0]
		context.beginPath()
		context.fillStyle = candle.fillStyle
		if (candle.isFirst) {
			candleRegion = [candle.xPos, Math.min(candle.openPos, candle.closePos), barWidth / 2, Math.abs(candle.closePos - candle.openPos)]
		} else if (candle.isLast) {
			candleRegion = [candle.xPos - barWidth / 2, Math.min(candle.openPos, candle.closePos), barWidth / 2, Math.abs(candle.closePos - candle.openPos)]
		} else {
			candleRegion = [candle.xPos - barWidth / 2, Math.min(candle.openPos, candle.closePos), barWidth, Math.abs(candle.closePos - candle.openPos)]
		}
		context.rect(...candleRegion)
		context.fill()
		context.closePath()

		//绘制上下蜡烛芯
		context.beginPath()
		context.strokeStyle = strokeStyle
		context.lineWidth = this.props.lineWidth
		context.moveTo(candle.xPos, Math.min(candle.openPos, candle.closePos))
		context.lineTo(candle.xPos, candle.highPos)
		context.stroke()
		context.moveTo(candle.xPos, Math.max(candle.openPos, candle.closePos))
		context.lineTo(candle.xPos, candle.lowPos)
		context.stroke()
		context.closePath()
		context.restore()
		return candleRegion
	}

	render() {
		return null;
	}
}

CandleStickSeries.contextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	plotConfig: PropTypes.object,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object,
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	canvas: PropTypes.object
}

export default CandleStickSeries