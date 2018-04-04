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

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _util = require('../../../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 坐标组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Group = _reactNative.ART.Group,
    Text = _reactNative.ART.Text;

var Coordinate = function (_Component) {
  _inherits(Coordinate, _Component);

  function Coordinate() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Coordinate);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Coordinate.__proto__ || Object.getPrototypeOf(Coordinate)).call.apply(_ref, [this].concat(args))), _this), _this._updateTicksInfo = function () {
      var _this$props = _this.props,
          position = _this$props.position,
          preClosedPrice = _this$props.preClosedPrice,
          tickPos = _this$props.tickPos,
          isTimestamp = _this$props.isTimestamp,
          dateFormat = _this$props.dateFormat,
          timezone = _this$props.timezone,
          color = _this$props.color,
          riseColor = _this$props.riseColor,
          fallColor = _this$props.fallColor,
          fontFamily = _this$props.fontFamily,
          fontWeight = _this$props.fontWeight,
          fontSize = _this$props.fontSize;
      var _this$context = _this.context,
          data = _this$context.data,
          domain = _this$context.domain,
          xScale = _this$context.xScale,
          yScale = _this$context.yScale,
          frame = _this$context.frame,
          xTicks = _this$context.xTicks,
          yTicks = _this$context.yTicks,
          xDateTicks = _this$context.xDateTicks,
          offset = _this$context.offset;

      var font = { fontFamily: fontFamily, fontWeight: fontWeight, fontSize: fontSize };
      var ticks = null;
      if (position === 'left' || position === 'right') {
        if (yScale && yTicks && frame && frame.height && frame.width) {
          var yTicksCount = yTicks.length;
          if (yTicksCount) {
            ticks = yTicks.map(function (tick, i) {
              var y = yScale(tick) - 5;
              if (i === 0) {
                y = yScale(tick) - 20;
              } else if (i === yTicksCount - 1) {
                y = yScale(tick) + 10;
              }
              var x = 5;
              if (position === 'right') {
                x = frame.width - 35;
              }
              var tickTextColor = color;
              if (preClosedPrice && !Number.isNaN(+preClosedPrice)) {
                if (+tick < +preClosedPrice) tickTextColor = fallColor;
                if (+tick > +preClosedPrice) tickTextColor = riseColor;
                if (position === 'right') {
                  tick = (tick - preClosedPrice) / preClosedPrice * 100;
                  tick = tick.toFixed(2) + '%';
                } else {
                  tick = tick.toFixed(2);
                }
              } else {
                tick = tick.toFixed(2);
              }
              var key = 'text' + i;
              return _react2.default.createElement(
                Text,
                { key: key, fill: tickTextColor, font: font, x: x, y: y },
                tick
              );
            });
          }
        }
      } else if (position === 'top' || position === 'bottom') {
        if (xScale && xTicks && xTicks.length && data && data.length && domain && frame && frame.width) {
          var start = domain.start,
              end = domain.end;

          if (xDateTicks && xDateTicks.length) {
            ticks = xTicks.map(function (tick, i) {
              var centerX = xScale(tick);
              var text = xDateTicks[i];
              var x = void 0;
              var y = void 0;
              if (tickPos && tickPos === 'center') x = centerX + offset - _this.props.centerTickOffset;else x = centerX - 10 + offset;
              y = 5;
              if (x < 10) {
                x = 10;
              }
              if (tickPos !== 'center' && i === xTicks.length - 1) {
                x = centerX - 30;
              }
              if (position === 'bottom') {
                y = frame.height + 10;
              }
              var key = 'text' + i;
              return _react2.default.createElement(
                Text,
                { key: key, fill: color, font: font, x: x, y: y },
                text
              );
            });
          } else {
            var actualData = data.slice(start, end);
            if (actualData) {
              ticks = xTicks.map(function (tick, i) {
                var centerX = xScale(tick);
                if (actualData[tick]) {
                  var text = actualData[tick][0];
                  if (isTimestamp) {
                    text = _momentTimezone2.default.tz(text, timezone).format(dateFormat);
                  } else {
                    var timestamp = (0, _util.getTimestamp)(text, timezone);
                    text = _momentTimezone2.default.tz(timestamp, timezone).format(dateFormat);
                  }
                  var x = centerX - 25 + offset;
                  var y = 5;
                  if (position === 'bottom') {
                    y = frame.height + 10;
                  }
                  var key = 'text' + i;
                  return _react2.default.createElement(
                    Text,
                    { key: key, fill: color, font: font, x: x, y: y },
                    text
                  );
                }
                return null;
              });
            }
          }
        }
      }
      return ticks;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * 组件属性
   *
   * @static
   * @memberof Coordinate
   */


  _createClass(Coordinate, [{
    key: 'shouldComponentUpdate',


    /**
     * 生命周期
     *
     */
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var shouldUpdate = false;
      var testNumber = 10;
      var props = this.props,
          context = this.context;

      if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
        shouldUpdate = true;
      } else if (props.position === 'left' || props.position === 'right') {
        var preYScale = context.yScale;
        var yScale = nextContext.yScale;

        if (yScale === null || preYScale === null) {
          shouldUpdate = true;
        } else if (preYScale(testNumber) !== yScale(testNumber) || JSON.stringify(context.yTicks) !== JSON.stringify(nextContext.yTicks) || JSON.stringify(context.frame) !== JSON.stringify(nextContext.frame)) {
          shouldUpdate = true;
        }
      } else if (props.position === 'top' || props.position === 'bottom') {
        var preXScale = context.xScale;
        var xScale = nextContext.xScale;

        if (xScale === null || preXScale === null) {
          shouldUpdate = true;
        } else if (context.xScale(testNumber) !== nextContext.xScale(testNumber) || JSON.stringify(context.data) !== JSON.stringify(nextContext.data) || JSON.stringify(context.frame) !== JSON.stringify(nextContext.frame) || JSON.stringify(context.domain) !== JSON.stringify(nextContext.domain) || JSON.stringify(context.xTicks) !== JSON.stringify(nextContext.xTicks)) {
          shouldUpdate = true;
        }
      }
      return shouldUpdate;
    }

    /**
     * 更新坐标信息
     */

  }, {
    key: 'render',


    /**
     * 绘制区
     *
     * @returns
     * @memberof Coordinate
     */
    value: function render() {
      var ticks = this._updateTicksInfo();
      return _react2.default.createElement(
        Group,
        null,
        ticks
      );
    }
  }]);

  return Coordinate;
}(_react.Component);

