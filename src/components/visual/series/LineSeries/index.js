/**
 * 线图组件
 * @author eric
 */
"use strict";

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ART } from 'react-native'
import { transpose } from 'd3-array';
const { Path, Shape, Group } = ART;

export default class LineSeries extends Component {
	static defaultProps = {
		riseColor: 'red',
		fallColor: 'green',
		stroke: 'black'
	}

	static propsType = {
		dataKey: PropTypes.string,
		stroke: PropTypes.string,
		riseColor: PropTypes.string,
		fallColor: PropTypes.string,
		yExtents: PropTypes.func.isRequired,
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		let { data: preData, domain: preDoamin, frame: preFrame } = this.context;
		let { data, domain, frame } = nextContext;
		if (JSON.stringify(data) !== JSON.stringify(preData) ||
			JSON.stringify(frame) !== JSON.stringify(preFrame) ||
			JSON.stringify(domain) !== JSON.stringify(preDoamin)) {
			return true;
		}
		return false;
	}

	_caculatePath = () => {
		this._timeLinePath = Path();
		this._gradientPath = Path();
		let { yExtents, dataKey } = this.props;
		let { xScale, yScale, data, domain, frame } = this.context;
		if (data && domain && xScale && yScale && yExtents && frame && frame.width) {
			let { start, end } = domain;
			let actualData = data;
			if (actualData && yScale) {
				let length = actualData.length;
				let firstData = true;
				let firstX = 0;
				for (let index = 0; index < length; index++) {
					let dataElem = yExtents(actualData[index]);
					let x = xScale(index);
					let y = yScale(dataElem);
					if (!isNaN(x) && !isNaN(y)) {
						if (firstData) {
							firstData = false;
							this._timeLinePath.moveTo(x, y);
							this._gradientPath.moveTo(x, y);
							firstX = x;
						} else {
							this._timeLinePath.lineTo(x, y);
							this._gradientPath.lineTo(x, y);
							if (index === length - 1 && (dataKey === 'timeline' || dataKey === 'fiveday')) {
								let x = xScale(length - 1);
								let y = frame.height;
								this._gradientPath.lineTo(x, y);
								this._gradientPath.lineTo(firstX, y);
								this._gradientPath.close();
							}
						}
					} else {
					}
				}


			}
		}
	}

	render() {
		let { stroke, strokeWidth, riseColor, fallColor, dataKey, yExtents, lightRiseColor, lightFallColor } = this.props;
		let { data, preClosedPrice, frame } = this.context;
		let strokeColor = stroke ? stroke : 'black';

		let gradientLayer = null;
		this._caculatePath();
		if (dataKey === 'timeline' || dataKey === 'fiveday') {
			if (data) {
				let lightColor = null;
				let lastItem = data[data.length - 1];
				lastItem = yExtents(lastItem);
				if (lastItem < preClosedPrice) {
					strokeColor = fallColor;
					lightColor = lightFallColor;
				} else {
					strokeColor = riseColor;
					lightColor = lightRiseColor;
				}
				let linearGradient = new ART.LinearGradient({
					"0": strokeColor,
					"1": lightColor
				}, 0, 0, 0, frame.height);
				gradientLayer = <Shape d={this._gradientPath} fill={linearGradient} />
			}
		}
		return (
			<Group>
				{gradientLayer}
				<Shape d={this._timeLinePath} stroke={strokeColor} strokeWidth={strokeWidth} />
			</Group>
		);
	}
}

LineSeries.contextTypes = {
	data: PropTypes.array,
	frame: PropTypes.object,
	domain: PropTypes.object,
	preClosedPrice: PropTypes.number,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
}

