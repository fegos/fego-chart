/**
 * 蜡烛图组件
 * @author eric
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART, StyleSheet } from 'react-native';

const {
  Path, Shape, Group, Transform,
} = ART;

export default class CandleStickSeries extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof CandleStickSeries
   */
  static defaultProps = {
    riseColor: 'red',
    fallColor: 'green',
    isHollow: false,
  }

  static propsType = {
    // 是否为空心
    isHollow: PropTypes.bool,
    // 上涨颜色
    riseColor: PropTypes.string,
    // 下跌颜色
    fallColor: PropTypes.string,
  }

  /**
   * 生命周期
   *
   * @memberof CandleStickSeries
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {
      data: preData, domain: preDomain, xScale: preXScale, yScale: preYScale, plotConfig: prePlotConfig, offset: preOffset,
    } = this.context;
    const {
      data, domain, xScale, yScale, plotConfig, offset,
    } = nextContext;
    if (!preData || !data ||
      !preDomain || !domain ||
      !preYScale || !yScale ||
      !preXScale || !xScale) {
      return true;
    }
    const preActualData = preData.slice(preDomain.start, preDomain.end + 1);
    const actualData = data.slice(domain.start, domain.end + 1);
    const testNumber = 10;
    if (JSON.stringify(preActualData) !== JSON.stringify(actualData) ||
      JSON.stringify(prePlotConfig) !== JSON.stringify(plotConfig) ||
      preXScale(testNumber) !== xScale(testNumber) ||
      preYScale(testNumber) !== yScale(testNumber) ||
      preOffset !== offset) {
      return true;
    }
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      return true;
    }
    return false;
  }


  /**
   * 计算蜡烛图绘制路径
   */
  _caculatePath = () => {
    let path;
    const {
      data, domain, xScale, yScale, plotConfig,
    } = this.context;
    const { barWidth } = plotConfig;
    this._boldIncreasePath = Path();
    this._boldDecreasePath = Path();
    this._thinIncreasePath = Path();
    this._thinDecreasePath = Path();
    if (data && yScale && xScale && barWidth && domain) {
      const actualData = data.slice(domain.start, domain.end + 1);
      const { length } = actualData;
      for (let index = 0; index < length; index++) {
        const dataElem = actualData[index];
        const open = dataElem[1];
        const close = dataElem[2];
        const high = dataElem[3];
        const low = dataElem[4];
        const x = xScale(index);
        const openPos = yScale(open);
        const closePos = yScale(close);
        const highPos = yScale(high);
        const lowPos = yScale(low);
        if (openPos && x) {
          if (close > open) {
            this._boldIncreasePath.moveTo(x - barWidth / 2.0, openPos);
            this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos);
            this._boldIncreasePath.lineTo(x + barWidth / 2.0, closePos);
            this._boldIncreasePath.lineTo(x - barWidth / 2.0, closePos);
            this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos);
            this._thinIncreasePath.moveTo(x, highPos);
            this._thinIncreasePath.lineTo(x, closePos);
            this._thinIncreasePath.moveTo(x, openPos);
            this._thinIncreasePath.lineTo(x, lowPos);
          } else if (close < open) {
            this._boldDecreasePath.moveTo(x - barWidth / 2.0, openPos);
            this._boldDecreasePath.lineTo(x + barWidth / 2.0, openPos);
            this._boldDecreasePath.lineTo(x + barWidth / 2.0, closePos);
            this._boldDecreasePath.lineTo(x - barWidth / 2.0, closePos);
            this._boldDecreasePath.lineTo(x - barWidth / 2.0, openPos);
            this._thinDecreasePath.moveTo(x, highPos);
            this._thinDecreasePath.lineTo(x, openPos);
            this._thinDecreasePath.moveTo(x, closePos);
            this._thinDecreasePath.lineTo(x, lowPos);
          } else {
            this._boldIncreasePath.moveTo(x - barWidth / 2.0, openPos);
            this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos);
            this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos + StyleSheet.hairlineWidth);
            this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos + StyleSheet.hairlineWidth);
            this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos);
            this._thinIncreasePath.moveTo(x, highPos);
            this._thinIncreasePath.lineTo(x, closePos);
            this._thinIncreasePath.moveTo(x, openPos);
            this._thinIncreasePath.lineTo(x, lowPos);
          }
        }
      }
    }
    return path;
  }

  /**
   * 渲染函数
   *
   * @returns
   * @memberof CandleStickSeries
   */
  render() {
    this._caculatePath();
    const { riseColor, fallColor, isHollow } = this.props;
    const { offset } = this.context;
    const transform = new Transform().translate(offset, 0);
    if (isHollow) {
      return (
        <Group>
          <Shape d={this._thinIncreasePath} stroke={riseColor} strokeWidth={1} strokeCap="square" transform={transform} />
          <Shape d={this._thinDecreasePath} stroke={fallColor} fill={fallColor} strokeWidth={1} strokeCap="square" transform={transform} />
          <Shape d={this._boldIncreasePath} stroke={riseColor} strokeCap="square" transform={transform} />
          <Shape d={this._boldDecreasePath} stroke={fallColor} fill={fallColor} strokeCap="square" transform={transform} />
        </Group>
      );
    } else {
      return (
        <Group>
          <Shape d={this._thinIncreasePath} stroke={riseColor} strokeWidth={1} strokeCap="square" transform={transform} />
          <Shape d={this._thinDecreasePath} stroke={fallColor} fill={fallColor} strokeWidth={1} strokeCap="square" transform={transform} />
          <Shape d={this._boldIncreasePath} stroke={riseColor} fill={riseColor} strokeCap="square" transform={transform} />
          <Shape d={this._boldDecreasePath} stroke={fallColor} fill={fallColor} strokeCap="square" transform={transform} />
        </Group>
      );
    }
  }
}

CandleStickSeries.contextTypes = {
  data: PropTypes.array,
  plotConfig: PropTypes.object,
  domain: PropTypes.object,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  offset: PropTypes.number,
};
