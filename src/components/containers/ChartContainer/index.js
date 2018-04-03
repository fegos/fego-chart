/**
 * ChartContainer组件
 *
 * @author eric
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactNative, { View, Platform, UIManager, Dimensions } from 'react-native';
import EventCapture from '../../EventCapture';

import { calculateXScale } from '../../../scale';
import { getCurrentItem, CalculateUtil } from '../../../util';

const ScaleAlignment = {
  center: 0,
  left: 1,
  right: 2,
  loc: 3,
};

const window = Dimensions.get('window');
const screenWidth = window.width;

export default class ChartContainer extends Component {
  /**
   * 组件属性
   *
   * @static
   * @memberof ChartContainer
   */
  static defaultProps = {
    numberOfDays: 1,
    horizontal: false,
    statusBarHeight: 0,
    dataOffset: 0,
    eventCaptures: [],
    xDateTicks: [],
    plotConfig: {
      spacing: 2,
      barWidth: 6,
    },
    scaleAlignment: ScaleAlignment.loc,
  }

  static propsType = {
    // 图标类型 .e.g:timeline|kline,
    chartType: PropTypes.string.isRequired,

    // 当图标类型为分时的时候，需要展示的天数，默认为当日分时
    numberOfDays: PropTypes.number,

    // 是否为横屏
    horizontal: PropTypes.bool,

    // 导航栏高度
    statusBarHeight: PropTypes.number,

    // 数据偏移量
    dataOffset: PropTypes.number,

    // 昨日收盘价
    preClosedPrice: PropTypes.string,

    // 分时图的数据总量
    totalTimelineDataCount: PropTypes.number,

    // 横坐标轴
    xDateTicks: PropTypes.array,

    // 加载更多偏移阈值
    threshold: PropTypes.number,

    // 指标
    indicators: PropTypes.object,

    // 图表原始数据
    data: PropTypes.array.isRequired,

    // 图表布局  eg: {x, y, width, height, padding:{left, right, top, bottom}}
    frame: PropTypes.object,

    // 支持的手势
    eventCaptures: PropTypes.array,

    // 显示的数据区间
    domain: PropTypes.object,

    // 图表配置
    plotConfig: PropTypes.object,

    // 图标状态 eg: {curScale, curBarWidth, curStep}
    plotState: PropTypes.object,

    // 图标背景线间隔
    xGridGap: PropTypes.number,

    // 放缩的对齐方式
    scaleAlignment: PropTypes.string,

    // 是否还有更多历史数据
    hasMore: PropTypes.bool,

    // 加载更多
    onLoadMore: PropTypes.func,

    // 双击事件
    onDoublePress: PropTypes.func,

    // 长按事件
    onLongPress: PropTypes.func,

    // 滑动事件
    onPan: PropTypes.func,

    // 更新Domain
    updateDomain: PropTypes.func,

    // 更新plotState,主要是barWidth、step、scale的变化
    updatePlotState: PropTypes.func,
  }

  /**
   * 构造函数+类变量+组件状态
   * @param {any} props
   * @memberof ChartContainer
   */
  constructor(props) {
    super(props);
    this._frame = this.props.frame;
    this._containerView = null;
    this._currentMovedItem = 0;
    const { plotConfig, plotState } = props;
    const { barWidth, spacing } = plotConfig;

    if (plotState) {
      this._plotState = plotState;
    } else {
      this._plotState = { curBarWidth: barWidth, curStep: barWidth + spacing, curScale: 1 };
    }

    this.state = {
      domain: null,
      indicatorData: {},
      xScale: null,
      xTicks: [],
      events: {},
      offset: 0,
      loadStatus: 'preload',
    };
  }

  /**
   * 向子View提供context
   */
  getChildContext() {
    const {
      chartType, data, preClosedPrice, xDateTicks, plotConfig, hasMore, horizontal,
    } = this.props;
    const {
      indicatorData, events, xTicks, xScale, offset, loadStatus, domain,
    } = this.state;
    const { curBarWidth, curStep } = this._plotState;
    const { spacing } = plotConfig;

    const activePlotConfig = {
      step: curStep,
      barWidth: curBarWidth,
      spacing,
    };
    return {
      data,
      chartType,
      xDateTicks,
      preClosedPrice: Number.parseFloat(preClosedPrice),
      indicatorData,
      plotConfig: activePlotConfig,
      domain,
      events,
      xTicks,
      xScale,
      offset,
      loadStatus,
      hasMore,
      pressHandler: this._onPressHandler,
      horizontal,
    };
  }


  /**
   * 生命周期
   *
   * @memberof ChartContainer
   */
  componentWillMount() {
    this._updateIndicatorData(this.props);
    this._resetDomain(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { props, state, _plotState } = this;
    if (nextProps.chartType !== props.chartType ||
      (nextProps.chartType === 'timeline' && nextProps.totalTimelineDataCount !== props.totalTimelineDataCount)) { // 假如图标类型或者状态信息发生变化，则更新domain。
      if (!nextProps.domain) {
        this._initDomain(nextProps);
      } else {
        this._resetDomain(nextProps);
      }
    } else if ((nextProps.plotState && JSON.stringify(nextProps.plotState) !== JSON.stringify(_plotState)) ||
      (nextProps.domain && JSON.stringify(nextProps.domain) !== JSON.stringify(state.domain))) {
      this._resetDomain(nextProps);
    } else if (nextProps.chartType === 'kline' && nextProps.xGridGap !== props.xGridGap ||
      (nextProps.chartType === 'timeline' &&
        (nextProps.numberOfDays !== props.numberOfDays ||
          (nextProps.numberOfDays === 1 && JSON.stringify(nextProps.xDateTicks) !== JSON.stringify(props.xDateTicks))))) {
      this._updateXTicks(state.domain, nextProps);
    }

    if (JSON.stringify(nextProps.data) !== JSON.stringify(props.data)) { // 假如数据有更新则更新指标数据
      this._updateIndicatorData(nextProps);
      if (nextProps.chartType === 'kline' && JSON.stringify(nextProps.domain) === JSON.stringify(state.domain) ||
        (nextProps.chartType === 'timeline' && !state.domain)) {
        this._updateDomainWithNewData(nextProps);
      }
    }
  }


  /**
   * 更新指标数据
   *
   *
   * @memberof ChartContainer
   */
  _updateIndicatorData = (props) => {
    const { data, indicators } = props;
    if (data && data.length && indicators) {
      const plotData = {};
      plotData.fullData = data;
      if (!plotData.calcedData) plotData.calcedData = {};
      CalculateUtil.indicatorsHelper(indicators, plotData);
      this.setState({
        indicatorData: plotData.calcedData,
      });
    }
  }

  /**
   *  重置domain
   */
  _resetDomain = (props) => {
    const { domain: outerDomain, plotState: outerPlotState } = props;
    const { domain } = this.state;
    const plotState = this._plotState;
    if (outerDomain) {
      if (outerPlotState) {
        if (JSON.stringify(outerPlotState) === JSON.stringify(plotState)) {
          if (JSON.stringify(outerDomain) !== JSON.stringify(domain)) {
            this._updateDomain(outerDomain, props);
          }
        } else {
          this._updateDomainWithPinch(null, outerPlotState.curScale / plotState.curScale, ScaleAlignment.center, null, null);
        }
      } else {
        const { start, end } = domain;
        const { start: outerStart, end: outerEnd } = outerDomain;
        if (start !== outerStart || end !== outerEnd) {
          this._updateDomain(outerDomain, props);
        }
      }
    } else if (!domain) {
      this._initDomain(props);
    } else if (outerPlotState) {
      this._updateDomainWithPinch(null, outerPlotState.curScale / plotState.curScale, ScaleAlignment.center, null, null);
    }
  }

  /**
   * 初始化domain
   */
  _initDomain = (props) => {
    const { data, chartType, totalTimelineDataCount } = props;

    if (!this._frame || !data || !chartType) {
      return;
    }

    if (!data.length) {
      return;
    }

    if (this._frame.width) {
      if (chartType === 'timeline') {
        const domain = { start: 0, end: totalTimelineDataCount - 1 };
        this._updateDomain(domain, props);
      } else {
        let start = 0;
        let end = 0;
        const dataCount = data.length;
        const screenDataCount = this._getScreenDataCount(props, 1);
        const visibleDataCount = this._getVisibleDataCount(props, 1);
        if (!visibleDataCount) {
          return;
        }

        end = dataCount - 1;
        start = end - screenDataCount + 1;

        const domain = { start, end };
        this._updateDomain(domain, props);
      }
    }
  }

  /**
   * 数据源变更，则计算是否需要更新domain
   *
   * @memberof ChartContainer
   */
  _updateDomainWithNewData = (nextProps) => {
    const { data, chartType, totalTimelineDataCount } = nextProps;
    const { domain } = this.state;
    if (!this._frame || !chartType || !data || !data.length) {
      return;
    }
    if (!domain) {
      this._initDomain(nextProps);
      return;
    }
    const { start, end } = domain;
    let newStart = start;
    let newEnd = end;
    if (chartType === 'timeline') {
      newStart = 0;
      newEnd = totalTimelineDataCount - 1;
    } else {
      const dataCount = data.length;
      const screenDataCount = this._getScreenDataCount(nextProps, 1);
      const visibleDataCount = this._getVisibleDataCount(nextProps, 1);

      if (screenDataCount < visibleDataCount) { // 数据铺不满屏幕
        newStart = 0;
        newEnd = dataCount - 1;
      } else {
        const preScreenDataCount = end - start + 1;
        const { data: preData } = this.prop;
        if (preScreenDataCount < screenDataCount) { // 屏幕显示的数据量变多
          if (start + screenDataCount >= dataCount) { // 数据的最后超过了屏幕
            newEnd = dataCount - 1;
            newStart = end - screenDataCount + 1;
          } else { // 数据的最后没有超过屏幕
            newEnd = newStart + screenDataCount - 1;
          }
        } else if (preScreenDataCount > screenDataCount) { // 屏幕显示的数据量变少
          if (end === this.props.data.length - 1) { // 假如之前显示到了最后一个
            newEnd = dataCount - 1;
            newStart = newEnd - screenDataCount + 1;
          } else {
            newEnd = newStart + screenDataCount - 1;
          }
        } else if (preData.length < data.length && end === preData.length - 1) {
          newEnd = data.length - 1;
          newStart = end - screenDataCount + 1;
        }
      }
      if (newStart !== start && newEnd !== end) {
        const newDomain = {
          start,
          end,
        };
        this._updateDomain(newDomain, nextProps);
      }
    }
  }

  /**
   * 更新domain
   *
   * @memberof ChartContainer
   */
  _updateDomain = (newDomain, props) => {
    const {
      chartType, updateDomain,
    } = props;
    const { start, end } = newDomain;
    const { curBarWidth } = this._plotState;
    const chartWidth = this._getChartWidth();
    const screenDataCount = end - start + 1;
    let indexDomain;
    let frame = { x: 0, chartWidth };
    if (chartType === 'timeline') {
      indexDomain = [0, screenDataCount - 1];
    } else {
      const visibleCount = this._getVisibleDataCount(props, 1);
      indexDomain = [0, visibleCount - 1];
      frame = { x: curBarWidth / 2, chartWidth: chartWidth - curBarWidth / 2 };
    }
    const xScale = calculateXScale(indexDomain, frame, 'index');
    this._updateXTicks(newDomain, props);
    this.setState({
      domain: newDomain,
      xScale,
    });
    updateDomain && updateDomain(chartType, newDomain);
  }

  /**
   * 更新XTicks
   *
   * @param {any} domain
   * @param {any} props
   * @memberof ChartContainer
   */
  _updateXTicks(domain, props) {
    const {
      chartType, xDateTicks, data, xGridGap, numberOfDays,
    } = props;
    const { start, end } = domain;
    const screenDataCount = end - start + 1;
    const xTicks = [];
    if (chartType === 'timeline') {
      if (numberOfDays === 1) {
        const ticksCount = xDateTicks.length;
        if (ticksCount > 1) {
          const gap = (screenDataCount - 1) / (ticksCount - 1);
          for (let idx = 0; idx < ticksCount; idx++) {
            xTicks.push(gap * idx);
          }
        }
      } else if (numberOfDays > 1) {
        const gap = (screenDataCount - 1) / numberOfDays / 2;
        for (let idx = 1; idx < 10; idx += 2) {
          xTicks.push(gap * idx);
        }
      }
    } else {
      for (let idx = 0; idx < screenDataCount - 1; idx++) {
        if ((data.length - 1 - start - idx) % xGridGap === 0) {
          xTicks.push(idx);
        }
      }
    }
    this.setState({
      xTicks,
    });
  }

  /**
   * 获取可显示的最大数据量
   */
  _getVisibleDataCount = (props, scale) => {
    const { plotConfig } = props;
    const { spacing } = plotConfig;
    const actualBarWidth = this._getActualBarWidth(props);
    const chartWidth = this._getChartWidth();
    const visibleCount = Math.round((chartWidth - actualBarWidth * scale) / (spacing + actualBarWidth * scale) + 1);
    return visibleCount;
  }

  /**
   * 获取屏幕中显示的数据量
   */
  _getScreenDataCount = (props, scale) => {
    const { data } = props;
    const dataCount = data.length;
    if (dataCount) {
      const visibleCount = this._getVisibleDataCount(props, scale);
      if (dataCount < visibleCount) {
        return dataCount;
      } else {
        return visibleCount;
      }
    } else {
      return 0;
    }
  }

  /**
   * 获取实际的Bar宽度
   */
  _getActualBarWidth = (props) => {
    const { plotConfig } = props;
    const plotState = this._plotState;
    let actualBarWidth = null;
    if (plotState) {
      const { curBarWidth } = plotState;
      actualBarWidth = curBarWidth;
    } else {
      const { barWidth } = plotConfig;
      actualBarWidth = barWidth;
    }
    return actualBarWidth;
  }

  /**
   * 获取当前数据
   */
  _getCurrentItemData = (data, domain, xScale, locationX) => {
    const actualData = data.slice(domain.start, domain.end + 1);
    const currentItemIdx = getCurrentItem(xScale, null, [locationX], actualData, 'index');
    const currentItem = actualData[currentItemIdx];
    return currentItem;
  }


  /**
  *  布局模块
  *
  * @memberof ChartContainer
  */
  _updateFrame = () => {
    const {
      frame, horizontal, statusBarHeight,
    } = this.props;
    // 当没有通过props指定frame时更新。
    if (!frame) {
      const containerView = ReactNative.findNodeHandle(this._containerView);
      UIManager.measureInWindow(containerView, (x, y, width, height) => {
        const {
          padding, paddingHorizontal, paddingVertical, paddingLeft, paddingRight, paddingTop, paddingBottom,
        } = this.props.style;
        const left = paddingLeft || (paddingHorizontal || (padding || 0));
        const right = paddingRight || (paddingHorizontal || (padding || 0));
        const top = paddingTop || (paddingVertical || (padding || 0));
        const bottom = paddingBottom || (paddingVertical || (padding || 0));
        if (horizontal) {
          if (Platform.OS === 'ios') {
            this._frame = {
              x: y,
              y: screenWidth - width - x,
              width: height,
              height: width,
              padding: {
                top,
                left,
                bottom,
                right,
              },
            };
          } else {
            this._frame = {
              x: y + statusBarHeight,
              y: screenWidth - x,
              width,
              height,
              padding: {
                top,
                left,
                bottom,
                right,
              },
            };
          }
        } else {
          this._frame = {
            x,
            y,
            width,
            height,
            padding: {
              top,
              left,
              bottom,
              right,
            },
          };
        }
        this._resetDomain(this.props);
      });
    }
  }

  /**
   * 获取实际图表绘制区域宽度
   */
  _getChartWidth = () => {
    if (this._frame) {
      const { width, padding } = this._frame;
      const { left, right } = padding;
      const chartWidth = width - left - right;
      return chartWidth;
    }
    return 0;
  }


  /**
   * 手势处理
   *
   * @memberof ChartContainer
   */
  _updateDomainWithPan = (dx, dy) => {
    const {
      data, horizontal,
    } = this.props;
    const { domain } = this.state;
    const { curStep } = this._plotState;
    const dataCount = data.length;
    let { start, end } = domain;
    if (horizontal) {
      dx = dy;
    }
    if (end === dataCount - 1 && dx < 0) {
      return;
    }

    if (start === 0 && dx > 0) {
      const actualDX = dx - curStep * this._currentMovedItem;
      this.setState({
        offset: actualDX,
      });
    } else {
      let shouldUpdate = false;
      const movedItem = Math.floor(dx / curStep);
      const changeItemCount = movedItem - this._currentMovedItem;
      if (Math.abs(changeItemCount) >= 1) {
        this._currentMovedItem = movedItem;
        const screenDataCount = end - start + 1;
        if (start - changeItemCount < 0) {
          if (start !== 0) {
            start = 0;
            end = start + screenDataCount - 1;
            shouldUpdate = true;
          } else {
            shouldUpdate = false;
          }
        } else {
          const rightIndex = start + screenDataCount;
          if (rightIndex - changeItemCount > dataCount) {
            if (rightIndex !== dataCount) {
              start = dataCount - screenDataCount;
              end = start + screenDataCount - 1;
              shouldUpdate = true;
            } else {
              shouldUpdate = false;
            }
          } else {
            start -= changeItemCount;
            end = start + screenDataCount - 1;
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          const newDomain = {
            start,
            end,
          };
          this._updateDomain(newDomain, this.props);
        }
      }
    }
  }

  _updateDomainWithPinch = (e, scale, alignment, loc, updateActiveSpan, props = this.props) => {
    const {
      plotConfig, data, updatePlotState,
    } = props;
    const { domain } = this.state;
    let { curStep, curScale, curBarWidth } = this._plotState;
    const {
      maxScale, minScale, barWidth, spacing,
    } = plotConfig;
    let { start, end } = domain;
    if ((curScale >= maxScale && scale > 1) ||
      (curScale <= minScale && scale < 1)) {
      return;
    }
    if (curScale * scale > maxScale && scale > 1) {
      scale = maxScale / curScale;
    } else if (curScale * scale < minScale && scale < 1) {
      scale = minScale / curScale;
    }

    const chartWidth = this._getChartWidth();
    const dataCount = data.length;
    let threshold = 1;
    const preScreenDataCount = end - start + 1;
    if (start === 0 || start + preScreenDataCount === dataCount) {
      threshold = 1;
    } else if (alignment === ScaleAlignment.center || alignment === ScaleAlignment.loc) {
      threshold = 2;
    }
    if (Math.abs(1 - scale) * chartWidth < threshold * (spacing + curBarWidth * scale)) {
      return;
    }

    let screenDataCount = this._getScreenDataCount(props, scale);
    if (alignment === ScaleAlignment.left) {
      if (start + screenDataCount > dataCount) {
        if (preScreenDataCount < screenDataCount) {
          screenDataCount = dataCount - start;
          end = dataCount - 1;
          const currentBarWidth = (chartWidth - barWidth) / (screenDataCount - 1) - spacing;
          curScale = currentBarWidth / barWidth;
        } else if (start <= 0) {
          return;
        } else {
          this._updateDomainWithPinch(e, scale, ScaleAlignment.right, loc, updateActiveSpan);
        }
      } else {
        curScale *= scale;
        end = start + screenDataCount - 1;
      }
    } else if (alignment === ScaleAlignment.right) {
      const rightIndex = start + preScreenDataCount - 1;
      const leftIndex = rightIndex - screenDataCount + 1;
      if (leftIndex < 0) {
        if (start > 0) {
          start = 0;
          screenDataCount = rightIndex + 1;
          end = start + screenDataCount - 1;
          const currentBarWidth = (chartWidth - curBarWidth) / (screenDataCount - 1) - spacing;
          curScale = currentBarWidth / barWidth;
        } else if (rightIndex >= dataCount) {
          return;
        } else {
          this._updateDomainWithPinch(e, scale, ScaleAlignment.left, loc, updateActiveSpan);
        }
      } else {
        curScale *= scale;
        start = rightIndex - screenDataCount + 1;
        end = start + screenDataCount - 1;
      }
    } else if (alignment === ScaleAlignment.center || alignment === ScaleAlignment.loc) {
      let rightIndex = start + preScreenDataCount - 1;
      if (start === 0 && scale < 1) {
        this._updateDomainWithPinch(e, scale, ScaleAlignment.left, loc, updateActiveSpan);
      }
      if (rightIndex === dataCount - 1 && scale < 1) {
        this._updateDomainWithPinch(e, scale, ScaleAlignment.right, loc, updateActiveSpan);
      }
      let locRatio = 0.5;
      if (ScaleAlignment.loc === alignment) {
        locRatio = loc / chartWidth;
      }
      const changeCount = screenDataCount - preScreenDataCount;
      let leftChangeCount = Math.round(changeCount * locRatio);
      let rightChangeCount = changeCount - leftChangeCount;
      if (start - leftChangeCount < 0) {
        rightChangeCount = changeCount - start;
        start = 0;
        if (rightIndex + rightChangeCount + 1 >= dataCount) {
          const currentBarWidth = (chartWidth - curBarWidth) / (screenDataCount - 1) - spacing;
          curScale = currentBarWidth / barWidth;
        } else {
          curScale *= scale;
        }
        end = start + screenDataCount - 1;
      } else if (rightIndex + rightChangeCount + 1 >= dataCount) {
        leftChangeCount = changeCount - (dataCount - 1 - rightIndex);
        rightIndex = dataCount - 1;
        if (start - leftChangeCount < 0) {
          start = 0;
          screenDataCount = dataCount;
          const currentBarWidth = (chartWidth - curBarWidth) / (screenDataCount - 1) - spacing;
          curScale = currentBarWidth / barWidth;
        } else {
          start -= leftChangeCount;
          curScale *= scale;
        }
        end = start + screenDataCount - 1;
      } else {
        start -= leftChangeCount;
        end = start + screenDataCount - 1;
        curScale *= scale;
      }
    }

    const curVisibleCount = Math.round((chartWidth - barWidth * curScale) / (spacing + barWidth * curScale) + 1);
    curStep = (chartWidth - barWidth * curScale) / (curVisibleCount - 1);
    curBarWidth = curStep - spacing;
    curScale = curBarWidth / barWidth;

    const newPlotState = {
      curBarWidth,
      curStep,
      curScale,
    };
    if (JSON.stringify(this._plotState) !== JSON.stringify(newPlotState)) {
      this._plotState = newPlotState;
    }
    if (JSON.stringify(newPlotState) !== JSON.stringify(props.plotState)) {
      updatePlotState && updatePlotState(newPlotState);
    }
    const newDomain = {
      start,
      end,
    };
    if (JSON.stringify(newDomain) !== JSON.stringify(domain)) {
      this._updateDomain(newDomain, props, curVisibleCount, newPlotState);
    }
    updateActiveSpan && updateActiveSpan(e);
  }


  /**
   * 事件处理模块
   *
   * @memberof ChartContainer
   */

  /**
   * 点击事件处理
   */
  _onPressHandler = (pressEvent, key) => {
    const { onPress } = this.props;
    onPress && onPress(pressEvent, key);
    const { events } = this.state;
    const updateEvents = Object.assign({}, events);
    updateEvents.pressEvent = null;
    this.setState({
      events: updateEvents,
    });
  }

  /**
   * 加载更多
   */
  _onLoadMore = () => {
    const { onLoadMore } = this.props;
    if (onLoadMore) {
      onLoadMore().then(() => {
        this._currentMovedItem = 0;
        this.setState({
          loadStatus: 'preload',
          offset: 0,
        });
      }).catch(() => {
        this._currentMovedItem = 0;
        this.setState({
          loadStatus: 'preload',
          offset: 0,
        });
      });
    }
  }


  /**
   *
   * 手势事件处理模块
   *
   * @memberof ChartContainer
   */

  _onPan = (eventState, e, gestureState) => {
    const { onPan } = this.props;
    if (eventState === EventCapture.EventState.end) {
      const { threshold, hasMore } = this.props;
      const { offset } = this.state;
      if (hasMore) {
        if (offset > threshold) {
          this._onLoadMore();
          this.setState({
            loadStatus: 'loading',
          });
        } else {
          this._currentMovedItem = 0;
          this.setState({
            offset: 0,
          });
        }
      } else {
        this._currentMovedItem = 0;
        this.setState({
          offset: 0,
        });
      }
      onPan && onPan(null, null);
    } else {
      const { dx, dy } = gestureState;
      this._updateDomainWithPan(dx, dy);
      if (onPan) {
        onPan(dx, dy);
      }
    }
  }

  /**
   * 单击
   */
  _onPress = (eventState, e) => {
    const { events } = this.state;
    const { horizontal } = this.props;
    if (this._frame && events) {
      const {
        x, y, padding,
      } = this._frame;
      const {
        left, top,
      } = padding;
      let { pageX, pageY } = e.nativeEvent;
      if (horizontal) {
        const tempX = pageX;
        pageX = pageY;
        pageY = screenWidth - tempX;
      }
      const locationX = pageX - x - left;
      const locationY = pageY - y - top;
      const updateEvents = Object.assign({}, events);
      updateEvents.pressEvent = {
        x: locationX,
        y: locationY,
      };
      this.setState({
        events: updateEvents,
      });
    }
  }

  /**
   * 长按手势
   */
  _onLongPress = (eventState, e) => {
    const {
      onLongPress, data, horizontal, dataOffset,
    } = this.props;
    const { events, domain, xScale } = this.state;

    const updateEvents = Object.assign({}, events);
    if (eventState === EventCapture.EventState.end) {
      updateEvents.longPressEvent = null;
      if (typeof onLongPress === 'function') {
        onLongPress(null);
      }
    } else if (e && e.nativeEvent && this._frame && xScale) {
      const {
        x, y, width, padding,
      } = this._frame;
      const {
        left, right, top,
      } = padding;
      let { pageX, pageY } = e.nativeEvent;
      const { locationX: locX } = e.nativeEvent;
      const locationY = pageY - y - top;
      let locationX;
      if (horizontal) {
        const tempX = pageX;
        pageX = pageY;
        pageY = screenWidth - tempX;
        locationX = pageX - x - left;
      } else if (Platform.OS === 'ios') {
        locationX = locX;
      } else {
        locationX = pageX - x - left;
      }
      let rightSide = xScale(data.length - 1);
      const leftSide = xScale(dataOffset);
      const actualWidth = width - left - right;
      if (rightSide > actualWidth) {
        rightSide = actualWidth;
      }
      if (locationX < leftSide) {
        locationX = leftSide;
      }
      if (locationX > rightSide) {
        locationX = rightSide;
      }
      updateEvents.longPressEvent = {
        x: locationX,
        y: locationY,
      };

      // 将currentItem数据传入onLongPress回调
      if (typeof onLongPress === 'function') {
        const currentItem = this._getCurrentItemData(data, domain, xScale, updateEvents.longPressEvent.x);
        onLongPress(currentItem);
      }
    }

    this.setState({
      events: updateEvents,
    });
  }

  // 双击
  _onDoublePress = () => {
    const { onDoublePress } = this.props;
    onDoublePress && onDoublePress();
  }

  // 放缩
  _onPinch = (eventState, e, totalScale, activeScale, updateActiveSpan) => {
    if (e && e.nativeEvent) {
      const { touches } = e.nativeEvent;
      let loc = this._frame.width / 2;
      if (touches && touches.length === 2) {
        loc = (touches[0].locationX + touches[1].locationX) / 2;
      }
      this._updateDomainWithPinch(e, activeScale, ScaleAlignment.loc, loc, updateActiveSpan);
    }
  }


  /**
   * 渲染模块
   *
   * @returns
   * @memberof ChartContainer
   */
  render() {
    const { frame, children, eventCaptures } = this.props;
    const style = {
      position: 'relative',
    };
    if (frame) {
      const { padding, width, height } = frame;
      Object.assign(style, { padding, width, height });
    } else {
      Object.assign(style, { flex: 1 });
    }
    Object.assign(style, this.props.style);

    return (
      <View
        ref={(ref) => { this._containerView = ref; }}
        style={style}
        onLayout={(e) => {
          this._updateFrame(e);
        }}
      >
        <EventCapture
          style={{ flex: 1 }}
          eventCaptures={eventCaptures}
          onPan={this._onPan}
          onPress={this._onPress}
          onPinch={this._onPinch}
          onLongPress={this._onLongPress}
          onDoublePress={this._onDoublePress}
        >
          {children}
        </EventCapture>
      </View>
    );
  }
}

ChartContainer.childContextTypes = {
  data: PropTypes.array,
  chartType: PropTypes.string,
  xDateTicks: PropTypes.array,
  preClosedPrice: PropTypes.number,
  indicatorData: PropTypes.object,
  plotConfig: PropTypes.object,
  domain: PropTypes.object,
  events: PropTypes.object,
  xTicks: PropTypes.array,
  xScale: PropTypes.func,
  offset: PropTypes.number,
  loadStatus: PropTypes.string,
  hasMore: PropTypes.bool,
  pressHandler: PropTypes.func,
  horizontal: PropTypes.bool,
};
