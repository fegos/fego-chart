/**
 * MACD指标线组件
 * @author eric
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ART, StyleSheet } from 'react-native';

import BaseIndicator from '../BaseIndicator';

const {
  Path, Shape, Group, Transform,
} = ART;

export default class MACD extends BaseIndicator {
  /**
   * 组件属性
   *
   * @static
   * @memberof MACD
   */
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
    // 柱状图粗细
    barWidth: PropTypes.number,
  }

  /**
   * 计算绘制路径
   */
  _caculatePath = () => {
    const { dataKey } = this.props;
    const {
      indicatorData, domain, xScale, yScale, plotConfig,
    } = this.context;
    let { barWidth: curBarWidth } = plotConfig;
    if (this.props.barWidth) {
      curBarWidth = this.props.barWidth;
    }
    const difPath = new Path();
    const deaPath = new Path();
    const upPath = new Path();
    const downPath = new Path();

    if (indicatorData && domain && xScale && yScale) {
      const data = indicatorData[dataKey];
      if (data) {
        const { start, end } = domain;
        const screenData = data.slice(start, end + 1);
        const length = end - start + 1;
        let firstM = false;
        let firstS = false;
        for (let index = 0; index < length; index++) {
          const dataElem = screenData[index];
          if (dataElem) {
            if (dataElem.MACD === '-' || dataElem.MACD === undefined) {
              firstM = false;
            } else if (!firstM) {
              firstM = true;
              difPath.moveTo(xScale(index), yScale(dataElem.MACD));
            } else {
              difPath.lineTo(xScale(index), yScale(dataElem.MACD));
            }

            if (dataElem.signal === '-' || dataElem.signal === undefined) {
              firstS = false;
            } else if (!firstS) {
              firstS = true;
              deaPath.moveTo(xScale(index), yScale(dataElem.signal));
            } else {
              deaPath.lineTo(xScale(index), yScale(dataElem.signal));
            }

            if (dataElem.histogram === '-' || dataElem.histogram === undefined) {
              // do nothing
            } else if (dataElem.histogram >= 0) {
              // up
              upPath.moveTo(xScale(index) - curBarWidth / 2.0, yScale(0));
              upPath.lineTo(xScale(index) + curBarWidth / 2.0, yScale(0));
              upPath.lineTo(xScale(index) + curBarWidth / 2.0, yScale(dataElem.histogram));
              upPath.lineTo(xScale(index) - curBarWidth / 2.0, yScale(dataElem.histogram));
              upPath.lineTo(xScale(index) - curBarWidth / 2.0, yScale(0));
            } else {
              // down
              downPath.moveTo(xScale(index) - curBarWidth / 2.0, yScale(0));
              downPath.lineTo(xScale(index) + curBarWidth / 2.0, yScale(0));
              downPath.lineTo(xScale(index) + curBarWidth / 2.0, yScale(dataElem.histogram));
              downPath.lineTo(xScale(index) - curBarWidth / 2.0, yScale(dataElem.histogram));
              downPath.lineTo(xScale(index) - curBarWidth / 2.0, yScale(0));
            }
          }
        }
      }
    }
    return {
      difPath,
      deaPath,
      upPath,
      downPath,
    };
  }

  /**
   * 渲染函数
   *
   * @returns
   * @memberof MACD
   */
  render() {
    const { lineWidth, stroke } = this.props;
    const {
      upPath, downPath, difPath, deaPath,
    } = this._caculatePath();
    const { offset } = this.context;
    const transform = new Transform().translate(offset, 0);
    return (
      <Group>
        <Shape d={upPath} fill={stroke.Raise} transform={transform} />
        <Shape d={downPath} fill={stroke.Fall} transform={transform} />
        <Shape d={difPath} stroke={stroke.DIFF} strokeWidth={lineWidth} transform={transform} />
        <Shape d={deaPath} stroke={stroke.DEA} strokeWidth={lineWidth} transform={transform} />
      </Group>
    );
  }
}
