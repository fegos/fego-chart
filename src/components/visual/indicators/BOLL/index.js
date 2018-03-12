/**
 * BOLL指标线组件
 * @author eric
 */
"use strict";

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'
const { Path, Shape, Group, Transform } = ART;

export default class BOLL extends Component {

	static defaultProps = {
		lineWidth: 1,
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
		let pathLower;
		let pathMiddle;
		let pathUpper;
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
								if (!firstValidValue) {
									firstValidValue = true;
									pathLower = Path().moveTo(xScale(index), yScale(dataElem.lower));
									pathMiddle = Path().moveTo(xScale(index), yScale(dataElem.middle));
									pathUpper = Path().moveTo(xScale(index), yScale(dataElem.upper));
								} else {
									pathLower.lineTo(xScale(index), yScale(dataElem.lower));
									pathMiddle.lineTo(xScale(index), yScale(dataElem.middle));
									pathUpper.lineTo(xScale(index), yScale(dataElem.upper));
								}
							}
						}
					}
				}
			}
		}

		return [pathLower, pathMiddle, pathUpper];
	}

	render() {
		let { stroke, lineWidth } = this.props;
		let paths = this._caculatePath();
		let pathLower = paths[0];
		let pathMiddle = paths[1];
		let pathUpper = paths[2];
		let { offset } = this.context;
		let transform = new Transform().translate(offset, 0);
		return (
			<Group>
				<Shape d={pathLower} stroke={stroke.LOWER} strokeWidth={lineWidth} transform={transform} />
				<Shape d={pathMiddle} stroke={stroke.MID} strokeWidth={lineWidth} transform={transform} />
				<Shape d={pathUpper} stroke={stroke.UPPER} strokeWidth={lineWidth} transform={transform} />
			</Group>

		);
	}
}

BOLL.contextTypes = {
	indicatorData: PropTypes.object,
	domain: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	offset: PropTypes.number
}