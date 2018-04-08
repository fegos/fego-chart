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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 背景框组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape;

var Background = function (_Component) {
  _inherits(Background, _Component);

  function Background() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Background);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Background.__proto__ || Object.getPrototypeOf(Background)).call.apply(_ref, [this].concat(args))), _this), _this._caculatePath = function () {
      var position = _this.props.position;
      var frame = _this.context.frame;

      var path = Path();
      if (frame) {
        var width = frame.width,
            height = frame.height;

        if (!position) {
          path.moveTo(0, 0);
          path.lineTo(width, 0);
          path.lineTo(width, height);
          path.lineTo(0, height);
          path.lineTo(0, 0);
        } else {
          var positions = position.split('|');
          if (positions.includes('top')) {
            path.moveTo(0, 0);
            path.lineTo(width, 0);
          }
          if (positions.includes('left')) {
            path.moveTo(0, 0);
            path.lineTo(0, height);
          }
          if (positions.includes('right')) {
            path.moveTo(width, 0);
            path.lineTo(width, height);
          }
          if (positions.includes('bottom')) {
            path.moveTo(0, height + 0);
            path.lineTo(width, height);
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
   * @memberof Background
   */


  _createClass(Background, [{
    key: 'shouldComponentUpdate',


    /**
     * 生命周期
     *
     */
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var preFrame = this.context.frame;
      var frame = nextContext.frame;

      if (JSON.stringify(preFrame) !== frame || JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
        return true;
      }
      return false;
    }

    /**
     * 计算绘制路径
     */

  }, {
    key: 'render',


    /**
     * 渲染区
     *
     * @returns
     * @memberof Background
     */
    value: function render() {
      var _props = this.props,
          lineColor = _props.lineColor,
          dash = _props.dash,
          lineWidth = _props.lineWidth;

      var path = this._caculatePath();
      return _react2.default.createElement(Shape, { d: path, stroke: lineColor, strokeDash: dash, strokeWidth: lineWidth });
    }
  }]);

  return Background;
}(_react.Component);

Background.defaultProps = {
  position: null,
  dash: null,
  lineColor: 'gray',
  lineWidth: _reactNative.StyleSheet.hairlineWidth
};
Background.propTypes = {
  // top|bottom|left|right
  position: _propTypes2.default.string,
  // 虚线
  dash: _propTypes2.default.arrayOf(_propTypes2.default.number),
  // 线条颜色
  lineColor: _propTypes2.default.string,
  // 线条宽度
  lineWidth: _propTypes2.default.number };
exports.default = Background;


Background.contextTypes = {
  frame: _propTypes2.default.object
};