Coordinate.defaultProps = {
  isTimestamp: true,
  dateFormat: 'MM-DD HH:mm',
  timezone: 'Asia/Shanghai',
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  fontSize: 9,
  color: '#8F8F8F',
  riseColor: '#F05B48',
  fallColor: '#10BC90',
  centerTickOffset: 10
};
Coordinate.propTypes = {
  // top|bottom|left|right
  position: _propTypes2.default.string.isRequired,
  // 是否是时间戳
  isTimestamp: _propTypes2.default.bool,
  // 日期格式
  dateFormat: _propTypes2.default.string,
  // 时区
  timezone: _propTypes2.default.string,
  // 字体大小
  fontSize: _propTypes2.default.number,
  // 字体集
  fontFamily: _propTypes2.default.string,
  // 字重
  fontWeight: _propTypes2.default.string,
  // 字体颜色
  color: _propTypes2.default.string,
  // 上涨字体颜色
  riseColor: _propTypes2.default.string,
  // 下跌字体颜色
  fallColor: _propTypes2.default.string,
  // 五日图横坐标offset
  centerTickOffset: _propTypes2.default.number };
exports.default = Coordinate;


Coordinate.contextTypes = {
  data: _propTypes2.default.array,
  domain: _propTypes2.default.object,
  frame: _propTypes2.default.object,
  xScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func,
  xTicks: _propTypes2.default.array,
  yTicks: _propTypes2.default.array,
  xDateTicks: _propTypes2.default.array,
  offset: _propTypes2.default.number
};