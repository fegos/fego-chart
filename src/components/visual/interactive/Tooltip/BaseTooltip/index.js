/**
 * BaseTooltip
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART } from 'react-native';
import { getCurrentItem } from '../../../../../util';

const { Group, Text } = ART;

export default class BaseTooltip extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof BaseTooltip
   */
  static defaultProps = {
    rightMargin: 15.5,
    topMargin: 10,
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    titleColor: '#8f8f8f',
    title: '',
    valueKeys: [],
    indicators: [],
    type: '',
  }

  static propTypes = {
    // Tooltip右边距
    rightMargin: PropTypes.number,
    // Tooltip上边距
    topMargin: PropTypes.number,
    // Tooltip字体集
    fontFamily: PropTypes.string,
    // Tooltip字体大小
    fontSize: PropTypes.number,
    // Tooltip字重
    fontWeight: PropTypes.string,
    // 指标
    indicators: PropTypes.arrayOf(PropTypes.object),
    // 指标名
    title: PropTypes.string,
    // 参数
    valueKeys: PropTypes.arrayOf(PropTypes.string),
    // 类型 group
    type: PropTypes.string,
    // 指标颜色
    titleColor: PropTypes.string,
  }

  /**
   * 构造函数
   * @param {any} props
   * @memberof BaseTooltip
   */
  constructor(props) {
    super(props);
    this._dataIndex = null;
    this._periodStr = null;
    this.state = {
      tooltipInfo: null,
    };
  }

  /**
   * 生命周期
   *
   */
  componentWillMount() {
    this._updateTipInfo(this.props, this.context);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {
      events: preEvents, currentItem: preCurrentItem,
      data: preData, indicatorData: preIndicatorData,
      domain: preDomain, frame: preFrame, xScale: preXScale,
    } = this.context;

    const {
      events, currentItem, data, indicatorData, domain, frame, xScale,
    } = nextContext;

    let shouldRedraw = false;

    if ((!preEvents.longPressEvent || !events.longPressEvent) &&
      preEvents.longPressEvent !== events.longPressEvent) {
      shouldRedraw = true;
    } else if (preEvents.longPressEvent && events.longPressEvent) {
      const prePlotData = preData.slice(preDomain.start, preDomain.end);
      const preDataIndex = getCurrentItem(preXScale, null, [preCurrentItem.x], prePlotData, 'index') + preDomain.start;
      const preItem = preIndicatorData[preDataIndex];
      const plotData = data.slice(domain.start, domain.end);
      const dataIndex = getCurrentItem(xScale, null, [currentItem.x], plotData, 'index') + domain.start;
      const item = indicatorData[dataIndex];
      if (JSON.stringify(preItem) !== JSON.stringify(item)) {
        shouldRedraw = true;
        this._dataIndex = dataIndex;
      }
    } else if (JSON.stringify(frame) !== JSON.stringify(preFrame)) {
      shouldRedraw = true;
    } else if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      shouldRedraw = true;
    }
    if (shouldRedraw) {
      this._updateTipInfo(nextProps, nextContext);
    }
  }

  /**
   * 更新提示信息
   *
   * @memberof BaseTooltip
   */
  _updateTipInfo = (props, context) => {
    if (!context.frame) {
      return;
    }

    const {
      indicators, type, valueKeys, title, rightMargin, topMargin, titleColor,
      fontSize, fontFamily, fontWeight,
    } = props;
    const {
      events, currentItem, xScale, data, indicatorData, domain, frame,
    } = context;
    const { width } = frame;
    let tooltipInfo = [];
    const originX = width - rightMargin;
    const font = { fontFamily, fontWeight, fontSize };
    if (events.longPressEvent) {
      if (!this._dataIndex) {
        const plotData = data.slice(domain.start, domain.end);
        this._dataIndex = getCurrentItem(xScale, null, [currentItem.x], plotData, 'index') + domain.start;
      }
      tooltipInfo = this._getDetailToolTip(indicators, indicatorData, this._dataIndex, originX, topMargin, type, title, valueKeys, titleColor, fontSize, font);
    } else {
      tooltipInfo = this._getNormalTooltip(indicators, originX, topMargin, type, title, titleColor, fontSize, font);
    }
    this.setState({ tooltipInfo });
  }

  /**
   * 获取长按状态下的tipInfo
   *
   * @memberof BaseTooltip
   */
  _getDetailToolTip = (indicators, indicatorData, dataIndex, originX, originY, type, title, valueKeys, titleColor, fontSize, font) => {
    let tooltipInfo = null;
    const len = indicators.length;
    let curIndicator = null;
    let data = null;
    let text = null;
    for (let idx = len - 1; idx >= 0; idx--) {
      curIndicator = indicators[idx];
      data = indicatorData[curIndicator.dataKey][dataIndex];
      if (type === 'group') {
        const indicatorKeys = Object.keys(curIndicator.stroke);
        const indicatorKeysLen = indicatorKeys.length;
        for (let j = indicatorKeys.length - 1; j >= 0; j--) {
          const indicatorKey = indicatorKeys[j];
          if (data === '-') {
            text = ` ${indicatorKey}: -`;
          } else {
            text = ` ${indicatorKey}: ${data[valueKeys[j]] ? data[valueKeys[j]].toFixed(2) : '-'}`;
          }
          const offset = j === indicatorKeysLen - 1 ? 0 : 3;
          originX = originX - text.length * fontSize / 2.0 - offset;
          tooltipInfo = this._updateTooltip(tooltipInfo, originX, originY, text, curIndicator.stroke[indicatorKey], font);
        }
      } else {
        text = ` ${curIndicator.dataKey}: ${data && data !== '-' ? data.toFixed(2) : '-'}`;
        originX = originX - text.length * fontSize / 2.0 - 5;
        tooltipInfo = this._updateTooltip(tooltipInfo, originX, originY, text, curIndicator.stroke, font);
      }
    }
    text = `${title}(${this._periodStr}) `;
    originX -= text.length * fontSize / 2.0;
    tooltipInfo = this._updateTooltip(tooltipInfo, originX, originY, text, titleColor, font);
    return tooltipInfo;
  }

  /**
   * 获取常态下的tipInfo
   *
   * @memberof BaseTooltip
   */
  _getNormalTooltip = (indicators, originX, originY, type, title, titleColor, fontSize, font) => {
    let tooltipInfo = null;
    const periodArr = [];
    if (indicators) {
      indicators.forEach((item) => {
        if (type === 'group') {
          periodArr.push(Object.values(item.params).join(','));
        } else {
          periodArr.push(item.params.period);
        }
      });
      this._periodStr = periodArr.join(',');
      const content = `${title}(${this._periodStr})`;
      originX -= content.length * fontSize / 2.0;
      tooltipInfo = this._updateTooltip(tooltipInfo, originX, originY, content, titleColor, font);
    }
    return tooltipInfo;
  }

  _updateTooltip = (preToolTipInfo, x, y, text, stroke, font) => {
    const tempToolTipInfo = preToolTipInfo || [];
    tempToolTipInfo.push({
      x, y, text, stroke, font,
    });
    return tempToolTipInfo;
  }

  /**
   * 渲染区
   *
   * @returns
   * @memberof BaseTooltip
   */
  render() {
    const { tooltipInfo } = this.state;
    if (tooltipInfo) {
      return (
        <Group>
          {
            tooltipInfo.map((tooltip, idx) => {
              const key = `text${idx}`;
              return (
                <Text
                  key={key}
                  fill={tooltip.stroke}
                  strokeWidth={1}
                  font={tooltip.font}
                  x={tooltip.x}
                  y={tooltip.y}
                >
                  {tooltip.text}
                </Text>
              );
            })
          }
        </Group>
      );
    } else {
      return null;
    }
  }
}

BaseTooltip.contextTypes = {
  events: PropTypes.object,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  currentItem: PropTypes.object,
  data: PropTypes.array,
  indicatorData: PropTypes.object,
  domain: PropTypes.object,
  frame: PropTypes.object,
};
