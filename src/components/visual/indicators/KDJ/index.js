/**
 * KDJ指标线组件
 * @author eric
 */
"use strict";

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART, StyleSheet } from 'react-native'
const { Path, Shape, Group, Transform } = ART;

export default class KDJ extends Component {

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
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		let { data: preData, domain: preDoamin, xScale: preXScale, yScale: preYScale } = this.context;
		let { data, domain, xScale, yScale } = nextContext;
		if (!preData && data ||
			!preDoamin && domain ||
			!preYScale || yScale) {
			return true;
		}
		let preActualData = preData.slice(preDoamin.start, preDoamin.end + 1);
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
		let pathK;
		let pathD;
		let pathJ;
		let { dataKey } = this.props;
		let { indicatorData, domain, xScale, yScale } = this.context;
		if (indicatorData && domain && xScale && yScale) {
			let { start, end } = domain;
			let data = indicatorData[dataKey];
			if (data) {
				let screenData = indicatorData[dataKey].slice(start, end + 1);
				let firstValidValue = false;
				if (screenData) {
					let length = end - start + 1;
					for (let index = 0; index < length; index++) {
						let dataElem = screenData[index];
						if (dataElem === '-') {
							firstValidValue = false;
							continue;
						} else {
							if (dataElem) {
								if (this._isValidNum(dataElem)) {
									if (!firstValidValue) {
										firstValidValue = true;
										pathK = Path().moveTo(xScale(index), yScale(dataElem.k));
										pathD = Path().moveTo(xScale(index), yScale(dataElem.d));
										pathJ = Path().moveTo(xScale(index), yScale(dataElem.j));
									} else {
										pathK.lineTo(xScale(index), yScale(dataElem.k));
										pathD.lineTo(xScale(index), yScale(dataElem.d));
										pathJ.lineTo(xScale(index), yScale(dataElem.j));
									}
								}
							}
						}
					}
				}
			}
		}
		return [pathK, pathD, pathJ];
	}

	_isValidNum = (dataElem) => {
		let isValid = true;
		Object.keys(dataElem).map(
			(key) => {
				let value = dataElem[key];
				if (value === undefined ||
					value === null ||
					isNaN(value)) {
					isValid = false;
				}

			}
		)
		return isValid;
	}

	render() {
		let { stroke, lineWidth } = this.props;
		let paths = this._caculatePath();
		let pathK = paths[0];
		let pathD = paths[1];
		let pathJ = paths[2];
		let { offset } = this.context;
		let transform = new Transform().translate(offset, 0);
		return (
			<Group>
				<Shape d={pathK} stroke={stroke.K} strokeWidth={lineWidth} transform={transform} />
				<Shape d={pathD} stroke={stroke.D} strokeWidth={lineWidth} transform={transform} />
				<Shape d={pathJ} stroke={stroke.J} strokeWidth={lineWidth} transform={transform} />
			</Group>
		);
	}
}

KDJ.contextTypes = {
	indicatorData: PropTypes.object,
	domain: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	offset: PropTypes.number
}