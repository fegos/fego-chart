/**
 * 网格线组件
 *
 * @author eric
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART } from 'react-native';

const { Path, Shape } = ART;

export default class GridLine extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof GridLine
   */
  static defaultProps = {
    dash: null,
    colume: 0,
  }

  static propTypes = {
    // 虚线
    dash: PropTypes.arrayOf(PropTypes.number),
    // 线条颜色
    lineColor: PropTypes.string.isRequired,
    // 线条宽度
    lineWidth: PropTypes.number.isRequired,
    // row
    row: PropTypes.number.isRequired,
    // colume
    colume: PropTypes.number,
  }

  /**
   * 生命周期
   *
   * @memberof GridLine
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      return true;
    }
    if (this.props.row > 0) {
      if (JSON.stringify(this.context.frame) !== JSON.stringify(nextContext.frame)) {
        return true;
      }
    }
    const testNumber = 10;
    if (this.props.colume > 0) {
      if (JSON.stringify(this.context.frame) !== JSON.stringify(nextContext.frame)) {
        return true;
      }
    } else if (!this.context.xScale && nextContext.xScale) {
      return true;
    } else if (this.context.xScale(testNumber) !== nextContext.xScale(testNumber) ||
      JSON.stringify(this.context.xTicks) !== JSON.stringify(nextContext.xTicks)) {
      return true;
    }
    return false;
  }

  /**
   * 计算绘制路径
   */
  _caculateGridPath = () => {
    const path = Path();
    const { row, colume } = this.props;
    const {
      xTicks, xScale, frame, offset,
    } = this.context;

    if (frame && frame.width && frame.height) {
      if (row) {
        const itemHeight = frame.height / (row + 1);
        for (let idx = 1; idx <= row; idx++) {
          const y = itemHeight * idx;
          path.moveTo(0, y);
          path.lineTo(frame.width, y);
        }
      }
      if (colume) {
        const itemWidth = frame.width / (colume + 1);
        for (let idx = 1; idx <= colume; idx++) {
          const x = itemWidth * idx + offset;
          path.moveTo(x, 0);
          path.lineTo(x, frame.height);
        }
      } else if (xScale && xTicks && xTicks.length) {
        const ticksCount = xTicks.length;
        for (let idx = 0; idx < ticksCount; idx++) {
          const tickIndex = xTicks[idx];
          const x = xScale(tickIndex) + offset;
          path.moveTo(x, 0);
          path.lineTo(x, frame.height);
        }
      }
    }
    return path;
  }

  /**
   * 绘制区
   *
   * @returns
   * @memberof GridLine
   */
  render() {
    const { lineColor, lineWidth, dash } = this.props;
    const path = this._caculateGridPath();
    return (
      <Shape d={path} stroke={lineColor} strokeDash={dash} strokeWidth={lineWidth} />
    );
  }
}

GridLine.contextTypes = {
  data: PropTypes.array,
  frame: PropTypes.object,
  xScale: PropTypes.func,
  xTicks: PropTypes.array,
  offset: PropTypes.number,
};
