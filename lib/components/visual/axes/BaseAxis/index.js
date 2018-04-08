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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 抽象Axis类和helper函数
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * TODO:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 通过scale生成ticks
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group,
    Text = _reactNative.ART.Text;

var BaseAxis = function (_Component) {
  _inherits(BaseAxis, _Component);

  function BaseAxis() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BaseAxis);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BaseAxis.__proto__ || Object.getPrototypeOf(BaseAxis)).call.apply(_ref, [this].concat(args))), _this), _this._caculateGridPath = function () {
      var type = _this.props.type;
      var _this$context = _this.context,
          xTicks = _this$context.xTicks,
          yTicks = _this$context.yTicks,
          frame = _this$context.frame,
          xScale = _this$context.xScale,
          yScale = _this$context.yScale;

      var path = Path();
      if (frame) {
        if (type === 'XAxis' && xTicks && xScale) {
          var ticksCount = xTicks.length;
          for (var index = 0; index < ticksCount; index++) {
            var tickIndex = xTicks[index];
            var x = xScale(tickIndex);
            path.moveTo(x, 0);
            path.lineTo(x, frame.height);
          }
        } else if (type === 'YAxis' && yTicks && yScale) {
          var _ticksCount = yTicks.length;
          for (var _index = 1; _index < _ticksCount - 1; _index++) {
            var _tickIndex = yTicks[_index];
            var y = yScale(_tickIndex);
            if (y) {
              path.moveTo(0, y);
              path.lineTo(frame.width, y);
            }
          }
        }
      }
      return path;
    }, _this._renderGridLines = function () {
      var _this$props = _this.props,
          showGridLine = _this$props.showGridLine,
          stroke = _this$props.stroke,
          strokeWidth = _this$props.strokeWidth,
          strokeDash = _this$props.strokeDash;

      if (showGridLine) {
        var path = _this._caculateGridPath();
        if (path) {
          var gridLines = _react2.default.createElement(Shape, { d: path, stroke: stroke, strokeDash: strokeDash, strokeWidth: strokeWidth });
          return gridLines;
        }
      }
      return null;
    }, _this._renderTicks = function () {
      var _this$props2 = _this.props,
          type = _this$props2.type,
          position = _this$props2.position,
          showTicks = _this$props2.showTicks,
          textColor = _this$props2.textColor,
          fontFamily = _this$props2.fontFamily,
          fontWeight = _this$props2.fontWeight,
          fontSize = _this$props2.fontSize;
      var _this$context2 = _this.context,
          xScale = _this$context2.xScale,
          data = _this$context2.data,
          domain = _this$context2.domain,
          frame = _this$context2.frame,
          xTicks = _this$context2.xTicks,
          yTicks = _this$context2.yTicks,
          yScale = _this$context2.yScale,
          chartType = _this$context2.chartType,
          xDateTicks = _this$context2.xDateTicks;
      var start = domain.start,
          end = domain.end;

      var font = { fontFamily: fontFamily, fontWeight: fontWeight, fontSize: fontSize };
      if (showTicks) {
        if (type === 'XAxis') {
          if (xTicks.length && data && data.length) {
            var ticks = [];
            if (chartType === 'timeline') {
              ticks = xTicks.map(function (tick, i) {
                var centerX = xScale(tick);
                var text = xDateTicks[i];
                var x = centerX - 15;
                var y = 5;
                if (x < 10) {
                  x = 10;
                }
                if (i === xTicks.length - 1) {
                  x = centerX - 40;
                }
                if (position === 'bottom') {
                  y = frame.height + 5;
                }
                var key = 'text' + i;

                return _react2.default.createElement(
                  Text,
                  { key: key, fill: textColor, font: font, x: x, y: y },
                  text
                );
              });
            } else {
              var actualData = data.slice(start, end);
              ticks = xTicks.map(function (tick, i) {
                var centerX = xScale(tick);
                var text = actualData[tick][0];
                var x = centerX - 25;
                var y = 5;
                if (position === 'bottom') {
                  y = frame.height + 5;
                }
                var key = 'text' + i;
                return _react2.default.createElement(
                  Text,
                  { key: key, fill: textColor, font: font, x: x, y: y },
                  _momentTimezone2.default.tz(text, 'Asia/Shanghai').format('MM-DD HH:mm')
                );
              });
            }
            return ticks;
          } else {
            return null;
          }
        } else if (type === 'YAxis') {
          var yTicksCount = yTicks.length;
          if (yTicksCount) {
            var _ticks = yTicks.map(function (tick, i) {
              var centerY = yScale(tick) - 7;
              if (i === 0) {
                centerY = yScale(tick) - 20;
              } else if (i === yTicksCount - 1) {
                centerY = yScale(tick) + 5;
              }
              var x = 15;
              if (position === 'right') {
                x = frame.width - 55;
              }
              var key = 'text' + i;
              return _react2.default.createElement(
                Text,
                { key: key, fill: 'gray', font: 'bold 12px Heiti SC', x: x, y: centerY },
                tick.toFixed(2)
              );
            });
            return _ticks;
          }
        }
      }
      return null;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // showGridLine, stroke, strokeWidth, strokeDash,

  _createClass(BaseAxis, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        Group,
        null,
        this._renderGridLines(),
        this._renderTicks()
      );
    }
  }]);

  return BaseAxis;
}(_react.Component);

BaseAxis.defaultProps = {
  showGridLine: false,
  showTicks: false,
  strokeDash: null,

  textColor: 'gray',
  fontFamily: 'Helvetica',
  fontWeight: 'bold',
  fontSize: 12
};
BaseAxis.propTypes = {
  // type: XAxix|YAxis
  type: _propTypes2.default.string.isRequired,
  // top|bottom|left|right
  position: _propTypes2.default.string.isRequired,
  // 宽度
  strokeWidth: _propTypes2.default.number.isRequired,
  // 虚线
  strokeDash: _propTypes2.default.arrayOf(_propTypes2.default.number),
  // 是否显示网格
  showGridLine: _propTypes2.default.bool,
  // 是否显示坐标
  showTicks: _propTypes2.default.bool,
  // 坐标字体大小
  fontSize: _propTypes2.default.number,
  // 字体颜色
  textColor: _propTypes2.default.string,
  // 字体粗细
  fontWeight: _propTypes2.default.string,
  // 字体集
  fontFamily: _propTypes2.default.string
};
exports.default = BaseAxis;


BaseAxis.contextTypes = {
  data: _propTypes2.default.array,
  domain: _propTypes2.default.object,
  frame: _propTypes2.default.object,
  events: _propTypes2.default.object,
  xScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func,
  xTicks: _propTypes2.default.array,
  yTicks: _propTypes2.default.array,
  xDateTicks: _propTypes2.default.array,
  chartType: _propTypes2.default.string
};