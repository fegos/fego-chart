/**
 * BoolTooltip
 */
import React, { Component } from 'react';
import BaseTooltip from '../BaseTooltip';

export default class BOLLTooltip extends Component {
  /**
   * 获取指标Key信息
   *
   * @memberof BOLLTooltip
   */
  formatIndicators = (indicators) => {
    const indicatorArr = Array.isArray(indicators) ? indicators : [indicators];
    const valueKeys = [];
    indicatorArr.forEach((indicator) => {
      const strokeArr = Object.keys(indicator.stroke);
      strokeArr.forEach((stroke) => {
        if (stroke === 'MID') stroke = 'middle';
        valueKeys.push(stroke.toLowerCase());
      });
    });
    return valueKeys;
  }

  /**
   * 渲染函数
   *
   * @returns
   * @memberof BOLLTooltip
   */
  render() {
    const valueKeys = this.formatIndicators(this.props.indicators);
    return (
      <BaseTooltip title="BOLL" type="group" valueKeys={valueKeys} {...this.props} />
    );
  }
}
