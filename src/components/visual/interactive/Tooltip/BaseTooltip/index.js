/**
 * BaseTooltip
 */
import React, { Component } from 'react'
import PropTypes, { element } from 'prop-types'
import { ART } from 'react-native'
import { getCurrentItem } from '../../../../../util'
const { Group, Text } = ART;

export default class BaseTooltip extends Component {

	static defaultProps = {
		rightMargin: 15.5,
		topMargin: 10,
		fontSize: 9,
		fontFamily: 'Helvetica',
		fontWeight: 'normal',
		titleColor: '#8f8f8f'
	}

	static propTypes = {
		// Tooltip右边距
		rightMargin: PropTypes.number,
		// Tooltip上边距
		topMargin: PropTypes.number,
		// Tooltip字体集
		fontFamily: PropTypes.string,
		// Tooltip字体大小
		fontSize: PropTypes.number,
		// Tooltip字重
		fontWeight: PropTypes.string,
		// 指标
		indicators: PropTypes.array,
		// 指标名
		title: PropTypes.string,
		// 参数
		valueKeys: PropTypes.array,
		// 类型 group
		type: PropTypes.string,
		// 指标颜色
		titleColor: PropTypes.string,
	}

	constructor(props) {
		super(props)
		this._dataIndex = null;
		this._periodStr = null;
		this.state = {
			tooltipInfo: null
		}
	}

	componentWillMount() {
		this._updateTipInfo(this.props, this.context)
	}

	componentWillReceiveProps(nextProps, nextContext) {
		let { indicators: preIndicators, type: preType, title: preTitle, xPos: preXPos, yPos: preYPos, fontWeight: preFontWeight, fontFamily: preFontFamily, fontSize: preFontSize } = this.props;
		let { events: preEvents, currentItem: preCurrentItem, data: preData, indicatorData: preIndicatorData, domain: preDomain, frame: preFrame, xScale: preXScale } = this.context;
		let { indicators, type, title, xPos, yPos, fontWeight, fontSize, fontFamily } = nextProps;
		let { events, currentItem, data, indicatorData, domain, frame, xScale } = nextContext;
		let shouldRedraw = false;
		if (!preIndicators || !preFrame) {
			shouldRedraw = true;
		} else if (preType !== type || preTitle !== title || preXPos !== xPos || preYPos !== yPos || preFontWeight !== fontWeight || preFontFamily !== fontFamily || preFontSize !== fontSize ||
			JSON.stringify(preIndicators) !== JSON.stringify(indicators) ||
			JSON.stringify(preFrame) !== JSON.stringify(frame)) {
			shouldRedraw = true;
		} else if (preEvents.longPressEvent && !events.longPressEvent) {
			shouldRedraw = true;
		} else if (!preEvents.longPressEvent && events.longPressEvent) {
			shouldRedraw = true;
		} else if (preEvents.longPressEvent && events.longPressEvent) {
			let prePlotData = preData.slice(preDomain.start, preDomain.end);
			let preDataIndex = getCurrentItem(preXScale, null, [preCurrentItem.x], prePlotData, 'index') + preDomain.start;
			let preItem = preIndicatorData[preDataIndex];
			let plotData = data.slice(domain.start, domain.end);
			let dataIndex = getCurrentItem(xScale, null, [currentItem.x], plotData, 'index') + domain.start;
			let item = indicatorData[dataIndex];

			if (JSON.stringify(preItem) !== JSON.stringify(item)) {
				shouldRedraw = true;
				this._dataIndex = dataIndex;
			}
		}
		if (shouldRedraw) {
			this._updateTipInfo(nextProps, nextContext);
		}
	}

