'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _BaseIndicator2 = require('../BaseIndicator');

var _BaseIndicator3 = _interopRequireDefault(_BaseIndicator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * KDJ指标线组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Path = _reactNative.ART.Path,
    Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group,
    Transform = _reactNative.ART.Transform;

var KDJ = function (_BaseIndicator) {
  _inherits(KDJ, _BaseIndicator);

  function KDJ() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, KDJ);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = KDJ.__proto__ || Object.getPrototypeOf(KDJ)).call.apply(_ref, [this].concat(args))), _this), _this._caculatePath = function () {
      var pathK = void 0;
      var pathD = void 0;
      var pathJ = void 0;
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
          var screenData = indicatorData[dataKey].slice(start, end + 1);
          var firstValidValue = false;
          if (screenData) {
            var length = end - start + 1;
            for (var index = 0; index < length; index++) {
              var dataElem = screenData[index];
              if (dataElem === '-') {
                firstValidValue = false;
              } else if (dataElem) {
                if (_this._isValidNum(dataElem)) {
                  if (!firstValidValue) {
                    firstValidValue = true;
                    pathK = Path().moveTo(xScale(index), yScale(dataElem.k));
                    pathD = Path().moveTo(xScale(index), yScale(dataElem.d));
                    pathJ = Path().moveTo(xScale(index), yScale(dataElem.j));
                  } else {
                    pathK.lineTo(xScale(index), yScale(dataElem.k));
                    pathD.lineTo(xScale(index), yScale(dataElem.d));
                    pathJ.lineTo(xScale(index), yScale(dataElem.j));
                  }
                }
              }
            }
          }
        }
      }
      return { pathK: pathK, pathD: pathD, pathJ: pathJ };
    }, _this._isValidNum = function (dataElem) {
      var isValid = true;
      Object.keys(dataElem).forEach(function (key) {
        var value = dataElem[key];
        if (value === undefined || value === null || Number.isNaN(value)) {
          isValid = false;
        }
      });
      return isValid;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * 组件属性
   *
   * @static
   * @memberof KDJ
   */


  /**
   * 计算绘制路径
   */


  /**
   * 判读目标数据是否为有效数据
   *
   * @memberof KDJ
   */


  _createClass(KDJ, [{
    key: 'render',


    /**
     * 渲染函数
     *
     * @returns
     * @memberof KDJ
     */
    value: function render() {
      var _props = this.props,
          stroke = _props.stroke,
          lineWidth = _props.lineWidth;

      var _caculatePath = this._caculatePath(),
          pathK = _caculatePath.pathK,
          pathD = _caculatePath.pathD,
          pathJ = _caculatePath.pathJ;

      var offset = this.context.offset;

      var transform = new Transform().translate(offset, 0);
      return _react2.default.createElement(
        Group,
        null,
        _react2.default.createElement(Shape, { d: pathK, stroke: stroke.K, strokeWidth: lineWidth, transform: transform }),
        _react2.default.createElement(Shape, { d: pathD, stroke: stroke.D, strokeWidth: lineWidth, transform: transform }),
        _react2.default.createElement(Shape, { d: pathJ, stroke: stroke.J, strokeWidth: lineWidth, transform: transform })
      );
    }
  }]);

  return KDJ;
}(_BaseIndicator3.default);

KDJ.defaultProps = {
  lineWidth: _reactNative.StyleSheet.hairlineWidth };
exports.default = KDJ;