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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 网格线组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape;

var GridLine = function (_Component) {
  _inherits(GridLine, _Component);

  function GridLine() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GridLine);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GridLine.__proto__ || Object.getPrototypeOf(GridLine)).call.apply(_ref, [this].concat(args))), _this), _this._caculateGridPath = function () {
      var path = Path();
      var _this$props = _this.props,
          row = _this$props.row,
          colume = _this$props.colume;
      var _this$context = _this.context,
          xTicks = _this$context.xTicks,
          xScale = _this$context.xScale,
          frame = _this$context.frame,
          offset = _this$context.offset;


      if (frame && frame.width && frame.height) {
        if (row) {
          var itemHeight = frame.height / (row + 1);
          for (var idx = 1; idx <= row; idx++) {
            var y = itemHeight * idx;
            path.moveTo(0, y);
            path.lineTo(frame.width, y);
          }
        }
        if (colume) {
          var itemWidth = frame.width / (colume + 1);
          for (var _idx = 1; _idx <= colume; _idx++) {
            var x = itemWidth * _idx + offset;
            path.moveTo(x, 0);
            path.lineTo(x, frame.height);
          }
        } else if (xScale && xTicks && xTicks.length) {
          var ticksCount = xTicks.length;
          for (var _idx2 = 0; _idx2 < ticksCount; _idx2++) {
            var tickIndex = xTicks[_idx2];
            var _x = xScale(tickIndex) + offset;
            path.moveTo(_x, 0);
            path.lineTo(_x, frame.height);
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
   * @memberof GridLine
   */


  _createClass(GridLine, [{
    key: 'shouldComponentUpdate',


    /**
     * 生命周期
     *
     * @memberof GridLine
     */
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
        return true;
      }
      if (this.props.row > 0) {
        if (JSON.stringify(this.context.frame) !== JSON.stringify(nextContext.frame)) {
          return true;
        }
      }
      var testNumber = 10;
      if (this.props.colume > 0) {
        if (JSON.stringify(this.context.frame) !== JSON.stringify(nextContext.frame)) {
          return true;
        }
      } else if (!this.context.xScale || !nextContext.xScale) {
        return true;
      } else if (this.context.xScale(testNumber) !== nextContext.xScale(testNumber) || JSON.stringify(this.context.xTicks) !== JSON.stringify(nextContext.xTicks)) {
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
     * 绘制区
     *
     * @returns
     * @memberof GridLine
     */
    value: function render() {
      var _props = this.props,
          lineColor = _props.lineColor,
          lineWidth = _props.lineWidth,
          dash = _props.dash;

      var path = this._caculateGridPath();
      return _react2.default.createElement(Shape, { d: path, stroke: lineColor, strokeDash: dash, strokeWidth: lineWidth });
    }
  }]);

  return GridLine;
}(_react.Component);

GridLine.defaultProps = {
  dash: null,
  colume: 0
};
GridLine.propTypes = {
  // 虚线
  dash: _propTypes2.default.arrayOf(_propTypes2.default.number),
  // 线条颜色
  lineColor: _propTypes2.default.string.isRequired,
  // 线条宽度
  lineWidth: _propTypes2.default.number.isRequired,
  // row
  row: _propTypes2.default.number.isRequired,
  // colume
  colume: _propTypes2.default.number };
exports.default = GridLine;


GridLine.contextTypes = {
  data: _propTypes2.default.array,
  frame: _propTypes2.default.object,
  xScale: _propTypes2.default.func,
  xTicks: _propTypes2.default.array,
  offset: _propTypes2.default.number
};