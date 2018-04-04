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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * RSI指标线组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group,
    Transform = _reactNative.ART.Transform;

var RSI = function (_BaseIndicator) {
  _inherits(RSI, _BaseIndicator);

  function RSI() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RSI);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RSI.__proto__ || Object.getPrototypeOf(RSI)).call.apply(_ref, [this].concat(args))), _this), _this._caculatePath = function () {
      var path = void 0;
      var dataKey = _this.props.dataKey;
      var _this$context = _this.context,
          indicatorData = _this$context.indicatorData,
          domain = _this$context.domain,
          xScale = _this$context.xScale,
          yScale = _this$context.yScale;

      if (indicatorData && domain && xScale && yScale) {
        var start = domain.start,
            end = domain.end;

        var data = indicatorData[dataKey];
        if (data) {
          var screenData = data.slice(start, end + 1);
          var firstValidValue = false;
          if (screenData) {
            var length = end - start + 1;
            for (var index = 0; index < length; index++) {
              var dataElem = screenData[index];
              if (dataElem === '-') {
                firstValidValue = false;
              } else if (!firstValidValue) {
                firstValidValue = true;
                path = Path().moveTo(xScale(index), yScale(dataElem));
              } else {
                path.lineTo(xScale(index), yScale(dataElem));
              }
            }
          }
        }
      }
      return path;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * 组件属性
   *
   * @static
   * @memberof RSI
   */


  /**
   * 计算绘制路径
   */


  _createClass(RSI, [{
    key: 'render',


    /**
     * 渲染函数
     *
     * @returns
     * @memberof RSI
     */
    value: function render() {
      var _props = this.props,
          stroke = _props.stroke,
          lineWidth = _props.lineWidth;

      var path = this._caculatePath();
      var offset = this.context.offset;

      var transform = new Transform().translate(offset, 0);
      return _react2.default.createElement(
        Group,
        null,
        _react2.default.createElement(Shape, { d: path, stroke: stroke, strokeWidth: lineWidth, transform: transform })
      );
    }
  }]);

  return RSI;
}(_BaseIndicator3.default);

RSI.defaultProps = {
  lineWidth: _reactNative.StyleSheet.hairlineWidth
};
RSI.propsType = {
  // 指标Key
  dataKey: _propTypes2.default.string.isRequired,
  // 线条颜色
  stroke: _propTypes2.default.string.isRequired,
  // 线条粗细
  lineWidth: _propTypes2.default.number };
exports.default = RSI;