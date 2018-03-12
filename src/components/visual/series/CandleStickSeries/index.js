/**
 * 蜡烛图组件
 * @author eric
 */

"use strict";

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ART, StyleSheet } from 'react-native'
const { Path, Shape, Group, Transform } = ART;

export default class CandleStickSeries extends Component {

	static defaultProps = {
		riseColor: 'red',
		fallColor: 'green',
		isHollow: false,
	}

	static propsType = {
		// 是否为空心
		isHollow: PropTypes.bool,
		// 上涨颜色
		riseColor: PropTypes.string,
		// 下跌颜色
		fallColor: PropTypes.string,
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		let { data: preData, domain: preDoamin, plotConfig: prePlotConfig, yScale: preYScale } = this.context;
		let { data, domain, plotConfig, yScale } = nextContext;
		if (!preData && data ||
			!preDoamin && domain ||
			!preYScale || yScale) {
			return true;
		}
		let preActualData = preData.slice(preDoamin.start, preDoamin.end + 1);
		let actualData = data.slice(domain.start, domain.end + 1);
		if (JSON.stringify(preActualData) !== JSON.stringify(actualData) ||
			JSON.stringify(prePlotConfig.barWidth) !== JSON.stringify(plotConfig.barWidth) ||
			preYScale !== yScale) {
			return true;
		}
		return false;
	}


	/**
	 * 计算蜡烛图绘制路径
	 */
	_caculatePath = () => {
		let path;
		let { data, domain, xScale, yScale, plotConfig } = this.context;
		let { step, barWidth, spacing } = plotConfig;
		this._boldIncreasePath = Path();
		this._boldDecreasePath = Path();
		this._thinIncreasePath = Path();
		this._thinDecreasePath = Path();
		if (data && yScale && xScale && barWidth && domain) {
			let actualData = data.slice(domain.start, domain.end + 1)
			let length = actualData.length;
			for (let index = 0; index < length; index++) {
				let dataElem = actualData[index];
				let open = dataElem[1];
				let close = dataElem[2];
				let high = dataElem[3];
				let low = dataElem[4];
				let x = xScale(index);
				let openPos = yScale(open);
				let closePos = yScale(close);
				let highPos = yScale(high);
				let lowPos = yScale(low);
				if (openPos && x) {
					if (close > open) {
						this._boldIncreasePath.moveTo(x - barWidth / 2.0, openPos);
						this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos);
						this._boldIncreasePath.lineTo(x + barWidth / 2.0, closePos);
						this._boldIncreasePath.lineTo(x - barWidth / 2.0, closePos);
						this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos);
						this._thinIncreasePath.moveTo(x, highPos);
						this._thinIncreasePath.lineTo(x, closePos);
						this._thinIncreasePath.moveTo(x, openPos);
						this._thinIncreasePath.lineTo(x, lowPos);
					} else if (close < open) {
						this._boldDecreasePath.moveTo(x - barWidth / 2.0, openPos);
						this._boldDecreasePath.lineTo(x + barWidth / 2.0, openPos);
						this._boldDecreasePath.lineTo(x + barWidth / 2.0, closePos);
						this._boldDecreasePath.lineTo(x - barWidth / 2.0, closePos);
						this._boldDecreasePath.lineTo(x - barWidth / 2.0, openPos);
						this._thinDecreasePath.moveTo(x, highPos);
						this._thinDecreasePath.lineTo(x, openPos);
						this._thinDecreasePath.moveTo(x, closePos);
						this._thinDecreasePath.lineTo(x, lowPos);
					} else {
						this._boldIncreasePath.moveTo(x - barWidth / 2.0, openPos);
						this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos);
						this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos + StyleSheet.hairlineWidth);
						this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos + StyleSheet.hairlineWidth);
						this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos);
						this._thinIncreasePath.moveTo(x, highPos);
						this._thinIncreasePath.lineTo(x, closePos);
						this._thinIncreasePath.moveTo(x, openPos);
						this._thinIncreasePath.lineTo(x, lowPos);
					}
				}
			}
		}
		return path;
	}

	render() {
		this._caculatePath();
		let { riseColor, fallColor, isHollow } = this.props;
		let { offset } = this.context;
		let transform = new Transform().translate(offset, 0);
		if (isHollow) {
			return (
				<Group>
					<Shape d={this._thinIncreasePath} stroke={riseColor} strokeWidth={1} strokeCap='square' transform={transform} />
					<Shape d={this._thinDecreasePath} stroke={fallColor} fill={fallColor} strokeWidth={1} strokeCap='square' transform={transform} />
					<Shape d={this._boldIncreasePath} stroke={riseColor} strokeCap='square' transform={transform} />
					<Shape d={this._boldDecreasePath} stroke={fallColor} fill={fallColor} strokeCap='square' transform={transform} />
				</Group>
			);
		} else {
			return (
				<Group>
					<Shape d={this._thinIncreasePath} stroke={riseColor} strokeWidth={1} strokeCap='square' transform={transform} />
					<Shape d={this._thinDecreasePath} stroke={fallColor} fill={fallColor} strokeWidth={1} strokeCap='square' transform={transform} />
					<Shape d={this._boldIncreasePath} stroke={riseColor} fill={riseColor} strokeCap='square' transform={transform} />
					<Shape d={this._boldDecreasePath} stroke={fallColor} fill={fallColor} strokeCap='square' transform={transform} />
				</Group>
			);
		}

	}
}

CandleStickSeries.contextTypes = {
	data: PropTypes.array,
	plotConfig: PropTypes.object,
	domain: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	offset: PropTypes.number
}
