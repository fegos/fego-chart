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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 蜡烛图组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group,
    Transform = _reactNative.ART.Transform;

var CandleStickSeries = function (_Component) {
  _inherits(CandleStickSeries, _Component);

  function CandleStickSeries() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CandleStickSeries);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CandleStickSeries.__proto__ || Object.getPrototypeOf(CandleStickSeries)).call.apply(_ref, [this].concat(args))), _this), _this._caculatePath = function () {
      var path = void 0;
      var _this$context = _this.context,
          data = _this$context.data,
          domain = _this$context.domain,
          xScale = _this$context.xScale,
          yScale = _this$context.yScale,
          plotConfig = _this$context.plotConfig;
      var barWidth = plotConfig.barWidth;

      _this._boldIncreasePath = Path();
      _this._boldDecreasePath = Path();
      _this._thinIncreasePath = Path();
      _this._thinDecreasePath = Path();
      if (data && yScale && xScale && barWidth && domain) {
        var actualData = data.slice(domain.start, domain.end + 1);
        var length = actualData.length;

        for (var index = 0; index < length; index++) {
          var dataElem = actualData[index];
          var open = dataElem[1];
          var close = dataElem[2];
          var high = dataElem[3];
          var low = dataElem[4];
          var x = xScale(index);
          var openPos = yScale(open);
          var closePos = yScale(close);
          var highPos = yScale(high);
          var lowPos = yScale(low);
          if (openPos && x) {
            if (close > open) {
              _this._boldIncreasePath.moveTo(x - barWidth / 2.0, openPos);
              _this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos);
              _this._boldIncreasePath.lineTo(x + barWidth / 2.0, closePos);
              _this._boldIncreasePath.lineTo(x - barWidth / 2.0, closePos);
              _this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos);
              _this._thinIncreasePath.moveTo(x, highPos);
              _this._thinIncreasePath.lineTo(x, closePos);
              _this._thinIncreasePath.moveTo(x, openPos);
              _this._thinIncreasePath.lineTo(x, lowPos);
            } else if (close < open) {
              _this._boldDecreasePath.moveTo(x - barWidth / 2.0, openPos);
              _this._boldDecreasePath.lineTo(x + barWidth / 2.0, openPos);
              _this._boldDecreasePath.lineTo(x + barWidth / 2.0, closePos);
              _this._boldDecreasePath.lineTo(x - barWidth / 2.0, closePos);
              _this._boldDecreasePath.lineTo(x - barWidth / 2.0, openPos);
              _this._thinDecreasePath.moveTo(x, highPos);
              _this._thinDecreasePath.lineTo(x, openPos);
              _this._thinDecreasePath.moveTo(x, closePos);
              _this._thinDecreasePath.lineTo(x, lowPos);
            } else {
              _this._boldIncreasePath.moveTo(x - barWidth / 2.0, openPos);
              _this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos);
              _this._boldIncreasePath.lineTo(x + barWidth / 2.0, openPos + _reactNative.StyleSheet.hairlineWidth);
              _this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos + _reactNative.StyleSheet.hairlineWidth);
              _this._boldIncreasePath.lineTo(x - barWidth / 2.0, openPos);
              _this._thinIncreasePath.moveTo(x, highPos);
              _this._thinIncreasePath.lineTo(x, closePos);
              _this._thinIncreasePath.moveTo(x, openPos);
              _this._thinIncreasePath.lineTo(x, lowPos);
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
   * @memberof CandleStickSeries
   */


  _createClass(CandleStickSeries, [{
    key: 'shouldComponentUpdate',


    /**
     * 生命周期
     *
     * @memberof CandleStickSeries
     */
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _context = this.context,
          preData = _context.data,
          preDomain = _context.domain,
          preXScale = _context.xScale,
          preYScale = _context.yScale,
          prePlotConfig = _context.plotConfig,
          preOffset = _context.offset;
      var data = nextContext.data,
          domain = nextContext.domain,
          xScale = nextContext.xScale,
          yScale = nextContext.yScale,
          plotConfig = nextContext.plotConfig,
          offset = nextContext.offset;

      if (!preData || !data || !preDomain || !domain || !preYScale || !yScale || !preXScale || !xScale) {
        return true;
      }
      var preActualData = preData.slice(preDomain.start, preDomain.end + 1);
      var actualData = data.slice(domain.start, domain.end + 1);
      var testNumber = 10;
      if (JSON.stringify(preActualData) !== JSON.stringify(actualData) || JSON.stringify(prePlotConfig) !== JSON.stringify(plotConfig) || preXScale(testNumber) !== xScale(testNumber) || preYScale(testNumber) !== yScale(testNumber) || preOffset !== offset) {
        return true;
      }
      if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
        return true;
      }
      return false;
    }

    /**
     * 计算蜡烛图绘制路径
     */

  }, {
    key: 'render',


    /**
     * 渲染函数
     *
     * @returns
     * @memberof CandleStickSeries
     */
    value: function render() {
      this._caculatePath();
      var _props = this.props,
          riseColor = _props.riseColor,
          fallColor = _props.fallColor,
          isHollow = _props.isHollow;
      var offset = this.context.offset;

      var transform = new Transform().translate(offset, 0);
      if (isHollow) {
        return _react2.default.createElement(
          Group,
          null,
          _react2.default.createElement(Shape, { d: this._thinIncreasePath, stroke: riseColor, strokeWidth: 1, strokeCap: 'square', transform: transform }),
          _react2.default.createElement(Shape, { d: this._thinDecreasePath, stroke: fallColor, fill: fallColor, strokeWidth: 1, strokeCap: 'square', transform: transform }),
          _react2.default.createElement(Shape, { d: this._boldIncreasePath, stroke: riseColor, strokeCap: 'square', transform: transform }),
          _react2.default.createElement(Shape, { d: this._boldDecreasePath, stroke: fallColor, fill: fallColor, strokeCap: 'square', transform: transform })
        );
      } else {
        return _react2.default.createElement(
          Group,
          null,
          _react2.default.createElement(Shape, { d: this._thinIncreasePath, stroke: riseColor, strokeWidth: 1, strokeCap: 'square', transform: transform }),
          _react2.default.createElement(Shape, { d: this._thinDecreasePath, stroke: fallColor, fill: fallColor, strokeWidth: 1, strokeCap: 'square', transform: transform }),
          _react2.default.createElement(Shape, { d: this._boldIncreasePath, stroke: riseColor, fill: riseColor, strokeCap: 'square', transform: transform }),
          _react2.default.createElement(Shape, { d: this._boldDecreasePath, stroke: fallColor, fill: fallColor, strokeCap: 'square', transform: transform })
        );
      }
    }
  }]);

  return CandleStickSeries;
}(_react.Component);

CandleStickSeries.defaultProps = {
  riseColor: 'red',
  fallColor: 'green',
  isHollow: false
};
CandleStickSeries.propsType = {
  // 是否为空心
  isHollow: _propTypes2.default.bool,
  // 上涨颜色
  riseColor: _propTypes2.default.string,
  // 下跌颜色
  fallColor: _propTypes2.default.string };
exports.default = CandleStickSeries;


CandleStickSeries.contextTypes = {
  data: _propTypes2.default.array,
  plotConfig: _propTypes2.default.object,
  domain: _propTypes2.default.object,
  xScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func,
  offset: _propTypes2.default.number
};