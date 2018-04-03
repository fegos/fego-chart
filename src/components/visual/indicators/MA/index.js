/**
 * MA指标线组件
 * @author eric
 */

import React from 'react';
import { ART } from 'react-native';

import BaseIndicator from '../BaseIndicator';

const {
  Path, Shape, Transform,
} = ART;

export default class MA extends BaseIndicator {
  /**
   * 计算绘制路径
   */
  _caculatePath = () => {
    const path = Path();
    const { dataKey } = this.props;
    const {
      indicatorData, domain, xScale, yScale,
    } = this.context;
    if (indicatorData && domain && xScale && yScale) {
      const { start, end } = domain;
      const data = indicatorData[dataKey];
      if (data) {
        const screenData = indicatorData[dataKey].slice(start, end + 1);
        let firstValidValue = false;
        if (screenData) {
          const length = end - start + 1;
          for (let index = 0; index < length; index++) {
            const dataElem = screenData[index];
            if (dataElem === '-') {
              firstValidValue = false;
            } else {
              const x = xScale(index);
              const y = yScale(dataElem);
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

  /**
   * 渲染函数
   *
   * @returns
   * @memberof MA
   */
  render() {
    const path = this._caculatePath();
    const { stroke, lineWidth } = this.props;
    const { offset } = this.context;
    const transform = new Transform().translate(offset, 0);
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
