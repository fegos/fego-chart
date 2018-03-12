/**
 * 十字线组件
 * @author: Xu Dachi
 * 
 * props:
 * + lastClose, 用于判断hLine label的字体颜色，高于这个价格显示红色，反之为绿色
 * + showHLineLabel: 用于控制是否显示横线Label
 * + showVLineLabel: 用语控制是否显示纵线Label
 * 
 * 
 * TODO:
 * 1.重构各类参数
 * 2.双重y轴的处理
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ART, StyleSheet } from 'react-native'
const { Path, Shape, Group, Text } = ART;
import { getCurrentItem } from '../../../../util'
import { isDotInsideChart } from '../../../../util/helper'

import moment from 'moment-timezone'
import { getTimestamp } from '../../../../util'
import { transpose } from 'd3-array';

const CONSTANTS = {
	LABEL_FONT: '10px "Helvetica Neue"',
	LABEL_FONT_COLOR: '#FFF',
	LABEL_FONT_UP_COLOR: '#F45642',
	LABEL_FONT_DN_COLOR: '#42F486',
	LEFT_PADDING: 5,
	RIGHT_PADDING: 45,
	TOP_PADDING: 15,
	BOTTOM_PADDING: 15,
	HLINE_LABEL_WIDTH: 20,
	HLINE_LABEL_HEIGHT: 20,
	HLINE_TEXT_YOFFSET: 6.5,
	VLINE_LABEL_WIDTH: 42,
	VLINE_LABEL_HEIGHT: 18,
	LABEL_FILL: '#31323A',
	LABEL_STROKE: '#78797E',
}

export default class CrossHair extends Component {
	static defaultProps = {
		lastClose: NaN,
		showVLineLabel: false,
		showHLineLabel: false,
		showHLineSubLabel: false,
		isTimestamp: true,
		dateFormat: 'HH:mm',
		timezone: 'Asia/Shanghai'
	}

	constructor(props) {
		super(props)
		this.state = {
			path: null,
			vLineLabel: {},
			vLineLabelBackground: {},
			hLineLabel: {},
			hLineLabelBackground: {},
			hLineSubLabel: {},
			hLineSubLabelBackground: {}
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextContext) {
			let shouldUpdate = false;
			if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
				shouldUpdate = true;
			}
			let { events: preEvents, xScale: preXScale, yScale: preYScale, currentItem: preCurrentItem, domain: preDomain } = this.context;

			let { events, xScale, yScale, currentItem, domain, data, frame } = nextContext;

			if (preEvents.longPressEvent && !events.longPressEvent) {
				shouldUpdate = true;
			}
			if (!preCurrentItem && currentItem || preCurrentItem && !currentItem) {
				shouldUpdate = true;
			}
			if (events.longPressEvent) {
				if (currentItem && preCurrentItem && currentItem.x !== preCurrentItem.x) {
					shouldUpdate = true;
				}
				if (xScale !== preXScale) {
					shouldUpdate = true;
				}
				if (yScale !== preYScale) {
					shouldUpdate = true;
				}
				if (JSON.stringify(domain) !== JSON.stringify(preDomain)) {
					shouldUpdate = true;
				}
			}
			if (shouldUpdate) {
				if (events) {
					let { longPressEvent } = events
					if (longPressEvent) {
						this.drawCrossHairCursor([currentItem.x, longPressEvent.y], xScale, yScale, data, domain, frame)
					} else {
						this.setState({
							path: null,
							vLineLabel: null,
							vLineLabelBackground: null,
							hLineLabel: null,
							hLineLabelBackground: null,
							hLineSubLabel: null,
							hLineSubLabelBackground: null
						})
					}
				}
			}
		}
	}

	//目前缺乏足够精准测算字体宽度的API,暂时使用枚举来计算Label长度
	calcVLineLabelWidth = (text) => {
		let length = text.length
		let labelWidth, offset;
		switch (length) {
			case 5:
				labelWidth = length * 7
				offset = 6.5
				break;
			case 10:
				labelWidth = length * 6.2;
				offset = 12
				break;
			case 11:
				labelWidth = length * 5.9;
				offset = 15
				break;
			default:
				labelWidth = length * 7;
				offset = 10;
				break;
		}
		return {
			labelWidth,
			offset
		}
	}

	drawCrossHairCursor = (loc, xScale, yScale, data, domain, frame) => {
		if (frame && data && domain) {
			let { showVLineLabel, showHLineLabel, showHLineSubLabel, lastClose, isTimestamp, timezone, dateFormat } = this.props;
			let { x, y, width, height } = frame;
			let crossHairState = {}
			let hLineLabelBackground = {}, hLineSubLabelBackground = {}

			//绘制十字线
			let path = ART.Path();
			let shouldDrawHLine = isDotInsideChart(loc, frame);
			//绘制横线
			if (shouldDrawHLine) {
				let xLineYCoordinate = loc[1];
				if (loc[1] < y) xLineYCoordinate = y
				if (loc[1] > (y + height)) xLineYCoordinate = y + height
				xLineYCoordinate = xLineYCoordinate - y
				xLineYCoordinate = Math.max(xLineYCoordinate, CONSTANTS.TOP_PADDING)
				xLineYCoordinate = Math.min(xLineYCoordinate, height - CONSTANTS.BOTTOM_PADDING)
				path.moveTo(x, xLineYCoordinate)
				path.lineTo(x + width, xLineYCoordinate)
			}
			//绘制纵线
			let yLineXCoordinate = loc[0]
			if (loc[0] < x) yLineXCoordinate = x
			if (loc[0] > (x + width)) yLineXCoordinate = x + width
			path.moveTo(yLineXCoordinate, 0)
			path.lineTo(yLineXCoordinate, height)
			crossHairState.path = path

			//绘制Labels
			//绘制横线Label
			if (showHLineLabel) {
				if (shouldDrawHLine) {
					let vLineLabelY = loc[1] - y
					vLineLabelY = Math.max(vLineLabelY, CONSTANTS.TOP_PADDING)
					vLineLabelY = Math.min(vLineLabelY, height - CONSTANTS.BOTTOM_PADDING)
					let vLineTextColor = CONSTANTS.LABEL_FONT_COLOR
					let currValue = +yScale.invert(vLineLabelY).toFixed(2)
					//text
					if (!isNaN(+lastClose)) {
						lastClose = +lastClose
						if (currValue > lastClose) vLineTextColor = CONSTANTS.LABEL_FONT_UP_COLOR
						if (currValue < lastClose) vLineTextColor = CONSTANTS.LABEL_FONT_DN_COLOR
					}
					let hLineLabel = {
						x: frame.x + 2,
						y: vLineLabelY - CONSTANTS.HLINE_TEXT_YOFFSET,
						text: currValue.toFixed(2),
						fill: vLineTextColor
					}
					crossHairState.hLineLabel = hLineLabel

					//bg
					const hLineLabelBackgroundPath = ART.Path()
					hLineLabelBackgroundPath.moveTo(0.01, vLineLabelY - 7)
					hLineLabelBackgroundPath.lineTo(CONSTANTS.VLINE_LABEL_WIDTH, vLineLabelY - 7)
					hLineLabelBackgroundPath.lineTo(CONSTANTS.VLINE_LABEL_WIDTH, vLineLabelY + 7)
					hLineLabelBackgroundPath.lineTo(0.01, vLineLabelY + 7)
					hLineLabelBackgroundPath.close()
					hLineLabelBackground.path = hLineLabelBackgroundPath
					hLineLabelBackground.stroke = CONSTANTS.LABEL_STROKE
					hLineLabelBackground.fill = CONSTANTS.LABEL_FILL
					crossHairState.hLineLabelBackground = hLineLabelBackground
				} else {
					//当手指除出chart时清除横线label
					crossHairState.hLineLabelBackground = null
					crossHairState.hLineLabel = null
				}
			}

			//绘制横线副Label
			if (showHLineSubLabel) {
				// if(showHLineSubLabel && subYScale){
				if (shouldDrawHLine) {
					let vLineLabelY = loc[1] - y
					vLineLabelY = Math.max(vLineLabelY, CONSTANTS.TOP_PADDING)
					vLineLabelY = Math.min(vLineLabelY, height - CONSTANTS.BOTTOM_PADDING)
					let vLineTextColor = CONSTANTS.LABEL_FONT_COLOR
					let currValue = +yScale.invert(vLineLabelY).toFixed(2)
					let currChangePct = ((currValue - lastClose) / lastClose * 100).toFixed(2)
					//text
					if (!isNaN(+lastClose)) {
						lastClose = +lastClose
						if (currValue > lastClose) vLineTextColor = CONSTANTS.LABEL_FONT_UP_COLOR
						if (currValue < lastClose) vLineTextColor = CONSTANTS.LABEL_FONT_DN_COLOR
					}
					let hLineSubLabel = {
						x: frame.width - CONSTANTS.VLINE_LABEL_WIDTH + 2,
						y: vLineLabelY - CONSTANTS.HLINE_TEXT_YOFFSET,
						text: currChangePct + '%',
						fill: vLineTextColor
					}
					crossHairState.hLineSubLabel = hLineSubLabel

					//bg
					const hLineSubLabelBackgroundPath = ART.Path()
					hLineSubLabelBackgroundPath.moveTo(width - CONSTANTS.VLINE_LABEL_WIDTH, vLineLabelY - 7)
					hLineSubLabelBackgroundPath.lineTo(width, vLineLabelY - 7)
					hLineSubLabelBackgroundPath.lineTo(width, vLineLabelY + 7)
					hLineSubLabelBackgroundPath.lineTo(width - CONSTANTS.VLINE_LABEL_WIDTH, vLineLabelY + 7)
					hLineSubLabelBackgroundPath.close()
					hLineSubLabelBackground.path = hLineSubLabelBackgroundPath
					hLineSubLabelBackground.stroke = CONSTANTS.LABEL_STROKE
					hLineSubLabelBackground.fill = CONSTANTS.LABEL_FILL
					crossHairState.hLineSubLabelBackground = hLineSubLabelBackground
				} else {
					//当手指除出chart时清除横线label
					crossHairState.hLineSubLabelBackground = null
					crossHairState.hLineSubLabel = null
				}
			}

			//绘制纵线Label
			if (showVLineLabel) {
				let plotData = data.slice(domain.start, domain.end + 1);
				let xText = plotData[getCurrentItem(xScale, null, [loc[0]], plotData, 'index')][0];
				if (isTimestamp) {
					xText = moment.tz(xText, timezone).format(dateFormat);
				} else {
					let timestamp = getTimestamp(xText, timezone);
					xText = moment.tz(timestamp, timezone).format(dateFormat);
				}
				let hLineLabelTextX = loc[0] - xText.length * 8 / 2;
				let labelAdjustment = this.calcVLineLabelWidth(xText)
				if (hLineLabelTextX < x + CONSTANTS.LEFT_PADDING) {
					hLineLabelTextX = x + CONSTANTS.LEFT_PADDING;
				} else if (hLineLabelTextX > x + width - labelAdjustment.labelWidth - 6.5) {
					hLineLabelTextX = x + width - labelAdjustment.labelWidth + 5;
				} else {
					hLineLabelTextX = hLineLabelTextX + labelAdjustment.offset

				}
				let vLineLabel = {
					x: hLineLabelTextX,
					y: 0,
					text: xText
				};
				let hLineLabelWidth = labelAdjustment.labelWidth - 5
				let vLineLabelBackground = ART.Path();
				vLineLabelBackground.moveTo(hLineLabelTextX - 5, 0);
				vLineLabelBackground.lineTo(hLineLabelTextX + hLineLabelWidth, 0);
				vLineLabelBackground.lineTo(hLineLabelTextX + hLineLabelWidth, 11);
				vLineLabelBackground.lineTo(hLineLabelTextX - 5, 11);
				vLineLabelBackground.close();
				crossHairState.vLineLabelBackground = vLineLabelBackground;
				crossHairState.vLineLabel = vLineLabel;
			}
			this.setState(crossHairState);
		}
	}

	render() {
		let {
			path,
			vLineLabel,
			hLineLabel,
			hLineSubLabel,
			vLineLabelBackground,
			hLineLabelBackground,
			hLineSubLabelBackground
		} = this.state;

		return (
			<Group>
				<Shape d={path} stroke="#FFFFFF" strokeWidth={StyleSheet.hairlineWidth} />
				{vLineLabelBackground ?
					<Shape d={vLineLabelBackground} stroke="#78797E" fill="#31323A" strokeWidth={StyleSheet.hairlineWidth} />
					: null
				}
				{vLineLabel ?
					<Text
						font={CONSTANTS.LABEL_FONT}
						fill={CONSTANTS.LABEL_FONT_COLOR}
						x={vLineLabel.x}
						y={vLineLabel.y}>
						{vLineLabel.text}
					</Text>
					: null
				}
				{hLineLabelBackground ?
					<Shape
						d={hLineLabelBackground.path}
						stroke={hLineLabelBackground.stroke}
						fill={hLineLabelBackground.fill}
						strokeWidth={1} />
					: null
				}
				{hLineLabel ?
					<Text
						font={CONSTANTS.LABEL_FONT}
						fill={hLineLabel.fill}
						x={hLineLabel.x}
						y={hLineLabel.y}>
						{hLineLabel.text}
					</Text>
					: null
				}
				{hLineSubLabelBackground ?
					<Shape
						d={hLineSubLabelBackground.path}
						stroke={hLineSubLabelBackground.stroke}
						fill={hLineSubLabelBackground.fill}
						strokeWidth={1} />
					: null
				}
				{hLineSubLabel ?
					<Text
						font={CONSTANTS.LABEL_FONT}
						fill={hLineSubLabel.fill}
						x={hLineSubLabel.x}
						y={hLineSubLabel.y}>
						{hLineSubLabel.text}
					</Text>
					: null
				}
			</Group>
		)
	}
}

CrossHair.contextTypes = {
	data: PropTypes.array,
	domain: PropTypes.object,
	frame: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	events: PropTypes.object,
	currentItem: PropTypes.object
}
