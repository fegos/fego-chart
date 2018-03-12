/**
 * 蜡烛图组件
 * 
 * @author eric
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'

const { Path, Shape, Group, Text } = ART;

export default class Background extends Component {
	static propTypes = {
		// top|bottom|left|right
		position: PropTypes.string,
		// 虚线
		dash: PropTypes.array,
		// 线条颜色
		lineColor: PropTypes.string.isRequired,
		// 线条宽度 
		lineWidth: PropTypes.number.isRequired,
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		let { frame: preFrame } = this.context;
		let { frame } = nextContext;
		if (JSON.stringify(preFrame) !== frame ||
			JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
			return true;
		}
		return false;
	}


	/**
	 * 计算绘制路径
	 */
	_caculatePath = () => {
		let { position } = this.props;
		let { frame } = this.context;
		let path = Path();
		if (frame) {
			let { width, height } = frame;
			if (!position) {
				path.moveTo(0, 0);
				path.lineTo(width, 0);
				path.lineTo(width, height);
				path.lineTo(0, height);
				path.lineTo(0, 0);
			} else {
				let positions = position.split('|');
				if (positions.includes('top')) {
					path.moveTo(0, 0);
					path.lineTo(width, 0);
				}
				if (positions.includes('left')) {
					path.moveTo(0, 0);
					path.lineTo(0, height);
				}
				if (positions.includes('right')) {
					path.moveTo(width, 0);
					path.lineTo(width, height);
				}
				if (positions.includes('bottom')) {
					path.moveTo(0, height + 0);
					path.lineTo(width, height);
				}
			}
		}
		return path;
	}

	render() {
		let { lineColor, dash, lineWidth } = this.props;
		let path = this._caculatePath();
		return (
			<Shape d={path} stroke={lineColor} strokeDash={dash} strokeWidth={lineWidth} />
		)
	}
}

Background.contextTypes = {
	frame: PropTypes.object,
}
