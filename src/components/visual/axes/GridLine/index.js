/**
 * 网格线组件
 * 
 * @author eric
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'

const { Path, Shape, Group, Text } = ART;

export default class GridLine extends Component {

	static propTypes = {
		// 虚线
		dash: PropTypes.array,
		// 线条颜色
		lineColor: PropTypes.string.isRequired,
		// 线条宽度 
		lineWidth: PropTypes.number.isRequired,
		// row
		row: PropTypes.number.isRequired,
		// colume
		colume: PropTypes.number
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
			return true;
		}
		if (this.props.row > 0) {
			if (JSON.stringify(this.context.frame) !== JSON.stringify(nextContext.frame)) {
				return true;
			}
		}
		if (this.props.colume > 0) {
			if (JSON.stringify(this.context.frame) !== JSON.stringify(nextContext.frame)) {
				return true;
			}
		} else {
			if (this.context.xScale !== nextContext.xScale ||
				JSON.stringify(this.context.xTicks) !== JSON.stringify(nextContext.xTicks)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 计算绘制路径
	 */
	_caculateGridPath = () => {
		let path = Path();
		let { row, colume } = this.props;
		let { xTicks, xScale, frame, offset } = this.context;

		if (frame && frame.width && frame.height) {
			if (row) {
				let itemHeight = frame.height / (row + 1);
				for (let idx = 1; idx <= row; idx++) {
					let y = itemHeight * idx;
					path.moveTo(0, y);
					path.lineTo(frame.width, y);
				}
			}
			if (colume) {
				let itemWidth = frame.width / (colume + 1);
				for (let idx = 1; idx <= colume; idx++) {
					let x = itemWidth * idx + offset;
					path.moveTo(x, 0);
					path.lineTo(x, frame.height);
				}
			} else if (xScale && xTicks && xTicks.length) {
				let ticksCount = xTicks.length;
				for (let idx = 0; idx < ticksCount; idx++) {
					let tickIndex = xTicks[idx];
					let x = xScale(tickIndex) + offset;
					path.moveTo(x, 0);
					path.lineTo(x, frame.height);
				}
			}
		}
		return path;
	}

	render() {
		let { lineColor, lineWidth, dash } = this.props;
		let path = this._caculateGridPath();
		return (
			<Shape d={path} stroke={lineColor} strokeDash={dash} strokeWidth={lineWidth} />
		)
	}

	_renderGridLines = () => {

	}
}

GridLine.contextTypes = {
	data: PropTypes.array,
	frame: PropTypes.object,
	xScale: PropTypes.func,
	xTicks: PropTypes.array,
	offset: PropTypes.number,
}
