/**
 * 线图组件
 * @author eric
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART } from 'react-native';

const { Path, Shape, Group } = ART;

export default class LineSeries extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof LineSeries
   */
  static defaultProps = {
    riseColor: 'red',
    fallColor: 'green',
    lineColor: 'black',
    lineWidth: 1,
  }

  static propsType = {
    // 数据键值
    dataKey: PropTypes.string.isRequired,
    // 数据选择子
    yExtents: PropTypes.func.isRequired,
    // 线条颜色
    lineColor: PropTypes.string,
    // 线条宽度
    lineWidth: PropTypes.number,
    // 上涨颜色
    riseColor: PropTypes.string,
    // 下跌颜色
    fallColor: PropTypes.string,
  }

  /**
   * 生命周期
   *
   * @memberof LineSeries
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {
      data: preData, domain: preDomain, frame: preFrame, xScale: preXScale, yScale: preYScale,
    } = this.context;
    const {
      data, domain, frame, xScale, yScale,
    } = nextContext;
    if (JSON.stringify(data) !== JSON.stringify(preData) ||
      JSON.stringify(frame) !== JSON.stringify(preFrame) ||
      JSON.stringify(domain) !== JSON.stringify(preDomain)) {
      return true;
    }
    const testNumber = 10;
    if (preXScale(testNumber) !== xScale(testNumber) ||
      preYScale(testNumber) !== yScale(testNumber)) {
      return true;
    }
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      return true;
    }
    return false;
  }

  /**
   * 计算路径
   *
   * @memberof LineSeries
   */
  _caculatePath = () => {
    this._timelinePath = Path();
    const { yExtents } = this.props;
    const {
      xScale, yScale, data, domain, frame,
    } = this.context;
    if (data && domain && xScale && yScale && yExtents && frame && frame.width) {
      const actualData = data;
      if (actualData && yScale) {
        const { length } = actualData;
        let firstData = true;
        for (let index = 0; index < length; index++) {
          const dataElem = yExtents(actualData[index]);
          const x = xScale(index);
          const y = yScale(dataElem);
          if (!Number.isNaN(x) && !Number.isNaN(y)) {
            if (firstData) {
              firstData = false;
              this._timelinePath.moveTo(x, y);
            } else {
              this._timelinePath.lineTo(x, y);
            }
          }
        }
      }
    }
  }

  /**
   * 渲染函数
   *
   * @returns
   * @memberof LineSeries
   */
  render() {
    const {
      lineColor, lineWidth,
    } = this.props;
    this._caculatePath();
    return (
      <Group>
        <Shape d={this._timelinePath} stroke={lineColor} strokeWidth={lineWidth} />
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
};

