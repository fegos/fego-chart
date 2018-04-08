/**
 * RSI指标线组件
 * @author eric
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ART, StyleSheet } from 'react-native';

import BaseIndicator from '../BaseIndicator';

const {
  Path, Shape, Group, Transform,
} = ART;


export default class RSI extends BaseIndicator {
  /**
   * 组件属性
   *
   * @static
   * @memberof RSI
   */
  static defaultProps = {
    lineWidth: StyleSheet.hairlineWidth,
  }

  static propsType = {
    // 指标Key
    dataKey: PropTypes.string.isRequired,
    // 线条颜色
    stroke: PropTypes.string.isRequired,
    // 线条粗细
    lineWidth: PropTypes.number,
  }

  /**
   * 计算绘制路径
   */
  _caculatePath = () => {
    let path;
    const { dataKey } = this.props;
    const {
      indicatorData, domain, xScale, yScale,
    } = this.context;
    if (indicatorData && domain && xScale && yScale) {
      const { start, end } = domain;
      const data = indicatorData[dataKey];
      if (data) {
        const screenData = data.slice(start, end + 1);
        let firstValidValue = false;
        if (screenData) {
          const length = end - start + 1;
          for (let index = 0; index < length; index++) {
            const dataElem = screenData[index];
            if (dataElem === '-') {
              firstValidValue = false;
            } else if (!firstValidValue) {
              firstValidValue = true;
              path = Path().moveTo(xScale(index), yScale(dataElem));
            } else {
              path.lineTo(xScale(index), yScale(dataElem));
            }
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
   * @memberof RSI
   */
  render() {
    const { stroke, lineWidth } = this.props;
    const path = this._caculatePath();
    const { offset } = this.context;
    const transform = new Transform().translate(offset, 0);
    return (
      <Group>
        <Shape d={path} stroke={stroke} strokeWidth={lineWidth} transform={transform} />
      </Group>
    );
  }
}
