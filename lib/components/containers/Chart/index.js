'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactNative = require('react-native');

var _lodash = require('lodash.flattendeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _scale = require('../../../scale');

var _util = require('../../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Chart组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Surface = _reactNative.ART.Surface,
    Group = _reactNative.ART.Group;

var Chart = function (_Component) {
  _inherits(Chart, _Component);

  /**
   * 构造方法+类变量+组件状态
   * @param {any} props
   * @memberof Chart
   */

  /**
   * 组件属性区
   *
   * @static
   * @memberof Chart
   */
  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props));

    _initialiseProps.call(_this);

    _this._frame = {
      x: 0, y: 0, width: 0, height: 0
    };
    _this.state = {
      yScale: null,
      yTicks: [],
      maxValue: null,
      minValue: null
    };
    return _this;
  }

  /**
   * context
   *
   * @returns
   * @memberof Chart
   */


  _createClass(Chart, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _state = this.state,
          yScale = _state.yScale,
          yTicks = _state.yTicks,
          currentItem = _state.currentItem;
      var _frame = this._frame;

      return {
        frame: _frame,
        yScale: yScale,
        yTicks: yTicks,
        currentItem: currentItem
      };
    }

    /**
     * 生命周期
     *
     * @memberof Chart
     */

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextContext) {
      if (nextContext) {
        var data = nextContext.data,
            domain = nextContext.domain,
            events = nextContext.events,
            xScale = nextContext.xScale,
            pressHandler = nextContext.pressHandler;
        var chartKey = nextProps.chartKey;

        this._updateYScale(nextContext, nextProps);
        var longPressEvent = events.longPressEvent,
            pressEvent = events.pressEvent;

        if (longPressEvent && data && domain) {
          var actualData = data.slice(domain.start, domain.end + 1);
          var currentItemIdx = (0, _util.getCurrentItem)(xScale, null, [longPressEvent.x, longPressEvent.y], actualData, 'index');
          var currentItem = {
            x: xScale(currentItemIdx),
            y: longPressEvent.y
          };
          this.setState({
            currentItem: currentItem
          });
        }
        if (pressEvent) {
          var _frame2 = this._frame,
              x = _frame2.x,
              y = _frame2.y,
              height = _frame2.height,
              width = _frame2.width;

          if (pressEvent.x > x && pressEvent.x < x + width && pressEvent.y > y && pressEvent.y < y + height) {
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


    /**
     * 更新Y轴value到坐标的映射函数
     *
     * @memberof Chart
     */


    /**
     * 更新极值
     *
     * @memberof Chart
     */


    /**
     * 计算极值
     *
     * @memberof Chart
     */


    /**
     * 获取目标数据
     *
     * @memberof Chart
     */

  }, {
    key: 'render',


    /**
     * 渲染区
     *
     * @returns
     * @memberof Chart
     */
    value: function render() {
      var _this2 = this;

      var _frame3 = this._frame,
          width = _frame3.width,
          height = _frame3.height;
      var children = this.props.children;

      return _react2.default.createElement(
        _reactNative.View,
        {
          style: this.props.style,
          onLayout: function onLayout(e) {
            _this2._updateFrame(e);
          }
        },
        _react2.default.createElement(
          Surface,
          { width: width, height: height + this.props.insetBottom, style: { position: 'relative' } },
          _react2.default.createElement(
            Group,
            null,
            children
          )
        )
      );
    }
  }]);

  return Chart;
}(_react.Component);

