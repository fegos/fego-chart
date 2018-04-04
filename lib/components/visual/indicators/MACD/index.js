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

var _BaseIndicator2 = require('../BaseIndicator');

var _BaseIndicator3 = _interopRequireDefault(_BaseIndicator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * MACD指标线组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group,
    Transform = _reactNative.ART.Transform;

var MACD = function (_BaseIndicator) {
  _inherits(MACD, _BaseIndicator);

  function MACD() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MACD);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MACD.__proto__ || Object.getPrototypeOf(MACD)).call.apply(_ref, [this].concat(args))), _this), _this._caculatePath = function () {
      var dataKey = _this.props.dataKey;
      var _this$context = _this.context,
          indicatorData = _this$context.indicatorData,
          domain = _this$context.domain,
          xScale = _this$context.xScale,
          yScale = _this$context.yScale,
          plotConfig = _this$context.plotConfig;
      var curBarWidth = plotConfig.barWidth;

      if (_this.props.barWidth) {
        curBarWidth = _this.props.barWidth;
      }
      var difPath = new Path();
      var deaPath = new Path();
      var upPath = new Path();
      var downPath = new Path();

      if (indicatorData && domain && xScale && yScale) {
        var data = indicatorData[dataKey];
        if (data) {
          var start = domain.start,
              end = domain.end;

          var screenData = data.slice(start, end + 1);
          var length = end - start + 1;
          var firstM = false;
          var firstS = false;
          for (var index = 0; index < length; index++) {
            var dataElem = screenData[index];
            if (dataElem) {
              if (dataElem.MACD === '-' || dataElem.MACD === undefined) {
                firstM = false;
              } else if (!firstM) {
                firstM = true;
                difPath.moveTo(xScale(index), yScale(dataElem.MACD));
              } else {
                difPath.lineTo(xScale(index), yScale(dataElem.MACD));
              }

              if (dataElem.signal === '-' || dataElem.signal === undefined) {
                firstS = false;
              } else if (!firstS) {
                firstS = true;
                deaPath.moveTo(xScale(index), yScale(dataElem.signal));
              } else {
                deaPath.lineTo(xScale(index), yScale(dataElem.signal));
              }

              if (dataElem.histogram === '-' || dataElem.histogram === undefined) {
                // do nothing
              } else if (dataElem.histogram >= 0) {
                // up
                upPath.moveTo(xScale(index) - curBarWidth / 2.0, yScale(0));
                upPath.lineTo(xScale(index) + curBarWidth / 2.0, yScale(0));
                upPath.lineTo(xScale(index) + curBarWidth / 2.0, yScale(dataElem.histogram));
                upPath.lineTo(xScale(index) - curBarWidth / 2.0, yScale(dataElem.histogram));
                upPath.lineTo(xScale(index) - curBarWidth / 2.0, yScale(0));
              } else {
                // down
                downPath.moveTo(xScale(index) - curBarWidth / 2.0, yScale(0));
                downPath.lineTo(xScale(index) + curBarWidth / 2.0, yScale(0));
                downPath.lineTo(xScale(index) + curBarWidth / 2.0, yScale(dataElem.histogram));
                downPath.lineTo(xScale(index) - curBarWidth / 2.0, yScale(dataElem.histogram));
                downPath.lineTo(xScale(index) - curBarWidth / 2.0, yScale(0));
              }
            }
          }
        }
      }
      return {
        difPath: difPath,
        deaPath: deaPath,
        upPath: upPath,
        downPath: downPath
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * 组件属性
   *
   * @static
   * @memberof MACD
   */


  /**
   * 计算绘制路径
   */


  _createClass(MACD, [{
    key: 'render',


    /**
     * 渲染函数
     *
     * @returns
     * @memberof MACD
     */
    value: function render() {
      var _props = this.props,
          lineWidth = _props.lineWidth,
          stroke = _props.stroke;

      var _caculatePath = this._caculatePath(),
          upPath = _caculatePath.upPath,
          downPath = _caculatePath.downPath,
          difPath = _caculatePath.difPath,
          deaPath = _caculatePath.deaPath;

      var offset = this.context.offset;

      var transform = new Transform().translate(offset, 0);
      return _react2.default.createElement(
        Group,
        null,
        _react2.default.createElement(Shape, { d: upPath, fill: stroke.Raise, transform: transform }),
        _react2.default.createElement(Shape, { d: downPath, fill: stroke.Fall, transform: transform }),
        _react2.default.createElement(Shape, { d: difPath, stroke: stroke.DIFF, strokeWidth: lineWidth, transform: transform }),
        _react2.default.createElement(Shape, { d: deaPath, stroke: stroke.DEA, strokeWidth: lineWidth, transform: transform })
      );
    }
  }]);

  return MACD;
}(_BaseIndicator3.default);

MACD.defaultProps = {
  lineWidth: _reactNative.StyleSheet.hairlineWidth
};
MACD.propsType = {
  // 指标Key
  dataKey: _propTypes2.default.string.isRequired,
  // 线条颜色
  stroke: _propTypes2.default.object.isRequired,
  // 线条粗细
  lineWidth: _propTypes2.default.number,
  // 柱状图粗细
  barWidth: _propTypes2.default.number };
exports.default = MACD;