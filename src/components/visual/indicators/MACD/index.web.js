import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { calcOffset, calcBarWidth } from '../../../common/helper'

let valueKeys = {
	MACD: 'histogram',
	DIFF: 'MACD',
	DEA: 'signal'
};
const defaultColor = 'skyblue'

export default class MACD extends Component {
	static defaultProps = {
		barWidth: 8,
		lineWidth: 1,
		strokeStyle: '#3E3E3E',
	}
	constructor(props) {
		super(props)
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if(!nextContext.plotData.calcedData) return
		this.drawLine(nextProps, nextContext, 'DIFF')
		this.drawLine(nextProps, nextContext, 'DEA')
		this.drawHistogram(nextProps, nextContext)
		this.drawBackgroundLine(nextProps, nextContext)
	}
	drawBackgroundLine = (nextProps, nextContext) => {
		let { context, xScale, yScale, containerFrame, chartFrame } = nextContext
		let offsets = calcOffset(containerFrame, chartFrame)
		let xPos = chartFrame.origin[0] + offsets[0],
			yPos = yScale(0) + offsets[1]
		context.save()
		context.beginPath()
		context.strokeStyle = defaultColor
		context.lineWidth = 1
		context.moveTo(xPos, yPos)
		context.lineTo(containerFrame.chartWidth + containerFrame.padding.left, yPos)
		context.stroke()
		context.closePath()
		context.restore()
	}
	// 绘制直方图
	drawHistogram = (nextProps, nextContext) => {
		let { context, plotData, containerFrame, chartFrame, xScale, yScale } = nextContext;
		let data = [], originData = nextContext.plotData.calcedData.MACD;
		data = plotData.dateTime.map((dt, idx) => {
			return [dt].concat(originData[idx].histogram)
		})
		data = data.slice(plotData.indexs[0], plotData.indexs[1])
		//绘制K线
		for (let i = 0; i < data.length; i++) {
			this.drawEachHistogram(data[i], nextProps, nextContext, i, data.length - 1)
		}
	}
	drawEachHistogram = (data, nextProps, nextContext, idx, lastIdx) => {
		if(data[1] === undefined) return;
		let { barWidth } = nextProps
		let { context, xScale, yScale, containerFrame, chartFrame } = nextContext
		barWidth = calcBarWidth(nextProps, nextContext) || barWidth
		let xPos = xScale(idx), yPos = yScale(data[1]), offsets = calcOffset(containerFrame, chartFrame),
			baseY = yScale(0), yCoord = data[1] > 0 ? offsets[1] + yPos : offsets[1] + baseY,
			height = Math.abs(yPos - baseY);
		context.save()
		context.beginPath()
		context.fillStyle = data[1] > 0 ? (nextProps.stroke['Raise'] || defaultColor) : (nextProps.stroke['Fall'] || defaultColor)
		if(idx === 0) {
			context.rect(offsets[0] + xPos, yCoord, barWidth / 4, height)
		} else if(idx === lastIdx) {
			context.rect(offsets[0] + xPos - barWidth / 4, yCoord, barWidth / 4, height)
		} else {
			context.rect(offsets[0] + xPos - barWidth / 4, yCoord, barWidth / 2, height)
		}
		context.fill()
		context.closePath()
		context.restore()
	}
	drawLine = (nextProps, nextContext, dataKey) => {
		let { context, plotData, containerFrame, chartFrame, xScale, yScale } = nextContext;
		let data = [], originData = nextContext.plotData.calcedData.MACD;
		data = plotData.dateTime.map((dt, idx) => {
			return [dt].concat(originData[idx][valueKeys[dataKey]])
		})
		data = data.slice(plotData.indexs[0], plotData.indexs[1])
		if (data.length > 0) {
			context.save()
			context.beginPath()
			context.strokeStyle = nextProps.stroke[dataKey] || 'skyblue'
			context.lineCap = "round"
			let begPoint = this.calcPointPos(data[0], xScale, yScale, containerFrame, chartFrame, 0)
			context.moveTo(begPoint[0], begPoint[1])
			for (let i = 1; i < data.length - 1; i++) {
				//使用平滑曲线绘制
				let point1 = this.calcPointPos(data[i], xScale, yScale, containerFrame, chartFrame, i)
				let point2 = this.calcPointPos(data[i + 1], xScale, yScale, containerFrame, chartFrame, i + 1)
				let midPointX = (point1[0] + point2[0]) / 2;
				let midPointY = (point1[1] + point2[1]) / 2;
				context.quadraticCurveTo(point1[0], point1[1], midPointX, midPointY)
			}
			context.stroke()
			context.closePath()
			context.restore()
		}
	}
	calcPointPos = (point, xScale, yScale, containerFrame, chartFrame, index) => {
		if (point && typeof xScale === 'function' && typeof yScale === 'function') {
			if (point[1] === '-') return [undefined, undefined];
			let offsets = calcOffset(containerFrame, chartFrame)
			//使用当前数据的index计算x轴位置
			let x = xScale(index) + offsets[0]
			let y = yScale(point[1]) + offsets[1]
			let pointLoc = [x, y]
			return this.isOverBoundary(pointLoc, containerFrame, chartFrame)
		} else {
			return [undefined, undefined]
		}
	}
	//监测绘制点坐标是否越界
	isOverBoundary(point, containerFrame, chartFrame) {
		return point;
	}
	render() {
		return null
	}
}

MACD.contextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	plotConfig: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object
}