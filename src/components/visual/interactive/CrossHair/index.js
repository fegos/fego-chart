/**
 * 十字线组件
 *
 * @author: Xu Dachi、eric
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART, StyleSheet } from 'react-native';
import moment from 'moment-timezone';
import { getCurrentItem, getTimestamp } from '../../../../util';
import { isDotInsideChart } from '../../../../util/helper';


const {
  Shape, Group, Text,
} = ART;


export default class CrossHair extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof CrossHair
   */
  static defaultProps = {
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    fontSize: 10,
    fontColor: 'gray',
    riseFontColor: '#F45642',
    fallFontColor: '#42F486',
    leftOffset: 0,
    rightOffset: 0,
    topOffset: 0,
    bottomOffset: 0,
    horLineVerPadding: 20,
    horLabelHeight: 20,
    horLabelWidth: 40,
    horSubLabelWidth: 40,
    horLabelYOffset: 3,
    horLabelXOffset: 3,
    verLabelYOffset: 3,
    verLabelXOffset: 3,
    verLabelHeight: 18,
    verLabelWidth: 58,
    fillColor: '#31323A',
    borderColor: '#78797E',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    lineColor: 'gray',
    lineWidth: StyleSheet.hairlineWidth,

    preClosedPrice: NaN,
    showHorLabel: true,
    showHorSubLabel: false,
    showVerLabel: false,
    isTimestamp: true,
    dateFormat: 'HH:mm',
    timezone: 'Asia/Shanghai',
  }

  static propTypes = {
    // 字体集
    fontFamily: PropTypes.string,
    // 字体粗细
    fontWeight: PropTypes.string,
    // 字体大小
    fontSize: PropTypes.number,
    // 字体颜色
    fontColor: PropTypes.string,
    // 上涨颜色
    riseFontColor: PropTypes.string,
    // 下跌颜色
    fallFontColor: PropTypes.string,
    // 左侧偏移量
    leftOffset: PropTypes.number,
    // 右侧偏移量
    rightOffset: PropTypes.number,
    // 顶部偏移量
    topOffset: PropTypes.number,
    // 底部偏移量
    bottomOffset: PropTypes.number,
    // 横线的垂直方向padding
    horLineVerPadding: PropTypes.number,
    // horLabel
    // 水平方向label高度
    horLabelHeight: PropTypes.number,
    // 水平label宽度
    horLabelWidth: PropTypes.number,
    // 水平副label宽度
    horSubLabelWidth: PropTypes.number,
    // 水平label左侧偏移量
    horLabelXOffset: PropTypes.number,
    // 水平label顶部偏移量
    horLabelYOffset: PropTypes.number,
    // 垂直label左侧偏移量
    verLabelYOffset: PropTypes.number,
    // 水平label顶部偏移量
    verLabelXOffset: PropTypes.number,
    // 垂直方向label高度
    verLabelHeight: PropTypes.number,
    // 垂直label宽度
    verLabelWidth: PropTypes.number,
    // label填充色
    fillColor: PropTypes.string,
    // label边框色
    borderColor: PropTypes.string,
    // label边框圆角
    borderRadius: PropTypes.number,
    // label边框粗细
    borderWidth: PropTypes.number,
    // 十字线颜色
    lineColor: PropTypes.string,
    // 十字线粗细
    lineWidth: PropTypes.number,

    // 昨日收盘价
    preClosedPrice: PropTypes.number,
    // 显示垂直方向的顶部label
    showVerLabel: PropTypes.bool,
    // 显示水平方向的左侧label
    showHorLabel: PropTypes.bool,
    // 显示水平方向的右侧label
    showHorSubLabel: PropTypes.bool,
    // 是否是时间戳
    isTimestamp: PropTypes.bool,
    // 日期格式
    dateFormat: PropTypes.string,
    // 时区
    timezone: PropTypes.string,
  }

  /**
   * 生命周期
   *
   * @memberof CrossHair
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let shouldUpdate = false;

    if (nextContext) {
      const {
        events: preEvents, xScale: preXScale, yScale: preYScale, currentItem: preCurrentItem, domain: preDomain, data: preData, frame: preFrame,
      } = this.context;

      const {
        events, xScale, yScale, currentItem, domain, data, frame,
      } = nextContext;

      if (JSON.stringify(preEvents.longPressEvent) !== JSON.stringify(events.longPressEvent)) {
        shouldUpdate = true;
      }
      if (JSON.stringify(currentItem) !== JSON.stringify(preCurrentItem)) {
        shouldUpdate = true;
      }
      if (events.longPressEvent) {
        const testNumber = 10;
        if (JSON.stringify(domain) !== JSON.stringify(preDomain) ||
          JSON.stringify(data) !== JSON.stringify(preData) ||
          JSON.stringify(frame) !== JSON.stringify(preFrame) ||
          xScale(testNumber) !== preXScale(testNumber) ||
          yScale(testNumber) !== preYScale(testNumber)) {
          shouldUpdate = true;
        }
      }
    }
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  /**
   * 绘制十字线
   *
   * @memberof CrossHair
   */
  _drawCrossHairCursor = () => {
    const {
      frame, data, domain, currentItem, yScale, xScale,
    } = this.context;

    if (frame && data && domain) {
      const {
        showHorLabel, showHorSubLabel, showVerLabel,
        fontColor, riseFontColor, fallFontColor,
        topOffset, bottomOffset, leftOffset, rightOffset, horLineVerPadding, horLabelXOffset, horLabelYOffset, verLabelXOffset, verLabelYOffset,
        horLabelWidth, horSubLabelWidth, horLabelHeight, verLabelHeight, verLabelWidth,
        borderColor, fillColor, borderRadius,
        isTimestamp, timezone, dateFormat,
      } = this.props;
      let { preClosedPrice } = this.props;
      const { x: locX, y: locY } = currentItem;
      const loc = [locX, locY];
      const {
        y, width, height,
      } = frame;

      const pathInfo = {};
      const horLabelBackground = {};
      const horSubLabelBackground = {};

      // 绘制十字线
      const path = ART.Path();
      const shouldDrawHLine = isDotInsideChart(loc, frame);

      const actualX = loc[0];

      let actualY = loc[1];
      if (loc[1] < y) actualY = y;
      if (loc[1] > (y + height)) actualY = y + height;
      actualY -= y;
      actualY = Math.max(actualY, horLineVerPadding);
      actualY = Math.min(actualY, height - horLineVerPadding);

      let actualFontColor = fontColor;
      const currValue = +yScale.invert(actualY).toFixed(2);
      if (!Number.isNaN(+preClosedPrice)) {
        preClosedPrice = +preClosedPrice;
        if (currValue > preClosedPrice) actualFontColor = riseFontColor;
        if (currValue < preClosedPrice) actualFontColor = fallFontColor;
      }

      // 绘制横线
      if (shouldDrawHLine) {
        let left = leftOffset;
        let right = width - rightOffset;
        if (showHorLabel) {
          left += horLabelWidth;
        }
        if (showHorSubLabel) {
          right -= horSubLabelWidth;
        }
        path.moveTo(left, actualY);
        path.lineTo(right, actualY);
      }
      // 绘制纵线
      {
        let top = topOffset;
        const bottom = height - bottomOffset;
        if (showVerLabel) {
          top += verLabelHeight;
        }
        path.moveTo(actualX, top);
        path.lineTo(actualX, bottom);
      }

      pathInfo.path = path;

      if (shouldDrawHLine) {
        // 绘制横线Label
        if (showHorLabel) {
          const horLabel = {
            x: leftOffset + horLabelXOffset,
            y: actualY - horLabelHeight / 2 + horLabelYOffset,
            text: currValue.toFixed(2),
            fill: actualFontColor,
          };
          pathInfo.horLabel = horLabel;

          const horLabelBackgroundPath = ART.Path();
          const top = actualY - horLabelHeight / 2;
          const bottom = actualY + horLabelHeight / 2;
          const left = leftOffset;
          const right = horLabelWidth + leftOffset;
          horLabelBackgroundPath.moveTo(left, top + borderRadius);
          horLabelBackgroundPath.arc(borderRadius, -borderRadius, borderRadius, 0, 0, false);
          horLabelBackgroundPath.lineTo(right - borderRadius, top);
          horLabelBackgroundPath.arc(borderRadius, borderRadius, borderRadius, 0, 0, false);
          horLabelBackgroundPath.lineTo(right, bottom - borderRadius);
          horLabelBackgroundPath.arc(-borderRadius, borderRadius, borderRadius, 0, 0, false);
          horLabelBackgroundPath.lineTo(left + borderRadius, bottom);
          horLabelBackgroundPath.arc(-borderRadius, -borderRadius, borderRadius, 0, 0, false);
          horLabelBackgroundPath.lineTo(left, top + borderRadius);
          horLabelBackground.path = horLabelBackgroundPath;
          horLabelBackground.stroke = borderColor;
          horLabelBackground.fill = fillColor;
          pathInfo.horLabelBackground = horLabelBackground;
        } else {
          // 当手指除出chart时清除横线label
          pathInfo.horLabelBackground = null;
          pathInfo.horLabel = null;
        }

        // 绘制横线副Label
        if (showHorSubLabel) {
          const currChangePct = ((currValue - preClosedPrice) / preClosedPrice * 100).toFixed(2);
          const horSubLabel = {
            x: frame.width - rightOffset - horSubLabelWidth + horLabelXOffset,
            y: actualY - horLabelHeight / 2 + horLabelYOffset,
            text: `${currChangePct}%`,
            fill: actualFontColor,
          };
          pathInfo.horSubLabel = horSubLabel;

          // bg
          const horSubLabelBackgroundPath = ART.Path();
          const top = actualY - horLabelHeight / 2;
          const bottom = actualY + horLabelHeight / 2;
          const left = frame.width - rightOffset - horSubLabelWidth;
          const right = frame.width - rightOffset;
          horSubLabelBackgroundPath.moveTo(left, top + borderRadius);
          horSubLabelBackgroundPath.arc(borderRadius, -borderRadius, borderRadius, 0, 0, false);
          horSubLabelBackgroundPath.lineTo(right - borderRadius, top);
          horSubLabelBackgroundPath.arc(borderRadius, borderRadius, borderRadius, 0, 0, false);
          horSubLabelBackgroundPath.lineTo(right, bottom - borderRadius);
          horSubLabelBackgroundPath.arc(-borderRadius, borderRadius, borderRadius, 0, 0, false);
          horSubLabelBackgroundPath.lineTo(left + borderRadius, bottom);
          horSubLabelBackgroundPath.arc(-borderRadius, -borderRadius, borderRadius, 0, 0, false);
          horSubLabelBackgroundPath.lineTo(left, top + borderRadius);
          horSubLabelBackground.path = horSubLabelBackgroundPath;
          horSubLabelBackground.stroke = borderColor;
          horSubLabelBackground.fill = fillColor;
          pathInfo.horSubLabelBackground = horSubLabelBackground;
        } else {
          // 当手指除出chart时清除横线label
          pathInfo.horSubLabelBackground = null;
          pathInfo.horSubLabel = null;
        }
      }

      // 绘制纵线Label
      if (showVerLabel) {
        const plotData = data.slice(domain.start, domain.end + 1);
        let verLabelText = plotData[getCurrentItem(xScale, null, [loc[0]], plotData, 'index')][0];
        if (isTimestamp) {
          verLabelText = moment.tz(verLabelText, timezone).format(dateFormat);
        } else {
          const timestamp = getTimestamp(verLabelText, timezone);
          verLabelText = moment.tz(timestamp, timezone).format(dateFormat);
        }
        let verLabelX = actualX - verLabelWidth / 2;
        if (verLabelX < leftOffset) {
          verLabelX = leftOffset;
        } else if (verLabelX > width - verLabelWidth - rightOffset) {
          verLabelX = width - verLabelWidth - rightOffset;
        }
        const verLabel = {
          x: verLabelX + verLabelXOffset,
          y: topOffset + verLabelYOffset,
          text: verLabelText,
        };
        const verLabelBackground = {};
        const verLabelBackgroundPath = ART.Path();
        const top = topOffset;
        const bottom = verLabelHeight + topOffset;
        const left = verLabelX;
        const right = verLabelX + verLabelWidth;
        verLabelBackgroundPath.moveTo(left, top + borderRadius);
        verLabelBackgroundPath.arc(borderRadius, -borderRadius, borderRadius, 0, 0, false);
        verLabelBackgroundPath.lineTo(right - borderRadius, top);
        verLabelBackgroundPath.arc(borderRadius, borderRadius, borderRadius, 0, 0, false);
        verLabelBackgroundPath.lineTo(right, bottom - borderRadius);
        verLabelBackgroundPath.arc(-borderRadius, borderRadius, borderRadius, 0, 0, false);
        verLabelBackgroundPath.lineTo(left + borderRadius, bottom);
        verLabelBackgroundPath.arc(-borderRadius, -borderRadius, borderRadius, 0, 0, false);
        verLabelBackgroundPath.lineTo(left, top + borderRadius);
        verLabelBackground.path = verLabelBackgroundPath;
        verLabelBackground.stroke = borderColor;
        verLabelBackground.fill = fillColor;
        pathInfo.verLabelBackground = verLabelBackground;
        pathInfo.verLabel = verLabel;
      }
      return pathInfo;
    }

    return {
      path: null,
      verLabel: null,
      verLabelBackground: null,
      horLabel: null,
      horLabelBackground: null,
      horSubLabel: null,
      horSubLabelBackground: null,
    };
  }

  /**
   * 渲染区
   *
   * @returns 
   * @memberof CrossHair
   */
  render() {
    const { events } = this.context;
    let pathInfo;
    if (events) {
      const { longPressEvent } = events;
      if (longPressEvent) {
        pathInfo = this._drawCrossHairCursor();
      } else {
        pathInfo = {
          path: null,
          verLabel: null,
          verLabelBackground: null,
          horLabel: null,
          horLabelBackground: null,
          horSubLabel: null,
          horSubLabelBackground: null,
        };
      }
    }
    const {
      path,
      verLabel,
      verLabelBackground,
      horLabel,
      horLabelBackground,
      horSubLabel,
      horSubLabelBackground,
    } = pathInfo;

    const {
      fontFamily, fontWeight, fontSize, borderWidth, fontColor, lineColor, lineWidth,
    } = this.props;

    const font = { fontFamily, fontWeight, fontSize };

    return (
      <Group>
        <Shape d={path} stroke={lineColor} strokeWidth={lineWidth} />
        {verLabelBackground ?
          <Shape
            d={verLabelBackground.path}
            stroke={verLabelBackground.stroke}
            fill={verLabelBackground.fill}
            strokeWidth={borderWidth}
          />
          : null
        }
        {verLabel ?
          <Text
            font={font}
            fill={fontColor}
            x={verLabel.x}
            y={verLabel.y}
          >
            {verLabel.text}
          </Text>
          : null
        }
        {horLabelBackground ?
          <Shape
            d={horLabelBackground.path}
            stroke={horLabelBackground.stroke}
            fill={horLabelBackground.fill}
            strokeWidth={borderWidth}
          />
          : null
        }
        {horLabel ?
          <Text
            font={font}
            fill={horLabel.fill}
            x={horLabel.x}
            y={horLabel.y}
          >
            {horLabel.text}
          </Text>
          : null
        }
        {horSubLabelBackground ?
          <Shape
            d={horSubLabelBackground.path}
            stroke={horSubLabelBackground.stroke}
            fill={horSubLabelBackground.fill}
            strokeWidth={borderWidth}
          />
          : null
        }
        {horSubLabel ?
          <Text
            font={font}
            fill={horSubLabel.fill}
            x={horSubLabel.x}
            y={horSubLabel.y}
          >
            {horSubLabel.text}
          </Text>
          : null
        }
      </Group>
    );
  }
}

CrossHair.contextTypes = {
  data: PropTypes.array,
  domain: PropTypes.object,
  frame: PropTypes.object,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  events: PropTypes.object,
  currentItem: PropTypes.object,
};
