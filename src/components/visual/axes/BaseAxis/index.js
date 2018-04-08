/**
 * 抽象Axis类和helper函数
 *
 * TODO:
 * 通过scale生成ticks
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART } from 'react-native';
import moment from 'moment-timezone';

const {
  Path, Shape, Group, Text,
} = ART;


export default class BaseAxis extends Component {
  static defaultProps = {
    showGridLine: false,
    showTicks: false,
    strokeDash: null,

    textColor: 'gray',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 12,
  }

  static propTypes = {
    // type: XAxix|YAxis
    type: PropTypes.string.isRequired,
    // top|bottom|left|right
    position: PropTypes.string.isRequired,
    // 宽度
    strokeWidth: PropTypes.number.isRequired,
    // 虚线
    strokeDash: PropTypes.arrayOf(PropTypes.number),
    // 是否显示网格
    showGridLine: PropTypes.bool,
    // 是否显示坐标
    showTicks: PropTypes.bool,
    // 坐标字体大小
    fontSize: PropTypes.number,
    // 字体颜色
    textColor: PropTypes.string,
    // 字体粗细
    fontWeight: PropTypes.string,
    // 字体集
    fontFamily: PropTypes.string,
  }

  _caculateGridPath = () => {
    const { type } = this.props;
    const {
      xTicks, yTicks, frame, xScale, yScale,
    } = this.context;
    const path = Path();
    if (frame) {
      if (type === 'XAxis' && xTicks && xScale) {
        const ticksCount = xTicks.length;
        for (let index = 0; index < ticksCount; index++) {
          const tickIndex = xTicks[index];
          const x = xScale(tickIndex);
          path.moveTo(x, 0);
          path.lineTo(x, frame.height);
        }
      } else if (type === 'YAxis' && yTicks && yScale) {
        const ticksCount = yTicks.length;
        for (let index = 1; index < ticksCount - 1; index++) {
          const tickIndex = yTicks[index];
          const y = yScale(tickIndex);
          if (y) {
            path.moveTo(0, y);
            path.lineTo(frame.width, y);
          }
        }
      }
    }
    return path;
  }

  // showGridLine, stroke, strokeWidth, strokeDash,

  _renderGridLines = () => {
    const {
      showGridLine, stroke, strokeWidth, strokeDash,
    } = this.props;
    if (showGridLine) {
      const path = this._caculateGridPath();
      if (path) {
        const gridLines = (
          <Shape d={path} stroke={stroke} strokeDash={strokeDash} strokeWidth={strokeWidth} />
        );
        return gridLines;
      }
    }
    return null;
  }

  _renderTicks = () => {
    const {
      type, position, showTicks, textColor, fontFamily, fontWeight, fontSize,
    } = this.props;
    const {
      xScale, data, domain, frame, xTicks, yTicks, yScale, chartType, xDateTicks,
    } = this.context;
    const { start, end } = domain;
    const font = { fontFamily, fontWeight, fontSize };
    if (showTicks) {
      if (type === 'XAxis') {
        if (xTicks.length && data && data.length) {
          let ticks = [];
          if (chartType === 'timeline') {
            ticks = xTicks.map((tick, i) => {
              const centerX = xScale(tick);
              const text = xDateTicks[i];
              let x = centerX - 15;
              let y = 5;
              if (x < 10) {
                x = 10;
              }
              if (i === xTicks.length - 1) {
                x = centerX - 40;
              }
              if (position === 'bottom') {
                y = frame.height + 5;
              }
              const key = `text${i}`;

              return (
                <Text key={key} fill={textColor} font={font} x={x} y={y} >{text}</Text>
              );
            });
          } else {
            const actualData = data.slice(start, end);
            ticks = xTicks.map((tick, i) => {
              const centerX = xScale(tick);
              const text = actualData[tick][0];
              const x = centerX - 25;
              let y = 5;
              if (position === 'bottom') {
                y = frame.height + 5;
              }
              const key = `text${i}`;
              return (
                <Text key={key} fill={textColor} font={font} x={x} y={y} >{moment.tz(text, 'Asia/Shanghai').format('MM-DD HH:mm')}</Text>
              );
            });
          }
          return ticks;
        } else {
          return null;
        }
      } else if (type === 'YAxis') {
        const yTicksCount = yTicks.length;
        if (yTicksCount) {
          const ticks = yTicks.map((tick, i) => {
            let centerY = yScale(tick) - 7;
            if (i === 0) {
              centerY = yScale(tick) - 20;
            } else if (i === yTicksCount - 1) {
              centerY = yScale(tick) + 5;
            }
            let x = 15;
            if (position === 'right') {
              x = frame.width - 55;
            }
            const key = `text${i}`;
            return (
              <Text key={key} fill="gray" font="bold 12px Heiti SC" x={x} y={centerY} >{tick.toFixed(2)}</Text>
            );
          });
          return ticks;
        }
      }
    }
    return null;
  }

  render() {
    return (
      <Group>
        {this._renderGridLines()}
        {this._renderTicks()}
      </Group>
    );
  }
}

BaseAxis.contextTypes = {
  data: PropTypes.array,
  domain: PropTypes.object,
  frame: PropTypes.object,
  events: PropTypes.object,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  xTicks: PropTypes.array,
  yTicks: PropTypes.array,
  xDateTicks: PropTypes.array,
  chartType: PropTypes.string,
};
