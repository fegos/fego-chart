/**
 * 指标组件基类
 *
 * @author eric
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

export default class BaseIndicator extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof BaseIndicator
   */
  static defaultProps = {
    lineWidth: 1,
  }

  static propsType = {
    // 指标Key
    dataKey: PropTypes.string.isRequired,
    // 线条颜色
    stroke: PropTypes.object.isRequired,
    // 线条粗细
    lineWidth: PropTypes.number,
  }

  /**
   * 生命周期
   *
   * @memberof BaseIndicator
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {
      data: preData, domain: preDomain, xScale: preXScale, yScale: preYScale,
    } = this.context;
    const {
      data, domain, xScale, yScale,
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
      preXScale(testNumber) !== xScale(testNumber) ||
      preYScale(testNumber) !== yScale(testNumber)) {
      return true;
    }
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      return true;
    }
    return false;
  }

  /**
   * 渲染区，具体有子组件实现
   *
   * @returns
   * @memberof BaseIndicator
   */
  render() {
    return null;
  }
}


BaseIndicator.contextTypes = {
  indicatorData: PropTypes.object,
  plotConfig: PropTypes.object,
  domain: PropTypes.object,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  offset: PropTypes.number,
};
