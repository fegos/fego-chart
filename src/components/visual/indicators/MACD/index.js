/**
 * MACD指标线组件
 * @author eric
 */
"use strict";

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART, StyleSheet } from 'react-native'
const { Path, Shape, Group, Transform } = ART;

export default class MACD extends Component {
	static defaultProps = {
		lineWidth: StyleSheet.hairlineWidth,
	}

	static propsType = {
		// 指标Key
		dataKey: PropTypes.string.isRequired,
		// 线条颜色
		stroke: PropTypes.object.isRequired,
		// 线条粗细
		lineWidth: PropTypes.number,
		// 柱状图粗细
		barWidth: PropTypes.number,
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		let { data: preData, domain: preDoamin, xScale: preXScale, yScale: preYScale } = this.context;
		let { data, domain, xScale, yScale } = nextContext;
		if (!preData && data ||
			!preDoamin && domain ||
			!preYScale || yScale) {
			return true;
		}
		let preActualData = preData.slice(preDoamin.start, preDoamin.end + 1);v
		let actualData = data.slice(domain.start, domain.end + 1);
		if (JSON.stringify(preActualData) !== JSON.stringify(actualData) ||
			preXScale !== xScale ||
			preYScale !== yScale) {
			return true;
		}
		return false;
	}

	/**
	 * 计算绘制路径
	 */
	_caculatePath = () => {
		let { dataKey } = this.props;
		let { indicatorData, domain, xScale, yScale, plotConfig } = this.context;
		let { barWidth } = plotConfig;
		if (this.props.barWidth) {
			barWidth = this.props.barWidth;
		}
		let difPath = new Path();
		let deaPath = new Path();
		let upPath = new Path();
		let downPath = new Path();

		if (indicatorData && domain && xScale && yScale) {
			let data = indicatorData[dataKey];
			if (data) {
				let { start, end } = domain;
				let screenData = data.slice(start, end + 1);
				let length = end - start + 1;
				let firstM = false;
				let firstS = false;
				for (var index = 0; index < length; index++) {
					let dataElem = screenData[index];
					if (dataElem) {
						if (dataElem.MACD === '-' || dataElem.MACD === undefined) {
							let firstM = false;
							continue;
						} else {
							if (!firstM) {
								firstM = true;
								difPath.moveTo(xScale(index), yScale(dataElem.MACD));
							} else {
								difPath.lineTo(xScale(index), yScale(dataElem.MACD));
							}
						}

						if (dataElem.signal === '-' || dataElem.signal === undefined) {
							let firstS = false;
							continue;
						} else {
							if (!firstS) {
								firstS = true;
								deaPath.moveTo(xScale(index), yScale(dataElem.signal));
							} else {
								deaPath.lineTo(xScale(index), yScale(dataElem.signal));
							}
						}

						if (dataElem.histogram === '-' || dataElem.histogram === undefined) {
							continue;
						} else {
							if (dataElem.histogram >= 0) {
								//up
								upPath.moveTo(xScale(index) - barWidth / 2.0, yScale(0));
								upPath.lineTo(xScale(index) + barWidth / 2.0, yScale(0));
								upPath.lineTo(xScale(index) + barWidth / 2.0, yScale(dataElem.histogram));
								upPath.lineTo(xScale(index) - barWidth / 2.0, yScale(dataElem.histogram));
								upPath.lineTo(xScale(index) - barWidth / 2.0, yScale(0));
							} else {
								//down
								downPath.moveTo(xScale(index) - barWidth / 2.0, yScale(0));
								downPath.lineTo(xScale(index) + barWidth / 2.0, yScale(0));
								downPath.lineTo(xScale(index) + barWidth / 2.0, yScale(dataElem.histogram));
								downPath.lineTo(xScale(index) - barWidth / 2.0, yScale(dataElem.histogram));
								downPath.lineTo(xScale(index) - barWidth / 2.0, yScale(0));
							}
						}
					}
				}
			}
		}
		return {
			difPath: difPath,
			deaPath: deaPath,
			upPath: upPath,
			downPath: downPath
		};
	}

	render() {
		let { lineWidth, stroke } = this.props;
		let paths = this._caculatePath();
		let upPath = paths.upPath;
		let downPath = paths.downPath;
		let difPath = paths.difPath;
		let deaPath = paths.deaPath;
		let { offset } = this.context;
		let transform = new Transform().translate(offset, 0);
		return (
			<Group>
				<Shape d={upPath} fill={stroke.Raise} transform={transform} />
				<Shape d={downPath} fill={stroke.Fall} transform={transform} />
				<Shape d={difPath} stroke={stroke.DIFF} strokeWidth={lineWidth} transform={transform} />
				<Shape d={deaPath} stroke={stroke.DEA} strokeWidth={lineWidth} transform={transform} />
			</Group>
		);
	}
}

MACD.contextTypes = {
	indicatorData: PropTypes.object,
	plotConfig: PropTypes.object,
	domain: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	offset: PropTypes.number
}