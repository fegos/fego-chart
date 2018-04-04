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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 线图组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group;

var LineSeries = function (_Component) {
  _inherits(LineSeries, _Component);

  function LineSeries() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, LineSeries);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LineSeries.__proto__ || Object.getPrototypeOf(LineSeries)).call.apply(_ref, [this].concat(args))), _this), _this._caculatePath = function () {
      _this._timelinePath = Path();
      var yExtents = _this.props.yExtents;
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
          for (var index = 0; index < length; index++) {
            var dataElem = yExtents(actualData[index]);
            var x = xScale(index);
            var y = yScale(dataElem);
            if (!Number.isNaN(x) && !Number.isNaN(y)) {
              if (firstData) {
                firstData = false;
                _this._timelinePath.moveTo(x, y);
              } else {
                _this._timelinePath.lineTo(x, y);
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
   * @memberof LineSeries
   */


  _createClass(LineSeries, [{
    key: 'shouldComponentUpdate',


    /**
     * 生命周期
     *
     * @memberof LineSeries
     */
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _context = this.context,
          preData = _context.data,
          preDomain = _context.domain,
          preFrame = _context.frame,
          preXScale = _context.xScale,
          preYScale = _context.yScale;
      var data = nextContext.data,
          domain = nextContext.domain,
          frame = nextContext.frame,
          xScale = nextContext.xScale,
          yScale = nextContext.yScale;

      if (JSON.stringify(data) !== JSON.stringify(preData) || JSON.stringify(frame) !== JSON.stringify(preFrame) || JSON.stringify(domain) !== JSON.stringify(preDomain)) {
        return true;
      }
      var testNumber = 10;
      if (preXScale(testNumber) !== xScale(testNumber) || preYScale(testNumber) !== yScale(testNumber)) {
        return true;
      }
      if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
        return true;
      }
      return false;
    }

    /**
     * 计算路径
     *
     * @memberof LineSeries
     */

  }, {
    key: 'render',


    /**
     * 渲染函数
     *
     * @returns
     * @memberof LineSeries
     */
    value: function render() {
      var _props = this.props,
          lineColor = _props.lineColor,
          lineWidth = _props.lineWidth;

      this._caculatePath();
      return _react2.default.createElement(
        Group,
        null,
        _react2.default.createElement(Shape, { d: this._timelinePath, stroke: lineColor, strokeWidth: lineWidth })
      );
    }
  }]);

  return LineSeries;
}(_react.Component);

LineSeries.defaultProps = {
  riseColor: 'red',
  fallColor: 'green',
  lineColor: 'black',
  lineWidth: 1
};
LineSeries.propsType = {
  // 数据键值
  dataKey: _propTypes2.default.string.isRequired,
  // 数据选择子
  yExtents: _propTypes2.default.func.isRequired,
  // 线条颜色
  lineColor: _propTypes2.default.string,
  // 线条宽度
  lineWidth: _propTypes2.default.number,
  // 上涨颜色
  riseColor: _propTypes2.default.string,
  // 下跌颜色
  fallColor: _propTypes2.default.string };
exports.default = LineSeries;


LineSeries.contextTypes = {
  data: _propTypes2.default.array,
  frame: _propTypes2.default.object,
  domain: _propTypes2.default.object,
  preClosedPrice: _propTypes2.default.number,
  xScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func
};