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

var _LineSeries2 = require('../LineSeries');

var _LineSeries3 = _interopRequireDefault(_LineSeries2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 线图组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group;

var AreaSeries = function (_LineSeries) {
  _inherits(AreaSeries, _LineSeries);

  function AreaSeries() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AreaSeries);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AreaSeries.__proto__ || Object.getPrototypeOf(AreaSeries)).call.apply(_ref, [this].concat(args))), _this), _this._caculatePath = function () {
      _this._linePath = Path();
      _this._gradientPath = Path();
      var _this$props = _this.props,
          yExtents = _this$props.yExtents,
          dataKey = _this$props.dataKey;
      var _this$context = _this.context,
          xScale = _this$context.xScale,
          yScale = _this$context.yScale,
          data = _this$context.data,
          domain = _this$context.domain,
          frame = _this$context.frame;

      if (data && domain && xScale && yScale && yExtents && frame && frame.width) {
        var actualData = data;
        if (actualData && yScale) {
          var length = actualData.length;

          var firstData = true;
          var firstX = 0;
          for (var index = 0; index < length; index++) {
            var dataElem = yExtents(actualData[index]);
            var x = xScale(index);
            var y = yScale(dataElem);
            if (!Number.isNaN(x) && !Number.isNaN(y)) {
              if (firstData) {
                firstData = false;
                _this._linePath.moveTo(x, y);
                _this._gradientPath.moveTo(x, y);
                firstX = x;
              } else {
                _this._linePath.lineTo(x, y);
                _this._gradientPath.lineTo(x, y);
                if (index === length - 1 && dataKey === 'timeline') {
                  var xPos = xScale(length - 1);
                  var yPos = frame.height;
                  _this._gradientPath.lineTo(xPos, yPos);
                  _this._gradientPath.lineTo(firstX, yPos);
                  _this._gradientPath.close();
                }
              }
            }
          }
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * 组件属性
   *
   * @static
   * @memberof AreaSeries
   */


  /**
   * 计算路径
   *
   * @memberof AreaSeries
   */


  _createClass(AreaSeries, [{
    key: 'render',


    /**
     * 渲染函数
     *
     * @returns
     * @memberof AreaSeries
     */
    value: function render() {
      var _props = this.props,
          lineColor = _props.lineColor,
          lineWidth = _props.lineWidth,
          riseColor = _props.riseColor,
          fallColor = _props.fallColor,
          dataKey = _props.dataKey,
          yExtents = _props.yExtents,
          lightRiseColor = _props.lightRiseColor,
          lightFallColor = _props.lightFallColor;
      var _context = this.context,
          data = _context.data,
          preClosedPrice = _context.preClosedPrice,
          frame = _context.frame;

      var strokeColor = lineColor;

      var gradientLayer = null;
      this._caculatePath();
      if (dataKey === 'timeline') {
        if (data) {
          var lightColor = null;
          var lastItem = data[data.length - 1];
          lastItem = yExtents(lastItem);
          if (lastItem < preClosedPrice) {
            strokeColor = fallColor;
            lightColor = lightFallColor;
          } else {
            strokeColor = riseColor;
            lightColor = lightRiseColor;
          }
          var linearGradient = new _reactNative.ART.LinearGradient({
            0: strokeColor,
            1: lightColor
          }, 0, 0, 0, frame.height);
          gradientLayer = _react2.default.createElement(Shape, { d: this._gradientPath, fill: linearGradient });
        }
      }
      return _react2.default.createElement(
        Group,
        null,
        gradientLayer,
        _react2.default.createElement(Shape, { d: this._linePath, stroke: strokeColor, strokeWidth: lineWidth })
      );
    }
  }]);

  return AreaSeries;
}(_LineSeries3.default);

AreaSeries.propsType = {
  // 上涨浅色
  lightRiseColor: _propTypes2.default.string.isRequired,
  // 下跌浅色
  lightFallColor: _propTypes2.default.string.isRequired };
exports.default = AreaSeries;