/**
 * KDJ指标线组件
 *
 * @author eric
 */

import React from 'react';
import { ART, StyleSheet } from 'react-native';

import BaseIndicator from '../BaseIndicator';

const {
  Path, Shape, Group, Transform,
} = ART;

export default class KDJ extends BaseIndicator {
  /**
   * 组件属性
   *
   * @static
   * @memberof KDJ
   */
  static defaultProps = {
    lineWidth: StyleSheet.hairlineWidth,
  }

  /**
   * 计算绘制路径
   */
  _caculatePath = () => {
    let pathK;
    let pathD;
    let pathJ;
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
              if (this._isValidNum(dataElem)) {
                if (!firstValidValue) {
                  firstValidValue = true;
                  pathK = Path().moveTo(xScale(index), yScale(dataElem.k));
                  pathD = Path().moveTo(xScale(index), yScale(dataElem.d));
                  pathJ = Path().moveTo(xScale(index), yScale(dataElem.j));
                } else {
                  pathK.lineTo(xScale(index), yScale(dataElem.k));
                  pathD.lineTo(xScale(index), yScale(dataElem.d));
                  pathJ.lineTo(xScale(index), yScale(dataElem.j));
                }
              }
            }
          }
        }
      }
    }
    return { pathK, pathD, pathJ };
  }

  /**
   * 判读目标数据是否为有效数据
   *
   * @memberof KDJ
   */
  _isValidNum = (dataElem) => {
    let isValid = true;
    Object.keys(dataElem).forEach((key) => {
      const value = dataElem[key];
      if (value === undefined ||
        value === null ||
        Number.isNaN(value)) {
        isValid = false;
      }
    });
    return isValid;
  }

  /**
   * 渲染函数
   *
   * @returns
   * @memberof KDJ
   */
  render() {
    const { stroke, lineWidth } = this.props;
    const { pathK, pathD, pathJ } = this._caculatePath();
    const { offset } = this.context;
    const transform = new Transform().translate(offset, 0);
    return (
      <Group>
        <Shape d={pathK} stroke={stroke.K} strokeWidth={lineWidth} transform={transform} />
        <Shape d={pathD} stroke={stroke.D} strokeWidth={lineWidth} transform={transform} />
        <Shape d={pathJ} stroke={stroke.J} strokeWidth={lineWidth} transform={transform} />
      </Group>
    );
  }
}
