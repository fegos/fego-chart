/**
 * BaseAxis: 负责Axis的具体绘制工作
 * @author 徐达迟
 *
 * TODO:
 * 1.分离axisLine,gridLine,tickLine,tickLabel的绘制
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleTime } from 'd3-scale';
import { ticks, range } from 'd3-array';
import { week } from 'd3-time';
import moment from 'moment';
import { calcOffset, getCurrentItem } from '../../common/helper';

class BaseAxis extends Component {
  static defaultProps = {
    tickNums: 5,
    tickLineLength: 5,
    XAxisTickLabelOffset: [15, 10],
    YAxisTickLabelOffset: {
      left: [35, 5],
      right: [10, 5],
    },
  }

  constructor(props) {
    super(props);
    this.cache = {
      axisLinePos: [],
    };
  }

  componentDidMount() {
    this.drawAxis(this.props, this.context);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.drawAxis(nextProps, nextContext);
  }

  // 绘制坐标轴Wrapper
  drawAxis = (props, chartContext) => {
    const {
      min, max, tickNums, tickValues
    } = props;
    const { yScale } = chartContext;
    if (min && max && yScale) {
      yScale.domain([min, max]);
    }
    this.drawAxisLine(props, chartContext);
    if (tickValues) {
      this.drawFixedAxisTicks(props, chartContext);
    } else {
      this.drawAxisTicks(props, chartContext);
    }
  }

  // 绘制轴线
  drawAxisLine = (props, chartContext) => {
    const { axisAt, type } = props;
    const { context, containerFrame, chartFrame } = chartContext;
    if (!context) return;
    context.save();
    let xBeg,
      xEnd,
      yBeg,
      yEnd;
    const offsets = calcOffset(containerFrame, chartFrame);
    if (type === 'XAxis') {
      context.beginPath();
      xBeg = offsets[0];
      xEnd = containerFrame.width - containerFrame.padding.right;
      if (axisAt === 'bottom') {
        yBeg = offsets[1] + chartFrame.height;
      } else if (axisAt === 'top') {
        yBeg = offsets[1];
      }
      yEnd = yBeg;
    } else if (type === 'YAxis') {
      context.beginPath();
      yBeg = offsets[1];
      yEnd = offsets[1] + chartFrame.height;
      if (axisAt === 'left') {
        xBeg = offsets[0];
      } else if (axisAt === 'right') {
        xBeg = offsets[0] + containerFrame.chartWidth;
      }
      xEnd = xBeg;
    }
    context.moveTo(xBeg, yBeg);
    context.lineTo(xEnd, yEnd);
    context.stroke();
    context.restore();
    this.cache.axisLinePos = [xBeg, yBeg, xEnd, yEnd];
  }

  // 绘制GridLine
  drawGridLines = () => {
  }

  // 绘制刻度线
  drawTickLines = () => {
  }

  // 绘制刻度Label
  drawTickLabels = () => {
  }

  // 绘制单个刻度Wrapper
  drawEachTick = (tick, props, chartContext, showGridLine) => {
    if (!tick) return;
    const { type } = props;
    const { context, containerFrame, chartFrame } = chartContext;
    const offsets = calcOffset(containerFrame, chartFrame);
    context.save();
    context.beginPath();
    context.moveTo(tick.x1, tick.y1);
    context.lineTo(tick.x2, tick.y2);
    context.closePath();
    context.fillText(tick.text, tick.textX, tick.textY);
    context.stroke();
    if (showGridLine) {
      context.strokeStyle = '#DDD';
      context.beginPath();
      if (type === 'XAxis') {
        context.moveTo(tick.x1, tick.y1);
        context.lineTo(tick.x1, tick.y1 - chartFrame.height);
      } else {
        context.moveTo(tick.x1 + (props.axisAt === 'left' ? containerFrame.chartWidth : -containerFrame.chartWidth), tick.y1);
        context.lineTo(tick.x1, tick.y1);
      }
      context.stroke();
      context.closePath();
    }
    context.restore();
  }

  // 绘制固定ticks(设定tickValues时)
  drawFixedAxisTicks = (props, chartContext) => {
    const {
      axisAt, tickValues: originTickValues, scale, type, showGridLine, XAxisTickLabelOffset, tickPos
    } = props;
    const { containerFrame, chartFrame, context } = chartContext;
    if (!context || !originTickValues) return;
    const offsets = calcOffset(containerFrame, chartFrame);
    if (type === 'XAxis') {
      // 按照X周长度均分ticks
      const ticksPos = [];
      let tickValues;
      let tickObj = {};
      const { width, padding } = containerFrame;
      const { origin, height: currChartHeight } = chartFrame;
      tickValues = Array.from(originTickValues);
      if (tickPos === 'center') {
        tickValues.push('');
      }
      const centerPosOffset = tickPos === 'center' ? (width - padding.left - padding.right) / (2 * (tickValues.length - 1)) : 0;
      for (let i = 0; i < tickValues.length; i++) {
        const tickX = padding.left + i * ((width - padding.left - padding.right) / (tickValues.length - 1));
        const tickYBase = origin[1] + currChartHeight + offsets[1];
        tickObj = {
          x1: tickX,
          y1: tickYBase,
          x2: tickX,
          y2: tickYBase + 10,
          textX: tickX - 12 + centerPosOffset,
          textY: tickYBase + 10 + XAxisTickLabelOffset[1],
          text: tickValues[i],
        };
        ticksPos.push(Object.assign({}, tickObj));
      }
      ticksPos.map((tp) => {
        this.drawEachTick(tp, props, chartContext, showGridLine);
      });
    }
  }

  // 绘制所有刻度Wrapper
  drawAxisTicks = (props, chartContext) => {
    if (!props.showTicks) return;
    const {
      showGridLine, min, max, tickNums, tickValues
    } = props;
    const { scale } = this.props;
    if (scale && typeof scale === 'function') {
      let ticks;
      // 设置了最小值和最大值
      if (min && max && tickNums) {
        ticks = range(min, max + 1, (max - min) / (tickNums - 1));
      } else {
        ticks = scale.ticks(tickNums);
      }
      const ticksPos = ticks.map((tick) => this.calcTickPos(tick, props, chartContext));
      ticksPos.map((tp) => {
        this.drawEachTick(tp, props, chartContext, showGridLine);
      });
    }
  }

  // 计算tick刻度以及label坐标
  calcTickPos = (tick, props, chartContext) => {
    const tickObject = {};
    const {
      scale, axisAt, tickLineLength, XAxisTickLabelOffset, YAxisTickLabelOffset, tickFormat, preClosedPrice
    } = props;
    const {
      context, containerFrame, chartFrame, plotData, xScale
    } = chartContext;
    const { axisLinePos } = this.cache;
    if (props.type === 'XAxis' && scale) {
      const tickX = scale(tick);
      const currentItemIdx = getCurrentItem(xScale, null, [tickX], plotData.currentData, 'index');
      const currentItem = plotData.currentData[currentItemIdx];
      if (!currentItem) return null;
      tickObject.x1 = tickX + axisLinePos[0];
      tickObject.y1 = axisLinePos[1];
      tickObject.x2 = tickObject.x1;
      tickObject.y2 = tickObject.y1 + tickLineLength;
      tickObject.text = String(moment(currentItem[0]).format('YYYY/MM/DD'));
      const textMetrics = context.measureText(tickObject.text);
      tickObject.textX = tickObject.x1 - textMetrics.width / 2;
      tickObject.textY = tickObject.y2 + XAxisTickLabelOffset[1];
    } else if (props.type === 'YAxis' && scale) {
      const tickY = scale(tick);
      tickObject.x1 = axisLinePos[0];
      tickObject.y1 = axisLinePos[1] + tickY;
      tickObject.x2 = tickObject.x1 - (axisAt === 'left' ? tickLineLength : -tickLineLength);
      tickObject.y2 = tickObject.y1;
      tickObject.textX = tickObject.x2 - (axisAt === 'left' ? YAxisTickLabelOffset.left[0] : -YAxisTickLabelOffset.right[0]);
      tickObject.textY = tickObject.y2 + YAxisTickLabelOffset.left[1];
      let showPercent;
      if (tickFormat) showPercent = tickFormat.showPercent;
      if (showPercent && !isNaN(preClosedPrice) && (+preClosedPrice !== 0)) {
        tickObject.text = `${(100 * (tick - preClosedPrice) / preClosedPrice).toFixed(2)}%`;
      } else {
        tickObject.text = tick.toFixed(2);
      }
    }
    return tickObject;
  }

  render() {
    return null;
  }
}

BaseAxis.propTypes = {
};

BaseAxis.contextTypes = {
  context: PropTypes.object,
  plotData: PropTypes.object,
  containerFrame: PropTypes.object,
  chartFrame: PropTypes.object,
  events: PropTypes.object,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export default BaseAxis;
