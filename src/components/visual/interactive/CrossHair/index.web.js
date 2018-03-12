/**
 * CrossHairCursor组件
 * @author 徐达迟
 * 
 * 十字线以及浮动数值组件
 * 
 * TODO:
 * 1.抽离HLineLabel,vLineLabel
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { getCurrentItem, calcOffset } from '../../common/helper'

export default class CrossHair extends Component {

	static defaultProps = {
		lineDash: [10, 5],
		showHLineLtLabel:false,
		showHLineRtLabel: false,
		showVLineLable: false,
		lastClose: null,
		hLineLtLabel:{
			width:45,
			height:20,
			padding: [5,2]
		},
		hLineRtLabel:{
			width:45,
			height:20,
			padding: [5,2],
		},
		hLineRtLabelInPct: false,
		vLineLabel:{
			width:40,
			height:15,
			padding: [5,10]
		},
		vLineLabelFormat:'MM/DD'
	}

	constructor(props){
		super(props)
	}

	componentWillReceiveProps(nextProps,nextContext){
		this.draw(nextProps,nextContext)
	}

	//绘制十字线
	draw = (props,chartContext) => {
		let { 
			lineDash,
			stroke,
			showHLineLtLabel,
			showHLineRtLabel,
			showVLineLabel
		} = props;
		let { context, events, xScale } = chartContext;
		if(!context|| !xScale || !events.mouseMove.trigger || !events.mouseEnter.trigger) return;
		let ch = this.calcCrossHairCursor(chartContext)

		context.save()
		//设置dash
		if(stroke) context.strokeStyle = stroke
		context.setLineDash(lineDash)
		//绘制横线
		context.beginPath()
		context.moveTo(ch.hLine.begX,ch.hLine.begY)
		context.lineTo(ch.hLine.endX,ch.hLine.endY)
		context.stroke()
		context.closePath()
		//绘制竖线
		context.beginPath()
		context.moveTo(ch.vLine.begX,ch.vLine.begY)
		context.lineTo(ch.vLine.endX,ch.vLine.endY)
		context.stroke()
		context.closePath()
		context.restore()

		//绘制横线左侧label
		if(showHLineLtLabel) this.drawHLineLtLabel(ch,chartContext)
		//绘制横线右侧label
		if(showHLineRtLabel) this.drawHLineRtLabel(ch,chartContext)
		//绘制纵线Label
		if(showVLineLabel) this.drawVLineLabel(ch,chartContext)
		context.fillStyle = '#000'
	}

	//计算十字线坐标
	calcCrossHairCursor = (chartContext) => {
		let { events, containerFrame, chartFrame, xScale, plotData } = chartContext
		let { mouseMove } = events
		let { padding } = containerFrame
		let crossHairObj = {}
		let offsets = calcOffset(containerFrame,chartFrame)
		let currentItemIdx = getCurrentItem(xScale,null,[mouseMove.mouseX-offsets[0]], plotData.currentData,'index')
		let currentItemX = xScale(currentItemIdx) + offsets[0]
		if(!chartFrame){
			//直接置于ChartContainer下的十字线
			let hLineYPos = mouseMove.mouseY
			let vLineXPos = currentItemX
			if(mouseMove.mouseY > (containerFrame.height - padding.bottom)){
				hLineYPos = containerFrame.height - padding.bottom
			} else if(mouseMove.mouseY < padding.top){
				hLineYPos = padding.top
			}
			if(currentItemX > (containerFrame.width - padding.right)){
				vLineXPos = containerFrame.width - padding.right
			} else if(currentItemX < padding.left){
				vLineXPos = padding.left
			}
			crossHairObj = {
				hLine:{
					begX: padding.left,
					begY: hLineYPos,
					endX: containerFrame.width - padding.right,
					endY: hLineYPos
				},
				vLine:{
					begX: vLineXPos,
					begY: padding.top,
					endX: vLineXPos,
					endY: containerFrame.height - padding.bottom
				}
			}
		} else {
			//置于Chart下的十字线
			let { origin, height: chartHeight } = chartFrame
			let hLineYPos = mouseMove.mouseY
			let vLineXPos = currentItemX
			if(mouseMove.mouseY > (padding.top + origin[0] + chartHeight)){
				hLineYPos = padding.top + origin[0] + chartHeight
			} else if(mouseMove.mouseY < (padding.top + origin[0])){
				hLineYPos = (padding.top + origin[0])
			}
			if(currentItemX > (containerFrame.width - padding.right)){
				vLineXPos = containerFrame.width - padding.right
			} else if(currentItemX < padding.left){
				vLineXPos = padding.left
			}
			crossHairObj = {
				hLine:{
					begX: padding.left,
					begY: hLineYPos,
					endX: containerFrame.width - padding.right,
					endY: hLineYPos
				},
				vLine:{
					begX: vLineXPos,
					begY: padding.top + origin[0],
					endX: vLineXPos,
					endY: padding.top + origin[0] + chartHeight
				}
			}
		}
		return crossHairObj
	}

	//绘制十字线横线左侧Label
	drawHLineLtLabel = (ch, chartContext) => {
		let { hLineLtLabel: labelProps } = this.props;
		let { context, yScale, containerFrame, chartFrame } = chartContext
		if(!yScale) return;
		let offsets = calcOffset(containerFrame,chartFrame)
		context.save()
		context.fillStyle='#000'
		context.fillRect(ch.hLine.begX-labelProps.width,ch.hLine.begY-labelProps.height/2,labelProps.width,labelProps.height)
		context.fillStyle='#FFF'
		context.fillText(yScale.invert(ch.hLine.begY-offsets[1]).toFixed(2),ch.hLine.begX-labelProps.width+labelProps.padding[0],ch.hLine.begY+labelProps.padding[1])
		context.restore()
	}

	//绘制十字线横线右侧Label
	drawHLineRtLabel = (ch, chartContext) => {
		let { hLineRtLabel: labelProps, lastClose, hLineRtLabelInPct } = this.props;
		let { context, yScale, containerFrame, chartFrame } = chartContext
		if(!yScale) return;
		let offsets = calcOffset(containerFrame,chartFrame)
		context.save()
		context.fillStyle='#000'
		context.fillRect(ch.hLine.endX,ch.hLine.endY-labelProps.height/2,labelProps.width,labelProps.height)
		context.fillStyle='#FFF'
		let labelText = ''
		if(hLineRtLabelInPct && !isNaN(lastClose)){
			let currValue = yScale.invert(ch.hLine.endY-offsets[1])
			lastClose = +lastClose
			labelText = (100*(currValue - lastClose)/lastClose).toFixed(2) + "%"
		}
		else {
			labelText = yScale.invert(ch.hLine.endY-offsets[1]).toFixed(2)
		}
		context.fillText(labelText,ch.hLine.endX+labelProps.padding[0],ch.hLine.endY+labelProps.padding[1])
		context.restore()
	}

	drawVLineLabel = (ch, chartContext) => {
		let { vLineLabel: labelProps, vLineLabelFormat: format} = this.props;
		let { context, xScale, containerFrame, chartFrame, plotData } = chartContext;
		if(!xScale) return;
		let offsets = calcOffset(containerFrame,chartFrame)
		context.save()
		context.fillStyle='#000'
		context.fillRect(ch.vLine.begX-labelProps.width/2,ch.vLine.endY,labelProps.width,labelProps.height)
		context.fillStyle='#FFF'
		let data = plotData.fullData
		let item = getCurrentItem(xScale, null, [ch.vLine.begX-offsets[0]], data, 'index')
		let labelText = moment(plotData.currentData[item][0]).format(format)
		context.fillText(labelText,ch.vLine.begX-labelProps.width/2+labelProps.padding[0],ch.vLine.endY+labelProps.padding[1])
		context.restore()
	}

	render(){
		return null;
	}
}

CrossHair.contextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object,
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func
}