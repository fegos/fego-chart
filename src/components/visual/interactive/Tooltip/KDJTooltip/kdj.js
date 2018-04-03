/**
 * KDJTooltip
 */
import React, { Component } from 'react';
import BaseTooltip from '../BaseTooltip';

export default class KDJTooltip extends Component {
  /**
   * 获取指标Key
   *
   * @memberof KDJTooltip
   */
  formatIndicators = (indicators) => {
    const indicatorArr = Array.isArray(indicators) ? indicators : [indicators];
    const valueKeys = [];
    let tempIndicators = [];
    tempIndicators = JSON.parse(JSON.stringify(indicatorArr));
    indicatorArr.forEach((indicator, idx) => {
      const strokeArr = Object.keys(indicator.stroke);
      delete tempIndicators[idx].params.high;
      delete tempIndicators[idx].params.low;
      delete tempIndicators[idx].params.close;
      strokeArr.forEach((stroke) => {
        valueKeys.push(stroke.toLowerCase());
      });
    });
    return [valueKeys, tempIndicators];
  }

  /**
   * 渲染函数
   *
   * @returns
   * @memberof KDJTooltip
   */
  render() {
    const res = this.formatIndicators(this.props.indicators);
    const valueKeys = res[0];
    const indicators = res[1];
    return (
      <BaseTooltip title="KDJ" type="group" valueKeys={valueKeys} {...this.props} indicators={indicators} />
    );
  }
}
