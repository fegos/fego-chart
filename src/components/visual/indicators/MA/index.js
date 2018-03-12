/**
 * MA指标线组件
 * @author eric
 */
"use strict";

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'
const { Path, Shape, Group, Transform } = ART;

export default class MA extends Component {

	static defaultProps = {
		lineWidth: 1,
	}

	static propsType = {
		// 指标Key
		dataKey: PropTypes.string.isRequired,
		// 线条颜色
		stroke: PropTypes.string.isRequired,
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
		let path = Path();
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
							let x = xScale(index);
							let y = yScale(dataElem);
							if (x && y || x * y === 0) {
								if (!firstValidValue) {
									firstValidValue = true;
									path.moveTo(x, y);
								} else {
									path.lineTo(x, y);
								}
							}
						}
					}
				}
			}
		}
		return path;
	}

	render() {
		let path = this._caculatePath();
		let { stroke, lineWidth } = this.props;
		let { offset } = this.context;
		let transform = new Transform().translate(offset, 0);
		if (path) {
			return (
				<Shape d={path} stroke={stroke} strokeWidth={lineWidth} transform={transform} />
			);
		} else {
			return (
				<Shape />
			);
		}
	}
}

MA.contextTypes = {
	indicatorData: PropTypes.object,
	domain: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	offset: PropTypes.number
}