/**
 * MACDTooltip
 */
import React, { Component } from 'react';
import BaseTooltip from '../BaseTooltip';

export default class macdTooltip extends Component {
  /**
   * 获取指标key、indicator信息
   *
   * @memberof macdTooltip
   */
  formatIndicators = (indicators) => {
    const indicatorArr = Array.isArray(indicators) ? indicators : [indicators];
    const valueKeys = [];
    let tempIndicators = [];
    tempIndicators = JSON.parse(JSON.stringify(indicatorArr));
    indicatorArr.forEach((indicator, idx) => {
      const strokeArr = Object.keys(indicator.stroke);
      strokeArr.forEach((stroke) => {
        switch (stroke) {
          case 'MACD':
            valueKeys.push('histogram');
            break;
          case 'DIFF':
            valueKeys.push('MACD');
            break;
          case 'DEA':
            valueKeys.push('signal');
            break;
          default:
            delete tempIndicators[idx].stroke[stroke];
            break;
        }
      });
    });
    return [valueKeys, tempIndicators];
  }

  /**
   * 渲染函数
   *
   * @returns
   * @memberof macdTooltip
   */
  render() {
    const res = this.formatIndicators(this.props.indicators);
    const valueKeys = res[0];
    const indicators = res[1];
    return (
      <BaseTooltip title="MACD" type="group" valueKeys={valueKeys} {...this.props} indicators={indicators} />
    );
  }
}
