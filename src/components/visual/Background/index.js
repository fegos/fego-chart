/**
 * 背景框组件
 *
 * @author eric
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART, StyleSheet } from 'react-native';

const {
  Path, Shape,
} = ART;

export default class Background extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof Background
   */
  static defaultProps = {
    position: null,
    dash: null,
    lineColor: 'gray',
    lineWidth: StyleSheet.hairlineWidth,
  }

  static propTypes = {
    // top|bottom|left|right
    position: PropTypes.string,
    // 虚线
    dash: PropTypes.arrayOf(PropTypes.number),
    // 线条颜色
    lineColor: PropTypes.string,
    // 线条宽度
    lineWidth: PropTypes.number,
  }

  /**
   * 生命周期
   *
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { frame: preFrame } = this.context;
    const { frame } = nextContext;
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
    const { position } = this.props;
    const { frame } = this.context;
    const path = Path();
    if (frame) {
      const { width, height } = frame;
      if (!position) {
        path.moveTo(0, 0);
        path.lineTo(width, 0);
        path.lineTo(width, height);
        path.lineTo(0, height);
        path.lineTo(0, 0);
      } else {
        const positions = position.split('|');
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

  /**
   * 渲染区
   *
   * @returns
   * @memberof Background
   */
  render() {
    const { lineColor, dash, lineWidth } = this.props;
    const path = this._caculatePath();
    return (
      <Shape d={path} stroke={lineColor} strokeDash={dash} strokeWidth={lineWidth} />
    );
  }
}

Background.contextTypes = {
  frame: PropTypes.object,
};
