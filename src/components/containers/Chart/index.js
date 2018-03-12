/**
 * Chart组件
 * 
 * @author eric
 */

"use strict";

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ART } from 'react-native'
import { calculateYScale } from '../../../scale'
import { extent } from 'd3-array'
import { getCurrentItem, CalculateUtil } from '../../../util'
import flattendeep from 'lodash.flattendeep'

const { Surface, Group, Shape } = ART;


export default class Chart extends Component {
	static defaultProps = {
		insetBottom: 0,
		yAxisMargin: 0,
		yGridLineNum: 4,
	}

	static propsType = {
		// Chart中包含的指标Keys
		indicators: PropTypes.array,
		// 数据选择器
		yExtents: PropTypes.array,
		// 底部缩进距离
		insetBottom: PropTypes.number,
		// Y轴极值距边界的距离
		yAxisMargin: PropTypes.number,
		// Y轴网格线的数量
		yGridLineNum: PropTypes.number,
	}

	constructor(props) {
		super(props);
		this._frame = { x: 0, y: 0, width: 0, height: 0 };
		this._max;
		this._min;
		this.state = {
			yScale: null,
			yTicks: [],
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextContext) {
			let { data, indicatorData, domain, events, xScale, pressHandler } = nextContext;
			let { yAxisMargin, chartKey } = nextProps;
			this._updateYScale(nextContext, nextProps);
			let { longPressEvent, pressEvent } = events
			if (longPressEvent && data && domain) {
				let actualData = data.slice(domain.start, domain.end + 1);
				let currentItemIdx = getCurrentItem(xScale, null, [longPressEvent.x, longPressEvent.y], actualData, 'index')
				let currentItem = {
					x: xScale(currentItemIdx)
				}
				this.setState({
					currentItem
				})
			}
			if (pressEvent) {
				let { x, y, height, width } = this._frame;
				if (pressEvent.x > x && pressEvent.x < x + width &&
					pressEvent.y > y && pressEvent.y < y + height) {
					pressHandler && pressHandler(pressEvent, chartKey);
				}
			}
		}
	}

	getChildContext() {
		return {
			frame: this._frame,
			yScale: this.state.yScale,
			yTicks: this.state.yTicks,
			currentItem: this.state.currentItem,
		}
	}

	_updateFrame = (e) => {
		let { insetBottom, yAxisMargin } = this.props;
		let { x, y, width, height } = e.nativeEvent.layout;
		this._frame = { x: x, y: y, width: width, height: height - insetBottom }
		this._updateYScale(this.context, this.props);
	}

	_updateYScale = (context, props) => {
		let { data, indicatorData, domain } = context;
		let { yGridLineNum, yAxisMargin, chartKey } = props;
		if (data && data.length && domain && this._frame && this._frame.height) {
			this._updateLimitValue(context, props);
			let min = this._min;
			let max = this._max;
			let gap = max - min;
			max = max + yAxisMargin / (this._frame.height - 2 * yAxisMargin) * gap;
			min = min - yAxisMargin / (this._frame.height - 2 * yAxisMargin) * gap;
			gap = max - min;
			let item = gap / yGridLineNum;
			let yTicks = [];
			for (let index = 0; index < yGridLineNum + 1; index++) {
				if (chartKey === 'tech' && yGridLineNum === 2 && index === 1) {
					continue;
				}
				yTicks.push(min + index * item);
			}
			let limitData = [min, max];
			this.setState({
				yScale: calculateYScale(limitData, { chartHeight: this._frame.height }),
				yTicks: yTicks,
			})
		}
	}

	calculateValues = (func, domain) => {
		return (d) => {
			let obj = typeof func === 'function' ? func(d) : func;
			let dataArray = (typeof obj === 'object' && !Array.isArray(obj)) ? Object.keys(obj).map(key => obj[key]) : obj
			return dataArray;
		}
	}

	_updateLimitValue = (context, props) => {
		let { data, indicatorData, domain } = context;
		if (data === undefined || domain === undefined) {
			return;
		}
		let { chartType, preClosedPrice } = this.context;
		let { yExtents, indicators } = props;
		let { start, end } = domain;
		let yValues = [];
		let max = Number.MIN_VALUE;
		let min = Number.MAX_VALUE;
		let index = 0;
		let screenData;
		if (chartType === 'timeline' || chartType === 'fiveday') {
			screenData = data;
		} else {
			screenData = data.slice(start, end + 1);
		}
		if (Array.isArray(yExtents) && yExtents.length) {
			yValues = yExtents.map(extent => screenData.map(this.calculateValues(extent)))
		}
		if (Array.isArray(indicators) && indicatorData) {
			yValues = yValues.concat(indicators.map(dataKey => {
				let indicatorDataElem = indicatorData[dataKey];
				if (indicatorDataElem) {
					let screenIndicatorData = indicatorDataElem.slice(start, end + 1);
					screenIndicatorData = CalculateUtil.enumerateIndicator(screenIndicatorData);
					return screenIndicatorData;
				}
			}));

		}
		let allValues = flattendeep(yValues);
		let filteredValues = allValues.filter(
			value => {
				if (value !== '-') {
					return value;
				}
			}
		)
		filteredValues.map(value => {
			if (value > max) {
				max = value;
			}
			if (value < min) {
				min = value;
			}
		})

		if (chartType === 'timeline' || chartType === 'fiveday') {
			let gapValue = Math.max(Math.abs(max - preClosedPrice), Math.abs(min - preClosedPrice));
			max = preClosedPrice + gapValue;
			min = preClosedPrice - gapValue;
		}

		if (max === Number.MIN_VALUE &&
			min === Number.MAX_VALUE) {
			max = min = 0;
		}

		let gap = 0
		if (max - min < 0.01) {
			gap = 0.02;
		}

		this._max = max + gap;
		this._min = min - gap;
	}

	render() {
		let { width, height } = this._frame;
		let { children } = this.props;
		return (
			<View
				style={this.props.style}
				onLayout={(e) => {
					this._updateFrame(e)
				}}>
				<Surface width={width} height={height + this.props.insetBottom} style={{ position: 'relative' }}>
					<Group>
						{children}
					</Group>
				</Surface>
			</View>
		)
	}
}

Chart.contextTypes = {
	data: PropTypes.array,
	chartType: PropTypes.string,
	preClosedPrice: PropTypes.number,
	indicatorData: PropTypes.object,
	domain: PropTypes.object,
	events: PropTypes.object,
	xTicks: PropTypes.array,
	xScale: PropTypes.func,
	pressHandler: PropTypes.func,
}

Chart.childContextTypes = {
	frame: PropTypes.object,
	yScale: PropTypes.func,
	yTicks: PropTypes.array,
	currentItem: PropTypes.object,
}



