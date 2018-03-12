/**
 * 抽象Axis类和helper函数
 * 
 * TODO:
 * 通过scale生成ticks
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ART, StyleSheet } from 'react-native'
import moment from 'moment-timezone'

const { Path, Shape, Group, Text } = ART;


export default class BaseAxis extends Component {
	static defaultProps = {
		showGridLine: false,
		showTicks: false,
	}

	static propTypes = {
		// top|bottom|left|right
		position: PropTypes.string.isRequired,
		// 宽度 
		lineWidth: PropTypes.number.isRequired,
		// 是否显示网格
		showGridLine: PropTypes.bool.isRequired,
		// type: XAxix|YAxis
		type: PropTypes.string.isRequired,
	}

	constructor(props) {
		super(props)

	}

	_caculateGridPath = () => {
		let { type } = this.props;
		let { xTicks, yTicks, frame, xScale, yScale } = this.context;
		let path = Path();
		if (frame) {
			if (type === 'XAxis' && xTicks && xScale) {
				let ticksCount = xTicks.length;
				for (let index = 0; index < ticksCount; index++) {
					let tickIndex = xTicks[index];
					let x = xScale(tickIndex);
					path.moveTo(x, 0);
					path.lineTo(x, frame.height);
				}
			} else if (type === 'YAxis' && yTicks && yScale) {
				let ticksCount = yTicks.length;
				for (let index = 1; index < ticksCount - 1; index++) {
					let tickIndex = yTicks[index];
					let y = yScale(tickIndex);
					if (y) {
						path.moveTo(0, y);
						path.lineTo(frame.width, y);
					}
				}
			}
		}
		return path;
	}

	render() {
		return (
			<Group>
				{this._renderGridLines()}
				{this._renderTicks()}
			</Group>
		)
	}

	_renderGridLines = () => {
		let { showGridLine, stroke, strokeWidth, strokeDash } = this.props;
		if (showGridLine) {
			let path = this._caculateGridPath();
			if (path) {
				let gridLines = (
					<Shape d={path} stroke={stroke} strokeDash={strokeDash} strokeWidth={strokeWidth} />
				)
				return gridLines;
			} else {
				return null;
			}

		} else {
			return null;
		}
	}

	_renderTicks = () => {
		let { type, position, showTicks } = this.props;
		let { xScale, data, domain, frame, xTicks, yTicks, yScale, chartType, xDateTicks } = this.context;
		let { start, end } = domain;
		if (showTicks) {
			if (type === 'XAxis') {
				if (xTicks.length && data && data.length) {
					let ticks = [];
					if (chartType === 'timeline') {
						ticks = xTicks.map((tick, i) => {
							let centerX = xScale(tick);
							let text = xDateTicks[i];
							let x = centerX - 15;
							let y = 5;
							if (x < 10) {
								x = 10
							}
							if (i === xTicks.length - 1) {
								x = centerX - 40;
							}
							if (position === 'bottom') {
								y = frame.height + 5;
							}
							return (
								<Text key={i} fill="gray" font="bold 12px Heiti SC" x={x} y={y} >{text}</Text>
							)
						})
					} else {
						let actualData = data.slice(start, end);
						ticks = xTicks.map((tick, i) => {
							let centerX = xScale(tick);
							let text = actualData[tick][0];
							let x = centerX - 25;
							let y = 5;
							if (position === 'bottom') {
								y = frame.height + 5;
							}
							return (
								<Text key={i} fill="gray" font="bold 12px Heiti SC" x={x} y={y} >{moment.tz(text, 'Asia/Shanghai').format('MM-DD HH:mm')}</Text>
							)
						})
					}
					return ticks;
				} else {
					return null;
				}
			} else if (type === 'YAxis') {
				let yTicksCount = yTicks.length;
				if (yTicksCount) {
					let ticks = yTicks.map((tick, i) => {
						let centerY = yScale(tick) - 7;
						if (i === 0) {
							centerY = yScale(tick) - 20;
						} else if (i === yTicksCount - 1) {
							centerY = yScale(tick) + 5;
						}
						let x = 15;
						if (position === 'right') {
							x = frame.width - 55;
						}
						return (
							<Text key={i} fill="gray" font="bold 12px Heiti SC" x={x} y={centerY} >{tick.toFixed(2)}</Text>
						)
					})
					return ticks;
				} else {
					return null;
				}
			}
		} else {
			return null;
		}
	}
}

BaseAxis.contextTypes = {
	data: PropTypes.array,
	domain: PropTypes.object,
	frame: PropTypes.object,
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	xTicks: PropTypes.array,
	yTicks: PropTypes.array,
	xDateTicks: PropTypes.array,
	chartType: PropTypes.string,
}
