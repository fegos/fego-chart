import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { calcOffset } from '../../common/helper'

class LineSeries extends Component {

	static defaultProps = {
		strokeStyle: 'skyblue',
		fillStyle: 'rgba(207,242,253,0.5)',
		filled: false
	}

	constructor(props){
		super(props)
		this.state = {}
	}

	componentWillReceiveProps(nextProps,nextContext){
		this.draw(nextProps,nextContext)
	}

	draw(nextProps,nextContext){
		let { filled } = this.props;
		let { context, plotData, containerFrame, chartFrame, xScale, yScale } = nextContext;
		let data = []
		let firstPointX;

		//有dataKey为指标，否则使用yAccessor
		if(nextProps.dataKey && plotData.dateTime){
			for(let i = 0; i < plotData.dateTime.length; i++){
				data.push([plotData.dateTime[i],plotData.calcedData[nextProps.dataKey][i]])
			}
			data = data.slice(plotData.indexs[0],plotData.indexs[1])
		} else if(nextProps.yAccessor) {
			if(!plotData.dateTime) return;
			data = plotData.dateTime.map((dt,idx) => {
				return [dt].concat(nextProps.yAccessor(plotData.fullData[idx]))
			})
			data = data.slice(plotData.indexs[0],plotData.indexs[1])
		}
		if(data.length > 0){
			context.save()
			context.strokeStyle = nextProps.stroke || 'skyblue'
			context.fillStyle = nextProps.fillStyle || 'skyblue'
			context.beginPath()
			context.lineCap = "round"
			let begPoint = this.calcPointPos(data[0],xScale,yScale,containerFrame,chartFrame,0)
			let firstDrawPoint = begPoint[0] ? begPoint : null
			//todo, fill覆盖到最后一个点
			let lastDrawPoint = null
			context.moveTo(begPoint[0],begPoint[1])
			for(let i = 1; i < data.length - 1; i++){
				//使用平滑曲线绘制
				let point1 = this.calcPointPos(data[i],xScale,yScale,containerFrame,chartFrame,i)
				let point2 = this.calcPointPos(data[i+1],xScale,yScale,containerFrame,chartFrame,i+1)
				//锁定第一个和最后一个绘制点用来进行fill
				if(!firstDrawPoint || (firstDrawPoint && !firstDrawPoint[0])) firstDrawPoint = point1;
				if(point2[0]) lastDrawPoint = point2;
				//最后一个point
				if(i === data.length - 2){
					context.lineTo(point2[0],point2[1])
				} else {
					let midPointX = (point1[0] + point2[0]) / 2;
					let midPointY = (point1[1] + point2[1]) / 2;
					context.quadraticCurveTo(point1[0],point1[1],midPointX,midPointY)
				}
			}
			context.stroke()
			if(filled){
				let offsets = calcOffset(containerFrame,chartFrame)
				context.lineTo(lastDrawPoint[0],offsets[1]+chartFrame.height)
				context.lineTo(firstDrawPoint[0],offsets[1]+chartFrame.height)
				context.closePath()
				context.fill()
			} else {
				context.closePath()
			}
			context.restore()
		}
	}

	calcPointPos = (point, xScale, yScale, containerFrame, chartFrame, index) => {
		if(point && typeof xScale === 'function' && typeof yScale === 'function'){
			if(point[1] === '-') return [undefined,undefined];
			let offsets = calcOffset(containerFrame,chartFrame)
			//使用当前数据的index计算x轴位置
			let x = xScale(index) + offsets[0]
			let y = yScale(point[1]) + offsets[1]
			let pointLoc = [x,y]
			return pointLoc
		} else {
			return [undefined,undefined]
		}
	}

	//监测绘制点坐标是否越界
	isOverBoundary(point,containerFrame,chartFrame){
		// let { padding } = containerFrame
		// let { origin } = chartFrame
		// let leftBorder = padding.left + origin[0]
		// let rightBorder = containerFrame.width - padding.right
		// let topBorder = padding.top + origin[1]
		// let bottomBorder = Math.min(padding.top + chartFrame.height, containerFrame.height - padding.bottom)
		// if(point[0] < leftBorder || point[1] > rightBorder) return [undefined,undefined];
		// if(point[1] < topBorder || point[1] > bottomBorder) return [undefined,undefined];
		return point;
	}

	render(){
		return null;
	}
}

LineSeries.contextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object,
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func
}

export default LineSeries