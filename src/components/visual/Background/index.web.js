/**
 * 背景组件:
 * 可接受theme style以及背景text
 */
import React , { Component } from 'react'
import PropTypes from 'prop-types'
import { calcOffset } from '../common/helper'
import { isEqual } from 'lodash/lang'

const themesMap = {
	normal: {
		fillStyle:'',
		strokeStyle:''
	},
	dark:{
		fillStyle:'#3F3F3F',
		strokeStyle:'#FFFFFF'
	}
}

export default class Background extends Component {

	static defaultProps = {
		theme:'normal',
		fillGradient: false,
		fillGradientColors:["#232526","#414345"]
	}

	constructor(props){
		super(props)
	}

	componentDidMount(){
	}

	componentWillReceiveProps(nextProps,nextContext){
		this.draw(nextProps,nextContext)
	}

	draw = (chartProps,chartContext) => {
		let { fillGradient, fillGradientColors } = this.props;
		let { bordered, filled, stroke, fill } = chartProps
		let { context, containerFrame, chartFrame } = chartContext
		let { padding } = containerFrame
		let { origin } = chartFrame

		context.save()
		if(bordered){
			context.strokeStyle = stroke
			context.beginPath()
			let offsets = calcOffset(containerFrame,chartFrame)
			context.moveTo(offsets[0],offsets[1])
			context.lineTo(containerFrame.width-padding.right,offsets[1])
			context.lineTo(containerFrame.width-padding.right,offsets[1]+chartFrame.height)
			context.lineTo(offsets[0],offsets[1]+chartFrame.height)
			context.closePath()
			context.stroke()
		}

		if(filled){
			let offsets = calcOffset(containerFrame,chartFrame)
			if(fillGradient){
				let gradient = context.createLinearGradient(offsets[0],offsets[1],offsets[0],offsets[1]+chartFrame.height);
				gradient.addColorStop(0,fillGradientColors[0]);
				gradient.addColorStop(1,fillGradientColors[1]);
				fill = gradient
			}
			context.fillStyle = fill
			context.beginPath()
			context.moveTo(offsets[0],offsets[1])
			context.lineTo(containerFrame.width-padding.right,offsets[1])
			context.lineTo(containerFrame.width-padding.right,offsets[1]+chartFrame.height)
			context.lineTo(offsets[0],offsets[1]+chartFrame.height)
			context.closePath()
			context.fill()
		}

		context.restore()
	}

	render(){
		return null
	}
}

Background.contextTypes = {
	context: PropTypes.object,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object
}
