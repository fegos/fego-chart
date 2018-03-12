/**
 * Chart组件，为独立绘图元素（如Axis,Series)的容器
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getChartFrame } from '../common/helper'
import { calculateYScale } from '../../scale'
import flattendeep from 'lodash.flattendeep'
import CalculateUtil from '../CalculateUtil'

export default class Chart extends Component {
	static propTypes = {
		plotData: PropTypes.object,
		frame: PropTypes.object,
		containerFrame: PropTypes.object,
		yExtents: PropTypes.array,
	}

	static defaultProps = {
		//yScale留出多余空间 
		yAxisMargin: [0.90, 1.10]
	}

	constructor(props) {
		super(props)
		this.state = {
			yScale: null
		}
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps, nextContext) {
		let { frame } = nextProps
		let { plotData } = nextContext
		this.updateYScale(plotData, frame.height, nextProps)
	}

	getChildContext() {
		return {
			chartFrame: this.props.frame,
			yScale: this.state.yScale
		}
	}

	updateYScale = (plotData, height, nextProps) => {
		if (plotData.currentData && height) {
			let data = this.getYScale(plotData, nextProps);
			this.setState({
				yScale: calculateYScale(data, { chartHeight: this.props.frame.height })
			})
		}
	}

	calcluateValues = (func) => {
		return (d) => {
			let obj = typeof func === 'function' ? func(d) : func;
			return (typeof obj === 'object' && !Array.isArray(obj)) ? Object.keys(obj).map(key => obj[key]) : obj
		}
	}

	getYScale = (plotData, nextProps) => {
		let { yExtents, yAxisMargin, indicators } = nextProps
		let yValues = [], max = Number.MIN_VALUE, min = Number.MAX_VALUE, _max, _min;
		if (yExtents && Array.isArray(yExtents)) {
			let fullDataYExtents = [], indicatorsYExtents = [];
			yExtents.map(eachExtent => {
				if (typeof eachExtent === 'function') {
					fullDataYExtents.push(eachExtent)
				} else if (typeof eachExtent === 'string') {
					indicatorsYExtents.push(eachExtent)
				}
			})
			yValues = fullDataYExtents.map(eachExtent => plotData.currentData.map(this.calcluateValues(eachExtent)))
			yValues = flattendeep(yValues)
			indicatorsYExtents.map(eachIndicator => {
				let calcedValues = [];
				calcedValues = Array.from(plotData.calcedData[eachIndicator]).slice(plotData.indexs[0], plotData.indexs[1])
				if (eachIndicator === 'MACD') {
					let arr = []
					calcedValues.map(data => {
						arr.push(data.MACD ? data.MACD : '-')
						arr.push(data.signal ? data.signal : '-')
						arr.push(data.histogram ? data.histogram : '-')
					})
					calcedValues = arr
				}
				let arr = calcedValues.filter(data => {
					return data !== '-'
				})
				yValues = yValues.concat(arr)
			})
			let allValues = flattendeep(yValues)
			allValues.map(value => {
				if (value > max) {
					max = value
				}
				if (value < min) {
					min = value
				}
			})
			if (min < 0 && Math.abs(max) > Math.abs(min)) {
				min = -Math.abs(max)
			}
			_max = max * yAxisMargin[1]
			_min = min > 0 ? min * yAxisMargin[0] : min * yAxisMargin[1]
			return [_max, _min]
		}
	}

	render() {
		let { children } = this.props;
		let { yScale } = this.state;
		return (
			<div>
				{children}
			</div>
		)
	}
}

Chart.contextTypes = {
	containerFrame: PropTypes.object,
	plotData: PropTypes.object
}

Chart.childContextTypes = {
	chartFrame: PropTypes.object,
	yScale: PropTypes.func
}