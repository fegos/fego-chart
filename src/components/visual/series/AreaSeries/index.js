/**
 * 线图组件
 *
 * @author eric
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ART } from 'react-native';

import LineSeries from '../LineSeries';

const { Path, Shape, Group } = ART;

export default class AreaSeries extends LineSeries {
  /**
   * 组件属性
   *
   * @static
   * @memberof AreaSeries
   */
  static propsType = {
    // 上涨浅色
    lightRiseColor: PropTypes.string.isRequired,
    // 下跌浅色
    lightFallColor: PropTypes.string.isRequired,
  }

  /**
   * 计算路径
   *
   * @memberof AreaSeries
   */
  _caculatePath = () => {
    this._linePath = Path();
    this._gradientPath = Path();
    const { yExtents, dataKey } = this.props;
    const {
      xScale, yScale, data, domain, frame,
    } = this.context;
    if (data && domain && xScale && yScale && yExtents && frame && frame.width) {
      const actualData = data;
      if (actualData && yScale) {
        const { length } = actualData;
        let firstData = true;
        let firstX = 0;
        for (let index = 0; index < length; index++) {
          const dataElem = yExtents(actualData[index]);
          const x = xScale(index);
          const y = yScale(dataElem);
          if (!Number.isNaN(x) && !Number.isNaN(y)) {
            if (firstData) {
              firstData = false;
              this._linePath.moveTo(x, y);
              this._gradientPath.moveTo(x, y);
              firstX = x;
            } else {
              this._linePath.lineTo(x, y);
              this._gradientPath.lineTo(x, y);
              if (index === length - 1 && dataKey === 'timeline') {
                const xPos = xScale(length - 1);
                const yPos = frame.height;
                this._gradientPath.lineTo(xPos, yPos);
                this._gradientPath.lineTo(firstX, yPos);
                this._gradientPath.close();
              }
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
   * @memberof AreaSeries
   */
  render() {
    const {
      lineColor, lineWidth, riseColor, fallColor, dataKey, yExtents, lightRiseColor, lightFallColor,
    } = this.props;
    const { data, preClosedPrice, frame } = this.context;
    let strokeColor = lineColor;

    let gradientLayer = null;
    this._caculatePath();
    if (dataKey === 'timeline') {
      if (data) {
        let lightColor = null;
        let lastItem = data[data.length - 1];
        lastItem = yExtents(lastItem);
        if (lastItem < preClosedPrice) {
          strokeColor = fallColor;
          lightColor = lightFallColor;
        } else {
          strokeColor = riseColor;
          lightColor = lightRiseColor;
        }
        const linearGradient = new ART.LinearGradient({
          0: strokeColor,
          1: lightColor,
        }, 0, 0, 0, frame.height);
        gradientLayer = <Shape d={this._gradientPath} fill={linearGradient} />;
      }
    }
    return (
      <Group>
        {gradientLayer}
        <Shape d={this._linePath} stroke={strokeColor} strokeWidth={lineWidth} />
      </Group>
    );
  }
}
