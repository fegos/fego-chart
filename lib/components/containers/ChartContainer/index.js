'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _EventCapture = require('../../EventCapture');

var _EventCapture2 = _interopRequireDefault(_EventCapture);

var _scale = require('../../../scale');

var _util = require('../../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ChartContainer组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ScaleAlignment = {
  center: 0,
  left: 1,
  right: 2,
  loc: 3
};

var window = _reactNative.Dimensions.get('window');
var screenWidth = window.width;

var ChartContainer = function (_Component) {
  _inherits(ChartContainer, _Component);

  /**
   * 构造函数+类变量+组件状态
   * @param {any} props
   * @memberof ChartContainer
   */

  /**
   * 组件属性
   *
   * @static
   * @memberof ChartContainer
   */
  function ChartContainer(props) {
    _classCallCheck(this, ChartContainer);

    var _this = _possibleConstructorReturn(this, (ChartContainer.__proto__ || Object.getPrototypeOf(ChartContainer)).call(this, props));

    _initialiseProps.call(_this);

    _this._frame = _this.props.frame;
    _this._containerView = null;
    _this._currentMovedItem = 0;
    var plotConfig = props.plotConfig,
        plotState = props.plotState;
    var barWidth = plotConfig.barWidth,
        spacing = plotConfig.spacing;


    if (plotState) {
      _this._plotState = plotState;
    } else {
      _this._plotState = { curBarWidth: barWidth, curStep: barWidth + spacing, curScale: 1 };
    }

    _this.state = {
      domain: null,
      indicatorData: {},
      xScale: null,
      xTicks: [],
      events: {},
      offset: 0,
      loadStatus: 'preload'
    };
    return _this;
  }

  /**
   * 向子View提供context
   */


  _createClass(ChartContainer, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _props = this.props,
          chartType = _props.chartType,
          data = _props.data,
          preClosedPrice = _props.preClosedPrice,
          xDateTicks = _props.xDateTicks,
          plotConfig = _props.plotConfig,
          hasMore = _props.hasMore,
          horizontal = _props.horizontal;
      var _state = this.state,
          indicatorData = _state.indicatorData,
          events = _state.events,
          xTicks = _state.xTicks,
          xScale = _state.xScale,
          offset = _state.offset,
          loadStatus = _state.loadStatus,
          domain = _state.domain;
      var _plotState2 = this._plotState,
          curBarWidth = _plotState2.curBarWidth,
          curStep = _plotState2.curStep;
      var spacing = plotConfig.spacing;


      var activePlotConfig = {
        step: curStep,
        barWidth: curBarWidth,
        spacing: spacing
      };
      return {
        data: data,
        chartType: chartType,
        xDateTicks: xDateTicks,
        preClosedPrice: Number.parseFloat(preClosedPrice),
        indicatorData: indicatorData,
        plotConfig: activePlotConfig,
        domain: domain,
        events: events,
        xTicks: xTicks,
        xScale: xScale,
        offset: offset,
        loadStatus: loadStatus,
        hasMore: hasMore,
        pressHandler: this._onPressHandler,
        horizontal: horizontal
      };
    }

    /**
     * 生命周期
     *
     * @memberof ChartContainer
     */

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._updateIndicatorData(this.props);
      this._resetDomain(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var props = this.props,
          state = this.state,
          _plotState = this._plotState;

      if (nextProps.chartType !== props.chartType || nextProps.chartType === 'timeline' && nextProps.totalTimelineDataCount !== props.totalTimelineDataCount) {
        // 假如图标类型或者状态信息发生变化，则更新domain。
        if (!nextProps.domain) {
          this._initDomain(nextProps);
        } else {
          this._resetDomain(nextProps);
        }
      } else if (nextProps.plotState && JSON.stringify(nextProps.plotState) !== JSON.stringify(_plotState) || nextProps.domain && JSON.stringify(nextProps.domain) !== JSON.stringify(state.domain)) {
        this._resetDomain(nextProps);
      } else if (nextProps.chartType === 'kline' && nextProps.xGridGap !== props.xGridGap || nextProps.chartType === 'timeline' && (nextProps.numberOfDays !== props.numberOfDays || nextProps.numberOfDays === 1 && JSON.stringify(nextProps.xDateTicks) !== JSON.stringify(props.xDateTicks))) {
        this._updateXTicks(state.domain, nextProps);
      }

      if (JSON.stringify(nextProps.data) !== JSON.stringify(props.data)) {
        // 假如数据有更新则更新指标数据
        this._updateIndicatorData(nextProps);
        if (nextProps.chartType === 'kline' && JSON.stringify(nextProps.domain) === JSON.stringify(state.domain) || nextProps.chartType === 'timeline' && !state.domain) {
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


    /**
     *  重置domain
     */


    /**
     * 初始化domain
     */


    /**
     * 数据源变更，则计算是否需要更新domain
     *
     * @memberof ChartContainer
     */


    /**
     * 更新domain
     *
     * @memberof ChartContainer
     */

  }, {
    key: '_updateXTicks',


    /**
     * 更新XTicks
     *
     * @param {any} domain
     * @param {any} props
     * @memberof ChartContainer
     */
    value: function _updateXTicks(domain, props) {
      var chartType = props.chartType,
          xDateTicks = props.xDateTicks,
          data = props.data,
          xGridGap = props.xGridGap,
          numberOfDays = props.numberOfDays;
      var start = domain.start,
          end = domain.end;

      var screenDataCount = end - start + 1;
      var xTicks = [];
      if (chartType === 'timeline') {
        if (numberOfDays === 1) {
          var ticksCount = xDateTicks.length;
          if (ticksCount > 1) {
            var gap = (screenDataCount - 1) / (ticksCount - 1);
            for (var idx = 0; idx < ticksCount; idx++) {
              xTicks.push(gap * idx);
            }
          }
        } else if (numberOfDays > 1) {
          var _gap = (screenDataCount - 1) / numberOfDays / 2;
          for (var _idx = 1; _idx < 10; _idx += 2) {
            xTicks.push(_gap * _idx);
          }
        }
      } else {
        for (var _idx2 = 0; _idx2 < screenDataCount - 1; _idx2++) {
          if ((data.length - 1 - start - _idx2) % xGridGap === 0) {
            xTicks.push(_idx2);
          }
        }
      }
      this.setState({
        xTicks: xTicks
      });
    }

    /**
     * 获取可显示的最大数据量
     */


    /**
     * 获取屏幕中显示的数据量
     */


    /**
     * 获取实际的Bar宽度
     */


    /**
     * 获取当前数据
     */


    /**
    *  布局模块
    *
    * @memberof ChartContainer
    */


    /**
     * 获取实际图表绘制区域宽度
     */


    /**
     * 手势处理
     *
     * @memberof ChartContainer
     */


    /**
     * 事件处理模块
     *
     * @memberof ChartContainer
     */

    /**
     * 点击事件处理
     */


    /**
     * 加载更多
     */


    /**
     *
     * 手势事件处理模块
     *
     * @memberof ChartContainer
     */

    /**
     * 单击
     */


    /**
     * 长按手势
     */


    // 双击


    // 放缩

  }, {
    key: 'render',


    /**
     * 渲染模块
     *
     * @returns
     * @memberof ChartContainer
     */
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          frame = _props2.frame,
          children = _props2.children,
          eventCaptures = _props2.eventCaptures;

      var style = {
        position: 'relative'
      };
      if (frame) {
        var padding = frame.padding,
            width = frame.width,
            height = frame.height;

        Object.assign(style, { padding: padding, width: width, height: height });
      } else {
        Object.assign(style, { flex: 1 });
      }
      Object.assign(style, this.props.style);

      return _react2.default.createElement(
        _reactNative.View,
        {
          ref: function ref(_ref) {
            _this2._containerView = _ref;
          },
          style: style,
          onLayout: function onLayout(e) {
            _this2._updateFrame(e);
          }
        },
        _react2.default.createElement(
          _EventCapture2.default,
          {
            style: { flex: 1 },
            eventCaptures: eventCaptures,
            onPan: this._onPan,
            onPress: this._onPress,
            onPinch: this._onPinch,
            onLongPress: this._onLongPress,
            onDoublePress: this._onDoublePress
          },
          children
        )
      );
    }
  }]);

  return ChartContainer;
}(_react.Component);

