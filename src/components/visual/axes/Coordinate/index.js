/**
 * 坐标组件
 *
 * @author eric
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART } from 'react-native';

import moment from 'moment-timezone';
import { getTimestamp } from '../../../../util';

const { Group, Text } = ART;

export default class Coordinate extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof Coordinate
   */
  static defaultProps = {
    isTimestamp: true,
    dateFormat: 'MM-DD HH:mm',
    timezone: 'Asia/Shanghai',
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    fontSize: 9,
    color: '#8F8F8F',
    riseColor: '#F05B48',
    fallColor: '#10BC90',
    tickOffsetX: 10,
    tickOffsetY: 5,
    leftOffset: 5,
    rightOffset: 5,
    topOffset: 5,
    bottomOffset: 10,
    tickHeight: 15,
    tickWidth: 35,
    isTickCenter: false,
  }

  static propTypes = {
    // top|bottom|left|right
    position: PropTypes.string.isRequired,
    // 是否是时间戳
    isTimestamp: PropTypes.bool,
    // 日期格式
    dateFormat: PropTypes.string,
    // 时区
    timezone: PropTypes.string,
    // 字体大小
    fontSize: PropTypes.number,
    // 字体集
    fontFamily: PropTypes.string,
    // 字重
    fontWeight: PropTypes.string,
    // 字体颜色
    color: PropTypes.string,
    // 上涨字体颜色
    riseColor: PropTypes.string,
    // 下跌字体颜色
    fallColor: PropTypes.string,
    // tick宽度
    tickWidth: PropTypes.number,
    // tick高度
    tickHeight: PropTypes.number,
    // x轴ticks偏移量
    tickOffsetX: PropTypes.number,
    // y轴ticks偏移量
    tickOffsetY: PropTypes.number,
    // 左侧offset
    leftOffset: PropTypes.number,
    // 右侧offset
    rightOffset: PropTypes.number,
    // 顶部offset
    topOffset: PropTypes.number,
    // 底部offset
    bottomOffset: PropTypes.number,
    // tick位置是否居中
    isTickCenter: PropTypes.bool,

  }

  /**
   * 生命周期
   *
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let shouldUpdate = false;
    const testNumber = 10;
    const { props, context } = this;
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      shouldUpdate = true;
    } else if (props.position === 'left' ||
      props.position === 'right') {
      const { yScale: preYScale } = context;
      const { yScale } = nextContext;
      if (yScale === null || preYScale === null) {
        shouldUpdate = true;
      } else if (preYScale(testNumber) !== yScale(testNumber) ||
        JSON.stringify(context.yTicks) !== JSON.stringify(nextContext.yTicks) ||
        JSON.stringify(context.frame) !== JSON.stringify(nextContext.frame)) {
        shouldUpdate = true;
      }
    } else if (props.position === 'top' ||
      props.position === 'bottom') {
      const { xScale: preXScale } = context;
      const { xScale } = nextContext;
      if ((xScale === null || preXScale === null) && xScale !== preXScale) {
        shouldUpdate = true;
      } else if (context.xScale(testNumber) !== nextContext.xScale(testNumber) ||
        JSON.stringify(context.data) !== JSON.stringify(nextContext.data) ||
        JSON.stringify(context.frame) !== JSON.stringify(nextContext.frame) ||
        JSON.stringify(context.domain) !== JSON.stringify(nextContext.domain) ||
        JSON.stringify(context.xTicks) !== JSON.stringify(nextContext.xTicks)) {
        shouldUpdate = true;
      }
    }
    return shouldUpdate;
  }

  /**
   * 更新坐标信息
   */
  _updateTicksInfo = () => {
    const {
      position, preClosedPrice, isTimestamp, dateFormat, timezone, color, riseColor, fallColor, fontFamily, fontWeight, fontSize,
      topOffset, leftOffset, rightOffset, bottomOffset, tickOffsetX, tickOffsetY,
      tickHeight, tickWidth, isTickCenter,
    } = this.props;
    const {
      data, domain, xScale, yScale, frame, xTicks, yTicks, xDateTicks, offset,
    } = this.context;
    const font = { fontFamily, fontWeight, fontSize };
    let ticks = null;
    if (position === 'left' || position === 'right') {
      if (yScale && yTicks && frame && frame.height && frame.width) {
        const yTicksCount = yTicks.length;
        if (yTicksCount) {
          ticks = yTicks.map((tick, i) => {
            let y = yScale(tick) - tickOffsetY;
            if (i === 0) {
              y -= tickHeight;
            } else if (i === yTicksCount - 1) {
              y += tickHeight;
            }
            let x = leftOffset;
            if (position === 'right') {
              x = frame.width - tickWidth;
            }
            let tickTextColor = color;
            if (preClosedPrice && !Number.isNaN(+preClosedPrice)) {
              if (+tick < +preClosedPrice) tickTextColor = fallColor;
              if (+tick > +preClosedPrice) tickTextColor = riseColor;
              if (position === 'right') {
                tick = (tick - preClosedPrice) / preClosedPrice * 100;
                tick = `${tick.toFixed(2)}%`;
              } else {
                tick = tick.toFixed(2);
              }
            } else {
              tick = tick.toFixed(2);
            }
            const key = `text${i}`;
            return (
              <Text key={key} fill={tickTextColor} font={font} x={x} y={y} >{tick}</Text>
            );
          });
        }
      }
    } else if (position === 'top' || position === 'bottom') {
      if (xScale && xTicks && xTicks.length && data && data.length && domain && frame && frame.width) {
        const { start, end } = domain;
        if (xDateTicks && xDateTicks.length) {
          ticks = xTicks.map((tick, i) => {
            const centerX = xScale(tick);
            const text = xDateTicks[i];
            let x;
            let y;
            x = centerX - tickOffsetX + offset;
            y = topOffset;
            if (x < leftOffset) {
              x = leftOffset;
            }
            if (!isTickCenter && i === xTicks.length - 1) {
              x = centerX - rightOffset - tickWidth;
            }
            if (position === 'bottom') {
              y = frame.height + bottomOffset;
            }
            const key = `text${i}`;
            return (
              <Text key={key} fill={color} font={font} x={x} y={y} >{text}</Text>
            );
          });
        } else {
          const actualData = data.slice(start, end);
          if (actualData) {
            ticks = xTicks.map((tick, i) => {
              const centerX = xScale(tick);
              if (actualData[tick]) {
                let text = actualData[tick][0];
                if (isTimestamp) {
                  text = moment.tz(text, timezone).format(dateFormat);
                } else {
                  const timestamp = getTimestamp(text, timezone);
                  text = moment.tz(timestamp, timezone).format(dateFormat);
                }
                const x = centerX - tickOffsetX + offset;
                let y = topOffset;
                if (position === 'bottom') {
                  y = frame.height + bottomOffset;
                }
                const key = `text${i}`;
                return (
                  <Text key={key} fill={color} font={font} x={x} y={y} >{text}</Text>
                );
              }
              return null;
            });
          }
        }
      }
    }
    return ticks;
  }

  /**
   * 绘制区
   *
   * @returns
   * @memberof Coordinate
   */
  render() {
    const ticks = this._updateTicksInfo();
    return (
      <Group>
        {ticks}
      </Group>
    );
  }
}

Coordinate.contextTypes = {
  data: PropTypes.array,
  domain: PropTypes.object,
  frame: PropTypes.object,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  xTicks: PropTypes.array,
  yTicks: PropTypes.array,
  xDateTicks: PropTypes.array,
  offset: PropTypes.number,
};