Chart.defaultProps = {
  indicators: [],
  insetBottom: 0,
  yAxisMargin: 0,
  yGridNum: 4,
  minValueGap: 0.01
};
Chart.propsType = {
  // 数据选择器
  yExtents: _propTypes2.default.arrayOf(_propTypes2.default.func).isRequired,
  // Chart中包含的指标Keys
  indicators: _propTypes2.default.array,
  // 底部缩进距离
  insetBottom: _propTypes2.default.number,
  // Y轴极值距边界的距离
  yAxisMargin: _propTypes2.default.number,
  // Y轴网格的数量
  yGridNum: _propTypes2.default.number,
  // 网格线之间最小数值差
  minValueGap: _propTypes2.default.number };

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this._updateFrame = function (e) {
    var insetBottom = _this3.props.insetBottom;
    var _e$nativeEvent$layout = e.nativeEvent.layout,
        x = _e$nativeEvent$layout.x,
        y = _e$nativeEvent$layout.y,
        width = _e$nativeEvent$layout.width,
        height = _e$nativeEvent$layout.height;

    _this3._frame = {
      x: x, y: y, width: width, height: height - insetBottom
    };
    _this3._updateYScale(_this3.context, _this3.props, true);
  };

  this._updateYScale = function (context, props) {
    var forceUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var data = context.data,
        domain = context.domain;
    var yGridNum = props.yGridNum,
        yAxisMargin = props.yAxisMargin,
        chartKey = props.chartKey;

    if (data && data.length && domain && _this3._frame && _this3._frame.height) {
      var _calcLimitValue = _this3._calcLimitValue(context, props),
          max = _calcLimitValue.max,
          min = _calcLimitValue.min;

      var _state2 = _this3.state,
          maxValue = _state2.maxValue,
          minValue = _state2.minValue;

      if (!forceUpdate && max === maxValue && min === minValue) {
        return;
      }
      _this3._updateLimitValue(max, min);
      var gap = max - min;
      max += yAxisMargin / (_this3._frame.height - 2 * yAxisMargin) * gap;
      min -= yAxisMargin / (_this3._frame.height - 2 * yAxisMargin) * gap;
      gap = max - min;
      var item = gap / yGridNum;
      var yTicks = [];
      for (var index = 0; index < yGridNum + 1; index++) {
        if (!(chartKey === 'tech' && yGridNum === 2 && index === 1)) {
          yTicks.push(min + index * item);
        }
      }
      var limitData = [min, max];
      _this3.setState({
        yScale: (0, _scale.calculateYScale)(limitData, { chartHeight: _this3._frame.height }),
        yTicks: yTicks
      });
    }
  };

  this._updateLimitValue = function (max, min) {
    _this3.setState({
      maxValue: max,
      minValue: min
    });
  };

  this._calcLimitValue = function (context, props) {
    var data = context.data,
        indicatorData = context.indicatorData,
        domain = context.domain;
    var _context = _this3.context,
        chartType = _context.chartType,
        preClosedPrice = _context.preClosedPrice;
    var yExtents = props.yExtents,
        indicators = props.indicators,
        minValueGap = props.minValueGap,
        yGridNum = props.yGridNum;
    var start = domain.start,
        end = domain.end;

    var max = Number.MIN_VALUE;
    var min = Number.MAX_VALUE;
    var screenData = void 0;
    var yValues = [];
    if (chartType === 'timeline') {
      screenData = data;
    } else {
      screenData = data.slice(start, end + 1);
    }
    if (Array.isArray(yExtents) && yExtents.length) {
      yValues = yExtents.map(function (extent) {
        return screenData.map(_this3.calculateValues(extent));
      });
    }
    if (Array.isArray(indicators) && indicatorData) {
      yValues = yValues.concat(indicators.map(function (dataKey) {
        var indicatorDataElem = indicatorData[dataKey];
        if (indicatorDataElem) {
          var screenIndicatorData = indicatorDataElem.slice(start, end + 1);
          screenIndicatorData = _util.CalculateUtil.enumerateIndicator(screenIndicatorData);
          return screenIndicatorData;
        }
        return '-';
      }));
    }
    var allValues = (0, _lodash2.default)(yValues);

    allValues.forEach(function (value) {
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
      var gapValue = Math.max(Math.abs(max - preClosedPrice), Math.abs(min - preClosedPrice));
      max = preClosedPrice + gapValue;
      min = preClosedPrice - gapValue;
    }

    if (max === Number.MIN_VALUE && min === Number.MAX_VALUE) {
      max = 0;
      min = 0;
    }

    var gap = 0;
    var totalMinValueGap = minValueGap * yGridNum;
    if (max - min < totalMinValueGap) {
      gap = totalMinValueGap / 2;
    }

    max += gap;
    min -= gap;

    return { max: max, min: min };
  };

  this.calculateValues = function (func) {
    return function (d) {
      var obj = typeof func === 'function' ? func(d) : func;
      var dataArray = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj) ? Object.keys(obj).map(function (key) {
        return obj[key];
      }) : obj;
      return dataArray;
    };
  };
};

exports.default = Chart;


Chart.contextTypes = {
  data: _propTypes2.default.array,
  chartType: _propTypes2.default.string,
  preClosedPrice: _propTypes2.default.number,
  indicatorData: _propTypes2.default.object,
  domain: _propTypes2.default.object,
  events: _propTypes2.default.object,
  xTicks: _propTypes2.default.array,
  xScale: _propTypes2.default.func,
  pressHandler: _propTypes2.default.func
};

Chart.childContextTypes = {
  frame: _propTypes2.default.object,
  yScale: _propTypes2.default.func,
  yTicks: _propTypes2.default.array,
  currentItem: _propTypes2.default.object
};