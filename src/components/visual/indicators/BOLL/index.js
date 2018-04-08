/**
 * BOLL指标线组件
 *
 * @author eric
 */

import React from 'react';
import { ART } from 'react-native';

import BaseIndicator from '../BaseIndicator';

const {
  Path, Shape, Group, Transform,
} = ART;

export default class BOLL extends BaseIndicator {
  /**
   * 计算绘制路径
   */
  _caculatePath = () => {
    let pathLower;
    let pathMiddle;
    let pathUpper;
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
            } else if (dataElem) {
              if (!firstValidValue) {
                firstValidValue = true;
                pathLower = Path().moveTo(xScale(index), yScale(dataElem.lower));
                pathMiddle = Path().moveTo(xScale(index), yScale(dataElem.middle));
                pathUpper = Path().moveTo(xScale(index), yScale(dataElem.upper));
              } else {
                pathLower.lineTo(xScale(index), yScale(dataElem.lower));
                pathMiddle.lineTo(xScale(index), yScale(dataElem.middle));
                pathUpper.lineTo(xScale(index), yScale(dataElem.upper));
              }
            }
          }
        }
      }
    }

    return [pathLower, pathMiddle, pathUpper];
  }

  /**
   * 渲染函数
   *
   * @returns
   * @memberof BOLL
   */
  render() {
    const { stroke, lineWidth } = this.props;
    const paths = this._caculatePath();
    const pathLower = paths[0];
    const pathMiddle = paths[1];
    const pathUpper = paths[2];
    const { offset } = this.context;
    const transform = new Transform().translate(offset, 0);
    return (
      <Group>
        <Shape d={pathLower} stroke={stroke.LOWER} strokeWidth={lineWidth} transform={transform} />
        <Shape d={pathMiddle} stroke={stroke.MID} strokeWidth={lineWidth} transform={transform} />
        <Shape d={pathUpper} stroke={stroke.UPPER} strokeWidth={lineWidth} transform={transform} />
      </Group>

    );
  }
}
