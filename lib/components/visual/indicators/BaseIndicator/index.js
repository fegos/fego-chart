'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 指标组件基类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var BaseIndicator = function (_Component) {
  _inherits(BaseIndicator, _Component);

  function BaseIndicator() {
    _classCallCheck(this, BaseIndicator);

    return _possibleConstructorReturn(this, (BaseIndicator.__proto__ || Object.getPrototypeOf(BaseIndicator)).apply(this, arguments));
  }

  _createClass(BaseIndicator, [{
    key: 'shouldComponentUpdate',


    /**
     * 生命周期
     *
     * @memberof BaseIndicator
     */

    /**
     * 组件属性
     *
     * @static
     * @memberof BaseIndicator
     */
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _context = this.context,
          preData = _context.data,
          preDomain = _context.domain,
          preXScale = _context.xScale,
          preYScale = _context.yScale;
      var data = nextContext.data,
          domain = nextContext.domain,
          xScale = nextContext.xScale,
          yScale = nextContext.yScale;

      if (!preData || !data || !preDomain || !domain || !preYScale || !yScale || !preXScale || !xScale) {
        return true;
      }
      var preActualData = preData.slice(preDomain.start, preDomain.end + 1);
      var actualData = data.slice(domain.start, domain.end + 1);
      var testNumber = 10;
      if (JSON.stringify(preActualData) !== JSON.stringify(actualData) || preXScale(testNumber) !== xScale(testNumber) || preYScale(testNumber) !== yScale(testNumber)) {
        return true;
      }
      if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
        return true;
      }
      return false;
    }

    /**
     * 渲染区，具体有子组件实现
     *
     * @returns
     * @memberof BaseIndicator
     */

  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return BaseIndicator;
}(_react.Component);

BaseIndicator.defaultProps = {
  lineWidth: 1
};
BaseIndicator.propsType = {
  // 指标Key
  dataKey: _propTypes2.default.string.isRequired,
  // 线条颜色
  stroke: _propTypes2.default.object.isRequired,
  // 线条粗细
  lineWidth: _propTypes2.default.number };
exports.default = BaseIndicator;


BaseIndicator.contextTypes = {
  indicatorData: _propTypes2.default.object,
  plotConfig: _propTypes2.default.object,
  domain: _propTypes2.default.object,
  xScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func,
  offset: _propTypes2.default.number
};