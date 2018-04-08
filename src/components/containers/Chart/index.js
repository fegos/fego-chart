/**
 * Chart组件
 *
 * @author eric
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ART } from 'react-native';
import flattendeep from 'lodash.flattendeep';
import { calculateYScale } from '../../../scale';
import { getCurrentItem, CalculateUtil } from '../../../util';

const { Surface, Group } = ART;


export default class Chart extends Component {
  /**
   * 组件属性区
   *
   * @static
   * @memberof Chart
   */
  static defaultProps = {
    indicators: [],
    insetBottom: 0,
    yAxisMargin: 0,
    yGridNum: 4,
    minValueGap: 0.01,
  }

  static propsType = {
    // 数据选择器
    yExtents: PropTypes.arrayOf(PropTypes.func).isRequired,
    // Chart中包含的指标Keys
    indicators: PropTypes.array,
    // 底部缩进距离
    insetBottom: PropTypes.number,
    // Y轴极值距边界的距离
    yAxisMargin: PropTypes.number,
    // Y轴网格的数量
    yGridNum: PropTypes.number,
    // 网格线之间最小数值差
    minValueGap: PropTypes.number,
  }

  /**
   * 构造方法+类变量+组件状态
   * @param {any} props
   * @memberof Chart
   */
  constructor(props) {
    super(props);
    this._frame = {
      x: 0, y: 0, width: 0, height: 0,
    };
    this.state = {
      yScale: null,
      yTicks: [],
      maxValue: null,
      minValue: null,
    };
  }

  /**
   * context
   *
   * @returns
   * @memberof Chart
   */
  getChildContext() {
    const { yScale, yTicks, currentItem } = this.state;
    const { _frame } = this;
    return {
      frame: _frame,
      yScale,
      yTicks,
      currentItem,
    };
  }

  /**
   * 生命周期
   *
   * @memberof Chart
   */
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext) {
      const {
        data, domain, events, xScale, pressHandler,
      } = nextContext;
      const { chartKey } = nextProps;
      this._updateYScale(nextContext, nextProps);
      const { longPressEvent, pressEvent } = events;
      if (longPressEvent && data && domain) {
        const actualData = data.slice(domain.start, domain.end + 1);
        const currentItemIdx = getCurrentItem(xScale, null, [longPressEvent.x, longPressEvent.y], actualData, 'index');
        const currentItem = {
          x: xScale(currentItemIdx),
          y: longPressEvent.y,
        };
        this.setState({
          currentItem,
        });
      }
      if (pressEvent) {
        const {
          x, y, height, width,
        } = this._frame;
        if (pressEvent.x > x && pressEvent.x < x + width &&
          pressEvent.y > y && pressEvent.y < y + height) {
          if (pressHandler) {
            pressHandler(pressEvent, chartKey);
          }
        }
      }
    }
  }

  /**
   * 更新布局信息
   *
   * @memberof Chart
   */
  _updateFrame = (e) => {
    const { insetBottom } = this.props;
    const {
      x, y, width, height,
    } = e.nativeEvent.layout;
    this._frame = {
      x, y, width, height: height - insetBottom,
    };
    this._updateYScale(this.context, this.props, true);
  }

  /**
   * 更新Y轴value到坐标的映射函数
   *
   * @memberof Chart
   */
  _updateYScale = (context, props, forceUpdate = false) => {
    const { data, domain } = context;
    const { yGridNum, yAxisMargin, chartKey } = props;
    if (data && data.length && domain && this._frame && this._frame.height) {
      let { max, min } = this._calcLimitValue(context, props);
      const { maxValue, minValue } = this.state;
      if (!forceUpdate &&
        max === maxValue &&
        min === minValue) {
        return;
      }
      this._updateLimitValue(max, min);
      let gap = max - min;
      max += yAxisMargin / (this._frame.height - 2 * yAxisMargin) * gap;
      min -= yAxisMargin / (this._frame.height - 2 * yAxisMargin) * gap;
      gap = max - min;
      const item = gap / yGridNum;
      const yTicks = [];
      for (let index = 0; index < yGridNum + 1; index++) {
        if (!(chartKey === 'tech' && yGridNum === 2 && index === 1)) {
          yTicks.push(min + index * item);
        }
      }
      const limitData = [min, max];
      this.setState({
        yScale: calculateYScale(limitData, { chartHeight: this._frame.height }),
        yTicks,
      });
    }
  }

  /**
   * 更新极值
   *
   * @memberof Chart
   */
  _updateLimitValue = (max, min) => {
    this.setState({
      maxValue: max,
      minValue: min,
    });
  }

  /**
   * 计算极值
   *
   * @memberof Chart
   */
  _calcLimitValue = (context, props) => {
    const { data, indicatorData, domain } = context;
    const { chartType, preClosedPrice } = this.context;
    const {
      yExtents, indicators, minValueGap, yGridNum,
    } = props;
    const { start, end } = domain;
    let max = Number.MIN_VALUE;
    let min = Number.MAX_VALUE;
    let screenData;
    let yValues = [];
    if (chartType === 'timeline') {
      screenData = data;
    } else {
      screenData = data.slice(start, end + 1);
    }
    if (Array.isArray(yExtents) && yExtents.length) {
      yValues = yExtents.map(extent => screenData.map(this.calculateValues(extent)));
    }
    if (Array.isArray(indicators) && indicatorData) {
      yValues = yValues.concat(indicators.map((dataKey) => {
        const indicatorDataElem = indicatorData[dataKey];
        if (indicatorDataElem) {
          let screenIndicatorData = indicatorDataElem.slice(start, end + 1);
          screenIndicatorData = CalculateUtil.enumerateIndicator(screenIndicatorData);
          return screenIndicatorData;
        }
        return '-';
      }));
    }
    const allValues = flattendeep(yValues);

    allValues.forEach((value) => {
      if (value !== '-') {
        if (value > max) {
          max = value;
        }
        if (value < min) {
          min = value;
        }
      }
    });

    if (chartType === 'timeline') {
      const gapValue = Math.max(Math.abs(max - preClosedPrice), Math.abs(min - preClosedPrice));
      max = preClosedPrice + gapValue;
      min = preClosedPrice - gapValue;
    }

    if (max === Number.MIN_VALUE &&
      min === Number.MAX_VALUE) {
      max = 0;
      min = 0;
    }

    let gap = 0;
    const totalMinValueGap = minValueGap * yGridNum;
    if (max - min < totalMinValueGap) {
      gap = totalMinValueGap / 2;
    }

    max += gap;
    min -= gap;

    return { max, min };
  }

  /**
   * 获取目标数据
   *
   * @memberof Chart
   */
  calculateValues = func => (d) => {
    const obj = typeof func === 'function' ? func(d) : func;
    const dataArray = (typeof obj === 'object' && !Array.isArray(obj)) ? Object.keys(obj).map(key => obj[key]) : obj;
    return dataArray;
  }


  /**
   * 渲染区
   *
   * @returns
   * @memberof Chart
   */
  render() {
    const { width, height } = this._frame;
    const { children } = this.props;
    return (
      <View
        style={this.props.style}
        onLayout={(e) => {
          this._updateFrame(e);
        }}
      >
        <Surface width={width} height={height + this.props.insetBottom} style={{ position: 'relative' }}>
          <Group>
            {children}
          </Group>
        </Surface>
      </View>
    );
  }
}

Chart.contextTypes = {
  data: PropTypes.array,
  chartType: PropTypes.string,
  preClosedPrice: PropTypes.number,
  indicatorData: PropTypes.object,
  domain: PropTypes.object,
  events: PropTypes.object,
  xTicks: PropTypes.array,
  xScale: PropTypes.func,
  pressHandler: PropTypes.func,
};

Chart.childContextTypes = {
  frame: PropTypes.object,
  yScale: PropTypes.func,
  yTicks: PropTypes.array,
  currentItem: PropTypes.object,
};

