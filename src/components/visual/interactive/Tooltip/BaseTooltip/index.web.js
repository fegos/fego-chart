/**
 * BaseTooltip
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getMousePosition, getCurrentItem } from '../../../util'
import { isDotInsideChart } from '../../common/helper'
import moment from 'moment'

let xSpace = 10, ySpace = 20, boxWidth = 0, xLeft = 0, xRight = 0
const defaultTextColor = '#fff'
const defaultBackgroundColor = '#000'
class BaseTooltip extends Component {
	static defaultProps = {
		visible: true,
		xPos: 10,
		yPos: 20,
		type: '', // type 可为 group 和 ''，type = 'group' 表示MACD和KDJ、BOLL等复合指标线，type = '' 表示 MA、RSI等单条指标线
		bgColor: defaultBackgroundColor,
		alpha: 0.4,
		font: "italic 25px"
	}
	static propTypes = {
		visible: PropTypes.bool,
		xPos: PropTypes.number,
		yPos: PropTypes.number,
		type: PropTypes.string,
		indicators: PropTypes.array,
		valueKeys: PropTypes.array,
		bgColor: PropTypes.string,
		alpha: PropTypes.number,
		font: PropTypes.string
	}
	cache = {
		isDraw: false
	}
	compontDidMount() {
		this.drawTip(this.props, this.context)
	}
	componentWillReceiveProps(nextProps, nextContext) {
		this.drawTip(nextProps, nextContext)
	}
	// 绘制图例
	drawTip = (props, nextContext) => {
		let { indicators, type, valueKeys, visible, xPos, yPos } = props
		let { xScale, yScale, plotData, context, chartFrame, containerFrame, events } = nextContext
		if (!visible) return
		let data = plotData.fullData;
		let { mouseMove } = events
		if (context && xScale && data && data.length > 0) {
			// tooltip初始位置为左上角
			xLeft = chartFrame.origin[0] + containerFrame.padding.left + xPos
			xRight = containerFrame.chartWidth + containerFrame.padding.right - (boxWidth + xPos)
			let x = xLeft,
				y = chartFrame.origin[1] ? chartFrame.origin[1] + yPos : chartFrame.origin[1] + containerFrame.padding.top + yPos,
				toolTipText = '',
				item;
			// 鼠标移动
			if (mouseMove.trigger) {
				let rect = context.canvas.getBoundingClientRect();
				let e = {
					clientX: mouseMove.mouseX + rect.left,
					clientY: mouseMove.mouseY + rect.top
				}
				let mouseXY = getMousePosition(e, context.canvas, containerFrame)
				item = getCurrentItem(xScale, null, mouseXY, data, 'index')
			}
			context.save()
			if (indicators) {
				this.drawCalcedData(context, indicators, plotData, valueKeys, toolTipText, item, type, x, y)
			} else {
				this.isInsideChart(mouseMove, containerFrame, chartFrame) && this.drawOriginData(context, props, plotData, item, events, containerFrame, x, y)
			}
			context.restore()
		}
	}
	// 检测鼠标是否在chart内
	isInsideChart = (mouseMove, containerFrame, chartFrame) => {
		let frame = {
			width: containerFrame.chartWidth,
			height: chartFrame.height,
			x: chartFrame.origin[0],
			y: chartFrame.origin[1]
		}, e = {
			clientX: mouseMove.realMouseX - containerFrame.padding.left,
			clientY: mouseMove.mouseY - containerFrame.padding.top
		};
		return isDotInsideChart([e.clientX, e.clientY], frame)
	}
	// 绘制分时和K线图例数据
	drawOriginData = (context, props, plotData, item, events, containerFrame, x, y) => {
		let { formatter } = props
		let { mouseMove } = events
		if (!formatter) return;
		let data = plotData.currentData[item];
		if (!data) return
		if (mouseMove.mouseX > containerFrame.chartWidth / 2) {
			x = xRight
		} else {
			x = xLeft
		}
		let res = formatter.selector(data), name = formatter.name, rectY = y;
		for (let i = 0; i < name.length; i++) {
			let len = context.measureText(`${name[i]}:${res[i]}`).width;
			if (len + xSpace * 3 > boxWidth) {
				boxWidth = len + xSpace * 3
			}
		}
		context.fillStyle = props.bgColor
		context.globalAlpha = props.alpha
		context.lineJoin = "round"
		context.clearRect(x, rectY, boxWidth, ySpace * (name.length + 1))
		context.fillRect(x, rectY, boxWidth, ySpace * (name.length + 1))
		context.font = props.font
		context.globalAlpha = 1
		for (let i = 0; i < name.length; i++) {
			y += ySpace
			if (typeof formatter.stroke === 'string') {
				context.fillStyle = formatter.stroke || defaultTextColor
			} else if (Array.isArray(formatter.stroke)) {
				let textColor = formatter.stroke[i]
				if (textColor instanceof Function) {
					context.fillStyle = formatter.stroke[i](res[i])
				} else if (typeof textColor === 'string') {
					context.fillStyle = formatter.stroke[i] || defaultTextColor
				}
			} else {
				context.fillStyle = defaultTextColor
			}
			context.fillText(`${name[i]}\uFF1A${res[i]}`, x + xSpace, y)
		}
	}
	// 绘制技术指标图例数据
	drawCalcedData = (context, indicators, plotData, valueKeys, toolTipText, item, type, xPos, yPos) => {
		let len = indicators.length, eachKey, text = '';
		for (let i = len - 1; i >= 0; i--) {
			eachKey = indicators[i]
			let data = plotData.calcedData[eachKey.dataKey][plotData.indexs[0] + item]
			// type = 'group' 表示MACD和KDJ、BOLL等复合指标线，type = '' 表示 MA、RSI等单条指标线
			if (type === 'group') {
				let dataKeyArr = Object.keys(eachKey.stroke), len2 = dataKeyArr.length;
				for (let j = len2 - 1; j >= 0; j--) {
					let xCoord = xPos + context.measureText(toolTipText).width
					if (!data || data === '-') {
						text = `${dataKeyArr[j]}\uFF1A-  `
					} else {
						text = `${dataKeyArr[j]}\uFF1A${data[valueKeys[j]] ? data[valueKeys[j]].toFixed(2) : '-'}  `
					}
					context.fillStyle = eachKey.stroke[dataKeyArr[j]]
					context.fillText(text, xCoord, yPos)
					toolTipText += text
				}
			} else if (type === '') {
				let xCoord = xPos + context.measureText(toolTipText).width
				let text = `${eachKey.dataKey}\uFF1A${data && data !== '-' ? data.toFixed(2) : '-'}  `
				context.fillStyle = eachKey.stroke
				context.fillText(text, xCoord, yPos)
				toolTipText += text
			}
		}
	}
	render() {
		return null
	}
}

BaseTooltip.contextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object,
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func
}

export default BaseTooltip