	_updateTipInfo = (props, context) => {
		if (!context.frame) {
			return;
		}

		let { indicators, type, valueKeys, title, rightMargin, topMargin, titleColor, fontSize, fontFamily, fontWeight } = props;
		let { events, currentItem, xScale, data, indicatorData, domain, frame } = context;
		let { width, height } = frame;
		let tooltipInfo = [];
		let xPos = width - rightMargin;
		let font = { fontFamily: fontFamily, fontWeight: fontWeight, fontSize: fontSize }
		if (events.longPressEvent) {
			if (!this._dataIndex) {
				let plotData = data.slice(domain.start, domain.end);
				this._dataIndex = getCurrentItem(xScale, null, [currentItem.x], plotData, 'index') + domain.start;
			}
			tooltipInfo = this._getDetailToolTip(indicators, indicatorData, this._dataIndex, xPos, topMargin, type, title, valueKeys, titleColor, fontSize, font)
		} else {
			tooltipInfo = this._getNormalTooltip(indicators, xPos, topMargin, type, title, titleColor, fontSize, font)
		}
		this.setState({ tooltipInfo })
	}

	_getDetailToolTip = (indicators, indicatorData, dataIndex, xPos, yPos, type, title, valueKeys, titleColor, fontSize, font) => {
		let tooltipInfo = null;
		let len = indicators.length;
		let indicator = null;
		let data = null;
		let text = null;
		for (let i = len - 1; i >= 0; i--) {
			indicator = indicators[i]
			data = indicatorData[indicator.dataKey][dataIndex]
			if (type === 'group') {
				let strokeArr = Object.keys(indicator.stroke);
				let arrLen = strokeArr.length;
				for (let j = arrLen - 1; j >= 0; j--) {
					if (data === '-') {
						text = ` ${strokeArr[j]}: -`
					} else {
						text = ` ${strokeArr[j]}: ${data[valueKeys[j]] ? data[valueKeys[j]].toFixed(2) : '-'}`
					}
					let offset = j === arrLen - 1 ? 0 : 3;
					xPos = xPos - text.length * fontSize / 2.0 - offset;
					tooltipInfo = this._updateTooltip(tooltipInfo, xPos, yPos, text, indicator.stroke[strokeArr[j]], font)
				}
			} else {
				text = ` ${indicator.dataKey}: ${data && data !== '-' ? data.toFixed(2) : '-'}`
				xPos = xPos - text.length * fontSize / 2.0 - 5
				tooltipInfo = this._updateTooltip(tooltipInfo, xPos, yPos, text, indicator.stroke, font);
			}
		}
		text = `${title}(${this._periodStr}) `
		xPos = xPos - text.length * fontSize / 2.0
		tooltipInfo = this._updateTooltip(tooltipInfo, xPos, yPos, text, titleColor, font)
		return tooltipInfo;
	}

	_getNormalTooltip = (indicators, xPos, yPos, type, title, titleColor, fontSize, font) => {
		let tooltipInfo = null;
		let periodArr = [];
		if (indicators) {
			indicators.map(item => {
				if (type === 'group') {
					periodArr.push(Object.values(item.params).join(','))
				} else {
					periodArr.push(item.params.period)
				}
			});
			this._periodStr = periodArr.join(',');
			let content = `${title}(${this._periodStr})`
			xPos = xPos - content.length * fontSize / 2.0;
			tooltipInfo = this._updateTooltip(tooltipInfo, xPos, yPos, content, titleColor, font)
		}
		return tooltipInfo;
	}

	_updateTooltip = (arr, x, y, text, stroke, font) => {
		let newArr = arr ? arr : [];
		newArr.push({ x, y, text, stroke, font })
		return newArr
	}

	render() {
		let { tooltipInfo } = this.state
		if (tooltipInfo) {
			return (
				<Group>
					{
						tooltipInfo.map((tooltip, idx) => {
							return (
								<Text key={idx} fill={tooltip.stroke} strokeWidth={1}
									font={tooltip.font}
									x={tooltip.x}
									y={tooltip.y}>
									{tooltip.text}
								</Text>
							)
						})
					}
				</Group>
			)
		} else {
			return null;
		}
	}
}

BaseTooltip.contextTypes = {
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	currentItem: PropTypes.object,
	data: PropTypes.array,
	indicatorData: PropTypes.object,
	domain: PropTypes.object,
	frame: PropTypes.object,
}