ChartContainer.defaultProps = {
  numberOfDays: 1,
  horizontal: false,
  statusBarHeight: 0,
  dataOffset: 0,
  eventCaptures: [],
  xDateTicks: [],
  plotConfig: {
    spacing: 2,
    barWidth: 6
  },
  scaleAlignment: ScaleAlignment.loc
};
ChartContainer.propsType = {
  // 图标类型 .e.g:timeline|kline,
  chartType: _propTypes2.default.string.isRequired,

  // 当图标类型为分时的时候，需要展示的天数，默认为当日分时
  numberOfDays: _propTypes2.default.number,

  // 是否为横屏
  horizontal: _propTypes2.default.bool,

  // 导航栏高度
  statusBarHeight: _propTypes2.default.number,

  // 数据偏移量
  dataOffset: _propTypes2.default.number,

  // 昨日收盘价
  preClosedPrice: _propTypes2.default.string,

  // 分时图的数据总量
  totalTimelineDataCount: _propTypes2.default.number,

  // 横坐标轴
  xDateTicks: _propTypes2.default.array,

  // 加载更多偏移阈值
  threshold: _propTypes2.default.number,

  // 指标
  indicators: _propTypes2.default.object,

  // 图表原始数据
  data: _propTypes2.default.array.isRequired,

  // 图表布局  eg: {x, y, width, height, padding:{left, right, top, bottom}}
  frame: _propTypes2.default.object,

  // 支持的手势
  eventCaptures: _propTypes2.default.array,

  // 显示的数据区间
  domain: _propTypes2.default.object,

  // 图表配置
  plotConfig: _propTypes2.default.object,

  // 图标状态 eg: {curScale, curBarWidth, curStep}
  plotState: _propTypes2.default.object,

  // 图标背景线间隔
  xGridGap: _propTypes2.default.number,

  // 放缩的对齐方式
  scaleAlignment: _propTypes2.default.string,

  // 是否还有更多历史数据
  hasMore: _propTypes2.default.bool,

  // 加载更多
  onLoadMore: _propTypes2.default.func,

  // 双击事件
  onDoublePress: _propTypes2.default.func,

  // 长按事件
  onLongPress: _propTypes2.default.func,

  // 滑动事件
  onPan: _propTypes2.default.func,

  // 更新Domain
  updateDomain: _propTypes2.default.func,

  // 更新plotState,主要是barWidth、step、scale的变化
  updatePlotState: _propTypes2.default.func };

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this._updateIndicatorData = function (props) {
    var data = props.data,
        indicators = props.indicators;

    if (data && data.length && indicators) {
      var plotData = {};
      plotData.fullData = data;
      if (!plotData.calcedData) plotData.calcedData = {};
      _util.CalculateUtil.indicatorsHelper(indicators, plotData);
      _this3.setState({
        indicatorData: plotData.calcedData
      });
    }
  };

  this._resetDomain = function (props) {
    var outerDomain = props.domain,
        outerPlotState = props.plotState;
    var domain = _this3.state.domain;

    var plotState = _this3._plotState;
    if (outerDomain) {
      if (outerPlotState) {
        if (JSON.stringify(outerPlotState) === JSON.stringify(plotState)) {
          if (JSON.stringify(outerDomain) !== JSON.stringify(domain)) {
            _this3._updateDomain(outerDomain, props);
          }
        } else {
          _this3._updateDomainWithPinch(null, outerPlotState.curScale / plotState.curScale, ScaleAlignment.center, null, null);
        }
      } else {
        var start = domain.start,
            end = domain.end;
        var outerStart = outerDomain.start,
            outerEnd = outerDomain.end;

        if (start !== outerStart || end !== outerEnd) {
          _this3._updateDomain(outerDomain, props);
        }
      }
    } else if (!domain) {
      _this3._initDomain(props);
    } else if (outerPlotState) {
      _this3._updateDomainWithPinch(null, outerPlotState.curScale / plotState.curScale, ScaleAlignment.center, null, null);
    }
  };

  this._initDomain = function (props) {
    var data = props.data,
        chartType = props.chartType,
        totalTimelineDataCount = props.totalTimelineDataCount;


    if (!_this3._frame || !data || !chartType) {
      return;
    }

    if (!data.length) {
      return;
    }

    if (_this3._frame.width) {
      if (chartType === 'timeline') {
        var domain = { start: 0, end: totalTimelineDataCount - 1 };
        _this3._updateDomain(domain, props);
      } else {
        var start = 0;
        var end = 0;
        var dataCount = data.length;
        var screenDataCount = _this3._getScreenDataCount(props, 1);
        var visibleDataCount = _this3._getVisibleDataCount(props, 1);
        if (!visibleDataCount) {
          return;
        }

        end = dataCount - 1;
        start = end - screenDataCount + 1;

        var _domain = { start: start, end: end };
        _this3._updateDomain(_domain, props);
      }
    }
  };

  this._updateDomainWithNewData = function (nextProps) {
    var data = nextProps.data,
        chartType = nextProps.chartType,
        totalTimelineDataCount = nextProps.totalTimelineDataCount;
    var domain = _this3.state.domain;

    if (!_this3._frame || !chartType || !data || !data.length) {
      return;
    }
    if (!domain) {
      _this3._initDomain(nextProps);
      return;
    }
    var start = domain.start,
        end = domain.end;

    var newStart = start;
    var newEnd = end;
    if (chartType === 'timeline') {
      newStart = 0;
      newEnd = totalTimelineDataCount - 1;
    } else {
      var dataCount = data.length;
      var screenDataCount = _this3._getScreenDataCount(nextProps, 1);
      var visibleDataCount = _this3._getVisibleDataCount(nextProps, 1);

      if (screenDataCount < visibleDataCount) {
        // 数据铺不满屏幕
        newStart = 0;
        newEnd = dataCount - 1;
      } else {
        var preScreenDataCount = end - start + 1;
        var preData = _this3.prop.data;

        if (preScreenDataCount < screenDataCount) {
          // 屏幕显示的数据量变多
          if (start + screenDataCount >= dataCount) {
            // 数据的最后超过了屏幕
            newEnd = dataCount - 1;
            newStart = end - screenDataCount + 1;
          } else {
            // 数据的最后没有超过屏幕
            newEnd = newStart + screenDataCount - 1;
          }
        } else if (preScreenDataCount > screenDataCount) {
          // 屏幕显示的数据量变少
          if (end === _this3.props.data.length - 1) {
            // 假如之前显示到了最后一个
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
        var newDomain = {
          start: start,
          end: end
        };
        _this3._updateDomain(newDomain, nextProps);
      }
    }
  };

  this._updateDomain = function (newDomain, props) {
    var chartType = props.chartType,
        updateDomain = props.updateDomain;
    var start = newDomain.start,
        end = newDomain.end;
    var curBarWidth = _this3._plotState.curBarWidth;

    var chartWidth = _this3._getChartWidth();
    var screenDataCount = end - start + 1;
    var indexDomain = void 0;
    var frame = { x: 0, chartWidth: chartWidth };
    if (chartType === 'timeline') {
      indexDomain = [0, screenDataCount - 1];
    } else {
      var visibleCount = _this3._getVisibleDataCount(props, 1);
      indexDomain = [0, visibleCount - 1];
      frame = { x: curBarWidth / 2, chartWidth: chartWidth - curBarWidth / 2 };
    }
    var xScale = (0, _scale.calculateXScale)(indexDomain, frame, 'index');
    _this3._updateXTicks(newDomain, props);
    _this3.setState({
      domain: newDomain,
      xScale: xScale
    });
    updateDomain && updateDomain(chartType, newDomain);
  };

  this._getVisibleDataCount = function (props, scale) {
    var plotConfig = props.plotConfig;
    var spacing = plotConfig.spacing;

    var actualBarWidth = _this3._getActualBarWidth(props);
    var chartWidth = _this3._getChartWidth();
    var visibleCount = Math.round((chartWidth - actualBarWidth * scale) / (spacing + actualBarWidth * scale) + 1);
    return visibleCount;
  };

  this._getScreenDataCount = function (props, scale) {
    var data = props.data;

    var dataCount = data.length;
    if (dataCount) {
      var visibleCount = _this3._getVisibleDataCount(props, scale);
      if (dataCount < visibleCount) {
        return dataCount;
      } else {
        return visibleCount;
      }
    } else {
      return 0;
    }
  };

  this._getActualBarWidth = function (props) {
    var plotConfig = props.plotConfig;

    var plotState = _this3._plotState;
    var actualBarWidth = null;
    if (plotState) {
      var curBarWidth = plotState.curBarWidth;

      actualBarWidth = curBarWidth;
    } else {
      var barWidth = plotConfig.barWidth;

      actualBarWidth = barWidth;
    }
    return actualBarWidth;
  };

  this._getCurrentItemData = function (data, domain, xScale, locationX) {
    var actualData = data.slice(domain.start, domain.end + 1);
    var currentItemIdx = (0, _util.getCurrentItem)(xScale, null, [locationX], actualData, 'index');
    var currentItem = actualData[currentItemIdx];
    return currentItem;
  };

  this._updateFrame = function () {
    var _props3 = _this3.props,
        frame = _props3.frame,
        horizontal = _props3.horizontal,
        statusBarHeight = _props3.statusBarHeight;
    // 当没有通过props指定frame时更新。

    if (!frame) {
      var containerView = _reactNative2.default.findNodeHandle(_this3._containerView);
      _reactNative.UIManager.measureInWindow(containerView, function (x, y, width, height) {
        var _props$style = _this3.props.style,
            padding = _props$style.padding,
            paddingHorizontal = _props$style.paddingHorizontal,
            paddingVertical = _props$style.paddingVertical,
            paddingLeft = _props$style.paddingLeft,
            paddingRight = _props$style.paddingRight,
            paddingTop = _props$style.paddingTop,
            paddingBottom = _props$style.paddingBottom;

        var left = paddingLeft || paddingHorizontal || padding || 0;
        var right = paddingRight || paddingHorizontal || padding || 0;
        var top = paddingTop || paddingVertical || padding || 0;
        var bottom = paddingBottom || paddingVertical || padding || 0;
        if (horizontal) {
          if (_reactNative.Platform.OS === 'ios') {
            _this3._frame = {
              x: y,
              y: screenWidth - width - x,
              width: height,
              height: width,
              padding: {
                top: top,
                left: left,
                bottom: bottom,
                right: right
              }
            };
          } else {
            _this3._frame = {
              x: y + statusBarHeight,
              y: screenWidth - x,
              width: width,
              height: height,
              padding: {
                top: top,
                left: left,
                bottom: bottom,
                right: right
              }
            };
          }
        } else {
          _this3._frame = {
            x: x,
            y: y,
            width: width,
            height: height,
            padding: {
              top: top,
              left: left,
              bottom: bottom,
              right: right
            }
          };
        }
        _this3._resetDomain(_this3.props);
      });
    }
  };

  this._getChartWidth = function () {
    if (_this3._frame) {
      var _frame = _this3._frame,
          width = _frame.width,
          padding = _frame.padding;
      var left = padding.left,
          right = padding.right;

      var chartWidth = width - left - right;
      return chartWidth;
    }
    return 0;
  };

  this._updateDomainWithPan = function (dx, dy) {
    var _props4 = _this3.props,
        data = _props4.data,
        horizontal = _props4.horizontal;
    var domain = _this3.state.domain;
    var curStep = _this3._plotState.curStep;

    var dataCount = data.length;
    var start = domain.start,
        end = domain.end;

    if (horizontal) {
      dx = dy;
    }
    if (end === dataCount - 1 && dx < 0) {
      return;
    }

    if (start === 0 && dx > 0) {
      var actualDX = dx - curStep * _this3._currentMovedItem;
      _this3.setState({
        offset: actualDX
      });
    } else {
      var shouldUpdate = false;
      var movedItem = Math.floor(dx / curStep);
      var changeItemCount = movedItem - _this3._currentMovedItem;
      if (Math.abs(changeItemCount) >= 1) {
        _this3._currentMovedItem = movedItem;
        var screenDataCount = end - start + 1;
        if (start - changeItemCount < 0) {
          if (start !== 0) {
            start = 0;
            end = start + screenDataCount - 1;
            shouldUpdate = true;
          } else {
            shouldUpdate = false;
          }
        } else {
          var rightIndex = start + screenDataCount;
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
          var newDomain = {
            start: start,
            end: end
          };
          _this3._updateDomain(newDomain, _this3.props);
        }
      }
    }
  };

  this._updateDomainWithPinch = function (e, scale, alignment, loc, updateActiveSpan) {
    var props = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _this3.props;
    var plotConfig = props.plotConfig,
        data = props.data,
        updatePlotState = props.updatePlotState;
    var domain = _this3.state.domain;
    var _plotState3 = _this3._plotState,
        curStep = _plotState3.curStep,
        curScale = _plotState3.curScale,
        curBarWidth = _plotState3.curBarWidth;
    var maxScale = plotConfig.maxScale,
        minScale = plotConfig.minScale,
        barWidth = plotConfig.barWidth,
        spacing = plotConfig.spacing;
    var start = domain.start,
        end = domain.end;

    if (curScale >= maxScale && scale > 1 || curScale <= minScale && scale < 1) {
      return;
    }
    if (curScale * scale > maxScale && scale > 1) {
      scale = maxScale / curScale;
    } else if (curScale * scale < minScale && scale < 1) {
      scale = minScale / curScale;
    }

    var chartWidth = _this3._getChartWidth();
    var dataCount = data.length;
    var threshold = 1;
    var preScreenDataCount = end - start + 1;
    if (start === 0 || start + preScreenDataCount === dataCount) {
      threshold = 1;
    } else if (alignment === ScaleAlignment.center || alignment === ScaleAlignment.loc) {
      threshold = 2;
    }
    if (Math.abs(1 - scale) * chartWidth < threshold * (spacing + curBarWidth * scale)) {
      return;
    }

    var screenDataCount = _this3._getScreenDataCount(props, scale);
    if (alignment === ScaleAlignment.left) {
      if (start + screenDataCount > dataCount) {
        if (preScreenDataCount < screenDataCount) {
          screenDataCount = dataCount - start;
          end = dataCount - 1;
          var currentBarWidth = (chartWidth - barWidth) / (screenDataCount - 1) - spacing;
          curScale = currentBarWidth / barWidth;
        } else if (start <= 0) {
          return;
        } else {
          _this3._updateDomainWithPinch(e, scale, ScaleAlignment.right, loc, updateActiveSpan);
        }
      } else {
        curScale *= scale;
        end = start + screenDataCount - 1;
      }
    } else if (alignment === ScaleAlignment.right) {
      var rightIndex = start + preScreenDataCount - 1;
      var leftIndex = rightIndex - screenDataCount + 1;
      if (leftIndex < 0) {
        if (start > 0) {
          start = 0;
          screenDataCount = rightIndex + 1;
          end = start + screenDataCount - 1;
          var _currentBarWidth = (chartWidth - curBarWidth) / (screenDataCount - 1) - spacing;
          curScale = _currentBarWidth / barWidth;
        } else if (rightIndex >= dataCount) {
          return;
        } else {
          _this3._updateDomainWithPinch(e, scale, ScaleAlignment.left, loc, updateActiveSpan);
        }
      } else {
        curScale *= scale;
        start = rightIndex - screenDataCount + 1;
        end = start + screenDataCount - 1;
      }
    } else if (alignment === ScaleAlignment.center || alignment === ScaleAlignment.loc) {
      var _rightIndex = start + preScreenDataCount - 1;
      if (start === 0 && scale < 1) {
        _this3._updateDomainWithPinch(e, scale, ScaleAlignment.left, loc, updateActiveSpan);
      }
      if (_rightIndex === dataCount - 1 && scale < 1) {
        _this3._updateDomainWithPinch(e, scale, ScaleAlignment.right, loc, updateActiveSpan);
      }
      var locRatio = 0.5;
      if (ScaleAlignment.loc === alignment) {
        locRatio = loc / chartWidth;
      }
      var changeCount = screenDataCount - preScreenDataCount;
      var leftChangeCount = Math.round(changeCount * locRatio);
      var rightChangeCount = changeCount - leftChangeCount;
      if (start - leftChangeCount < 0) {
        rightChangeCount = changeCount - start;
        start = 0;
        if (_rightIndex + rightChangeCount + 1 >= dataCount) {
          var _currentBarWidth2 = (chartWidth - curBarWidth) / (screenDataCount - 1) - spacing;
          curScale = _currentBarWidth2 / barWidth;
        } else {
          curScale *= scale;
        }
        end = start + screenDataCount - 1;
      } else if (_rightIndex + rightChangeCount + 1 >= dataCount) {
        leftChangeCount = changeCount - (dataCount - 1 - _rightIndex);
        _rightIndex = dataCount - 1;
        if (start - leftChangeCount < 0) {
          start = 0;
          screenDataCount = dataCount;
          var _currentBarWidth3 = (chartWidth - curBarWidth) / (screenDataCount - 1) - spacing;
          curScale = _currentBarWidth3 / barWidth;
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

    var curVisibleCount = Math.round((chartWidth - barWidth * curScale) / (spacing + barWidth * curScale) + 1);
    curStep = (chartWidth - barWidth * curScale) / (curVisibleCount - 1);
    curBarWidth = curStep - spacing;
    curScale = curBarWidth / barWidth;

    var newPlotState = {
      curBarWidth: curBarWidth,
      curStep: curStep,
      curScale: curScale
    };
    if (JSON.stringify(_this3._plotState) !== JSON.stringify(newPlotState)) {
      _this3._plotState = newPlotState;
    }
    if (JSON.stringify(newPlotState) !== JSON.stringify(props.plotState)) {
      updatePlotState && updatePlotState(newPlotState);
    }
    var newDomain = {
      start: start,
      end: end
    };
    if (JSON.stringify(newDomain) !== JSON.stringify(domain)) {
      _this3._updateDomain(newDomain, props, curVisibleCount, newPlotState);
    }
    updateActiveSpan && updateActiveSpan(e);
  };

  this._onPressHandler = function (pressEvent, key) {
    var onPress = _this3.props.onPress;

    onPress && onPress(pressEvent, key);
    var events = _this3.state.events;

    var updateEvents = Object.assign({}, events);
    updateEvents.pressEvent = null;
    _this3.setState({
      events: updateEvents
    });
  };

  this._onLoadMore = function () {
    var onLoadMore = _this3.props.onLoadMore;

    if (onLoadMore) {
      onLoadMore().then(function () {
        _this3._currentMovedItem = 0;
        _this3.setState({
          loadStatus: 'preload',
          offset: 0
        });
      }).catch(function () {
        _this3._currentMovedItem = 0;
        _this3.setState({
          loadStatus: 'preload',
          offset: 0
        });
      });
    }
  };

  this._onPan = function (eventState, e, gestureState) {
    var onPan = _this3.props.onPan;

    if (eventState === _EventCapture2.default.EventState.end) {
      var _props5 = _this3.props,
          threshold = _props5.threshold,
          hasMore = _props5.hasMore;
      var offset = _this3.state.offset;

      if (hasMore) {
        if (offset > threshold) {
          _this3._onLoadMore();
          _this3.setState({
            loadStatus: 'loading'
          });
        } else {
          _this3._currentMovedItem = 0;
          _this3.setState({
            offset: 0
          });
        }
      } else {
        _this3._currentMovedItem = 0;
        _this3.setState({
          offset: 0
        });
      }
      onPan && onPan(null, null);
    } else {
      var dx = gestureState.dx,
          dy = gestureState.dy;

      _this3._updateDomainWithPan(dx, dy);
      if (onPan) {
        onPan(dx, dy);
      }
    }
  };

  this._onPress = function (eventState, e) {
    var events = _this3.state.events;
    var horizontal = _this3.props.horizontal;

    if (_this3._frame && events) {
      var _frame2 = _this3._frame,
          x = _frame2.x,
          y = _frame2.y,
          padding = _frame2.padding;
      var left = padding.left,
          top = padding.top;
      var _e$nativeEvent = e.nativeEvent,
          pageX = _e$nativeEvent.pageX,
          pageY = _e$nativeEvent.pageY;

      if (horizontal) {
        var tempX = pageX;
        pageX = pageY;
        pageY = screenWidth - tempX;
      }
      var locationX = pageX - x - left;
      var locationY = pageY - y - top;
      var updateEvents = Object.assign({}, events);
      updateEvents.pressEvent = {
        x: locationX,
        y: locationY
      };
      _this3.setState({
        events: updateEvents
      });
    }
  };

  this._onLongPress = function (eventState, e) {
    var _props6 = _this3.props,
        onLongPress = _props6.onLongPress,
        data = _props6.data,
        horizontal = _props6.horizontal,
        dataOffset = _props6.dataOffset;
    var _state2 = _this3.state,
        events = _state2.events,
        domain = _state2.domain,
        xScale = _state2.xScale;


    var updateEvents = Object.assign({}, events);
    if (eventState === _EventCapture2.default.EventState.end) {
      updateEvents.longPressEvent = null;
      if (typeof onLongPress === 'function') {
        onLongPress(null);
      }
    } else if (e && e.nativeEvent && _this3._frame && xScale) {
      var _frame3 = _this3._frame,
          x = _frame3.x,
          y = _frame3.y,
          width = _frame3.width,
          padding = _frame3.padding;
      var left = padding.left,
          right = padding.right,
          top = padding.top;
      var _e$nativeEvent2 = e.nativeEvent,
          pageX = _e$nativeEvent2.pageX,
          pageY = _e$nativeEvent2.pageY;
      var locX = e.nativeEvent.locationX;

      var locationY = pageY - y - top;
      var locationX = void 0;
      if (horizontal) {
        var tempX = pageX;
        pageX = pageY;
        pageY = screenWidth - tempX;
        locationX = pageX - x - left;
      } else if (_reactNative.Platform.OS === 'ios') {
        locationX = locX;
      } else {
        locationX = pageX - x - left;
      }
      var rightSide = xScale(data.length - 1);
      var leftSide = xScale(dataOffset);
      var actualWidth = width - left - right;
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
        y: locationY
      };

      // 将currentItem数据传入onLongPress回调
      if (typeof onLongPress === 'function') {
        var currentItem = _this3._getCurrentItemData(data, domain, xScale, updateEvents.longPressEvent.x);
        onLongPress(currentItem);
      }
    }

    _this3.setState({
      events: updateEvents
    });
  };

  this._onDoublePress = function () {
    var onDoublePress = _this3.props.onDoublePress;

    onDoublePress && onDoublePress();
  };

  this._onPinch = function (eventState, e, totalScale, activeScale, updateActiveSpan) {
    if (e && e.nativeEvent) {
      var touches = e.nativeEvent.touches;

      var loc = _this3._frame.width / 2;
      if (touches && touches.length === 2) {
        loc = (touches[0].locationX + touches[1].locationX) / 2;
      }
      _this3._updateDomainWithPinch(e, activeScale, ScaleAlignment.loc, loc, updateActiveSpan);
    }
  };
};

exports.default = ChartContainer;


ChartContainer.childContextTypes = {
  data: _propTypes2.default.array,
  chartType: _propTypes2.default.string,
  xDateTicks: _propTypes2.default.array,
  preClosedPrice: _propTypes2.default.number,
  indicatorData: _propTypes2.default.object,
  plotConfig: _propTypes2.default.object,
  domain: _propTypes2.default.object,
  events: _propTypes2.default.object,
  xTicks: _propTypes2.default.array,
  xScale: _propTypes2.default.func,
  offset: _propTypes2.default.number,
  loadStatus: _propTypes2.default.string,
  hasMore: _propTypes2.default.bool,
  pressHandler: _propTypes2.default.func,
  horizontal: _propTypes2.default.bool
};