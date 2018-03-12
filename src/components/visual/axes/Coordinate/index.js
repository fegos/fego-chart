/**
 * 坐标组件
 * 
 * @author eric
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'

import moment from 'moment-timezone'
import { getTimestamp } from '../../../../util'
import { transpose } from 'd3-array';

const { Path, Shape, Group, Text } = ART;

export default class Coordinate extends Component {
	static defaultProps = {
		isTimestamp: true,
		dateFormat: 'MM-DD HH:mm',
		timezone: 'Asia/Shanghai',
		fontFamily: 'Helvetica',
		fontWeight: 'normal',
		fontSize: 9,
		color: '#8F8F8F',
		riseColor: '#F05B48',
		fallColor: '#10BC90',
		centerTickOffset: 10,
	}

	static propTypes = {
		// top|bottom|left|right
		position: PropTypes.string.isRequired,
		// 是否是时间戳
		isTimestamp: PropTypes.bool,
		// 日期格式
		dateFormat: PropTypes.string,
		// 时区
		timezone: PropTypes.string,
		// 字体大小
		fontSize: PropTypes.number,
		// 字体集
		fontFamily: PropTypes.string,
		// 字重
		fontWeight: PropTypes.string,
		// 字体颜色
		color: PropTypes.string,
		// 上涨字体颜色
		riseColor: PropTypes.string,
		// 下跌字体颜色
		fallColor: PropTypes.string,
		// 五日图横坐标offset
		centerTickOffset: PropTypes.number,
	}

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		let shouldUpdate = false;
		if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
			shouldUpdate = true;
		} else if (this.props.position === 'left' ||
			this.props.position === 'right') {
			if (this.context.yScale !== nextContext.yScale ||
				JSON.stringify(this.context.yTicks) !== JSON.stringify(nextContext.yTicks) ||
				JSON.stringify(this.context.frame) !== JSON.stringify(nextContext.frame)) {
				shouldUpdate = true;
			}
		} else if (this.props.position === 'top' ||
			this.props.position === 'bottom') {
			if (this.context.xScale !== nextContext.xScale ||
				JSON.stringify(this.context.data) !== JSON.stringify(nextContext.data) ||
				JSON.stringify(this.context.frame) !== JSON.stringify(nextContext.frame) ||
				JSON.stringify(this.context.domain) !== JSON.stringify(nextContext.domain) ||
				JSON.stringify(this.context.xTicks) !== JSON.stringify(nextContext.xTicks)) {
				shouldUpdate = true;
			}
		}
		return shouldUpdate;
	}

	_updateTicksInfo = (props, context) => {
		let { position, lastClose, tickPos, isTimestamp, dateFormat, timezone, color, riseColor, fallColor, fontFamily, fontWeight, fontSize } = props;
		let { data, domain, xScale, yScale, frame, xTicks, yTicks, xDateTicks, offset } = context;
		let font = { fontFamily, fontWeight, fontSize };
		let ticks = null;
		if (position === 'left' || position === 'right') {
			if (yScale && yTicks && frame && frame.height && frame.width) {
				let yTicksCount = yTicks.length;
				if (yTicksCount) {
					ticks = yTicks.map((tick, i) => {
						let y = yScale(tick) - 5;
						if (i === 0) {
							y = yScale(tick) - 20;
						} else if (i === yTicksCount - 1) {
							y = yScale(tick) + 10;
						}
						let x = 5;
						if (position === 'right') {
							x = frame.width - 35;
						}
						let tickTextColor = color;
						if (lastClose && !isNaN(+lastClose)) {
							if (+tick < +lastClose) tickTextColor = fallColor;
							if (+tick > +lastClose) tickTextColor = riseColor;
							if (position === 'right') {
								tick = (tick - lastClose) / lastClose * 100;
								tick = tick.toFixed(2) + '%';
							} else {
								tick = tick.toFixed(2);
							}
						} else {
							tick = tick.toFixed(2);
						}
						return (
							<Text key={i} fill={tickTextColor} font={font} x={x} y={y} >{tick}</Text>
						)
					})

				}
			}
		} else if (position === 'top' || position === 'bottom') {
			if (xScale && xTicks && xTicks.length && data && data.length && domain && frame && frame.width) {
				let { start, end } = domain;
				if (xDateTicks && xDateTicks.length) {
					ticks = xTicks.map((tick, i) => {
						let centerX = xScale(tick);
						let text = xDateTicks[i];
						let x, y;
						if (tickPos && tickPos === 'center') x = centerX + offset - this.props.centerTickOffset
						else x = centerX - 10 + offset;
						y = 5;
						if (x < 10) {
							x = 10
						}
						if (tickPos !== 'center' && i === xTicks.length - 1) {
							x = centerX - 30;
						}
						if (position === 'bottom') {
							y = frame.height + 10;
						}
						return (
							<Text key={i} fill={color} font={font} x={x} y={y} >{text}</Text>
						)
					})
				} else {
					let actualData = data.slice(start, end);
					if (actualData) {
						ticks = xTicks.map((tick, i) => {
							let centerX = xScale(tick);
							if (actualData[tick]) {
								let text = actualData[tick][0];
								if (isTimestamp) {
									text = moment.tz(text, timezone).format(dateFormat);
								} else {
									let timestamp = getTimestamp(text, timezone);
									text = moment.tz(timestamp, timezone).format(dateFormat);
								}
								let x = centerX - 25 + offset;
								let y = 5;
								if (position === 'bottom') {
									y = frame.height + 10;
								}
								return (
									<Text key={i} fill={color} font={font} x={x} y={y} >{text}</Text>
								)
							}
						})
					}
				}
			}
		}
		return ticks;
	}

	render() {
		let ticks = this._updateTicksInfo(this.props, this.context);
		return (
			<Group>
				{ticks}
			</Group>
		)
	}
}

Coordinate.contextTypes = {
	data: PropTypes.array,
	domain: PropTypes.object,
	frame: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	xTicks: PropTypes.array,
	yTicks: PropTypes.array,
	xDateTicks: PropTypes.array,
	offset: PropTypes.number,
}
