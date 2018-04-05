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

var _util = require('../../../../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * BaseTooltip
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Group = _reactNative.ART.Group,
    Text = _reactNative.ART.Text;

var BaseTooltip = function (_Component) {
  _inherits(BaseTooltip, _Component);

  /**
   * 构造函数
   * @param {any} props
   * @memberof BaseTooltip
   */

  /**
   * 组件属性
   *
   * @static
   * @memberof BaseTooltip
   */
  function BaseTooltip(props) {
    _classCallCheck(this, BaseTooltip);

    var _this = _possibleConstructorReturn(this, (BaseTooltip.__proto__ || Object.getPrototypeOf(BaseTooltip)).call(this, props));

    _initialiseProps.call(_this);

    _this._dataIndex = null;
    _this._periodStr = null;
    _this.state = {
      tooltipInfo: null
    };
    return _this;
  }

  /**
   * 生命周期
   *
   */


  _createClass(BaseTooltip, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._updateTipInfo(this.props, this.context);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextContext) {
      var _context = this.context,
          preEvents = _context.events,
          preCurrentItem = _context.currentItem,
          preData = _context.data,
          preIndicatorData = _context.indicatorData,
          preDomain = _context.domain,
          preFrame = _context.frame,
          preXScale = _context.xScale;
      var events = nextContext.events,
          currentItem = nextContext.currentItem,
          data = nextContext.data,
          indicatorData = nextContext.indicatorData,
          domain = nextContext.domain,
          frame = nextContext.frame,
          xScale = nextContext.xScale;


      var shouldRedraw = false;

      if ((!preEvents.longPressEvent || !events.longPressEvent) && preEvents.longPressEvent !== events.longPressEvent) {
        shouldRedraw = true;
      } else if (preEvents.longPressEvent && events.longPressEvent) {
        var prePlotData = preData.slice(preDomain.start, preDomain.end);
        var preDataIndex = (0, _util.getCurrentItem)(preXScale, null, [preCurrentItem.x], prePlotData, 'index') + preDomain.start;
        var preItem = preIndicatorData[preDataIndex];
        var plotData = data.slice(domain.start, domain.end);
        var dataIndex = (0, _util.getCurrentItem)(xScale, null, [currentItem.x], plotData, 'index') + domain.start;
        var item = indicatorData[dataIndex];
        if (JSON.stringify(preItem) !== JSON.stringify(item)) {
          shouldRedraw = true;
          this._dataIndex = dataIndex;
        }
      } else if (JSON.stringify(frame) !== JSON.stringify(preFrame)) {
        shouldRedraw = true;
      } else if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
        shouldRedraw = true;
      }
      if (shouldRedraw) {
        this._updateTipInfo(nextProps, nextContext);
      }
    }

    /**
     * 更新提示信息
     *
     * @memberof BaseTooltip
     */


    /**
     * 获取长按状态下的tipInfo
     *
     * @memberof BaseTooltip
     */


    /**
     * 获取常态下的tipInfo
     *
     * @memberof BaseTooltip
     */

  }, {
    key: 'render',


    /**
     * 渲染区
     *
     * @returns
     * @memberof BaseTooltip
     */
    value: function render() {
      var tooltipInfo = this.state.tooltipInfo;

      if (tooltipInfo) {
        return _react2.default.createElement(
          Group,
          null,
          tooltipInfo.map(function (tooltip, idx) {
            var key = 'text' + idx;
            return _react2.default.createElement(
              Text,
              {
                key: key,
                fill: tooltip.stroke,
                strokeWidth: 1,
                font: tooltip.font,
                x: tooltip.x,
                y: tooltip.y
              },
              tooltip.text
            );
          })
        );
      } else {
        return null;
      }
    }
  }]);

  return BaseTooltip;
}(_react.Component);

BaseTooltip.defaultProps = {
  rightMargin: 15.5,
  topMargin: 10,
  fontSize: 9,
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  titleColor: '#8f8f8f',
  title: '',
  valueKeys: [],
  indicators: [],
  type: ''
};
BaseTooltip.propTypes = {
  // Tooltip右边距
  rightMargin: _propTypes2.default.number,
  // Tooltip上边距
  topMargin: _propTypes2.default.number,
  // Tooltip字体集
  fontFamily: _propTypes2.default.string,
  // Tooltip字体大小
  fontSize: _propTypes2.default.number,
  // Tooltip字重
  fontWeight: _propTypes2.default.string,
  // 指标
  indicators: _propTypes2.default.arrayOf(_propTypes2.default.object),
  // 指标名
  title: _propTypes2.default.string,
  // 参数
  valueKeys: _propTypes2.default.arrayOf(_propTypes2.default.string),
  // 类型 group
  type: _propTypes2.default.string,
  // 指标颜色
  titleColor: _propTypes2.default.string };

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._updateTipInfo = function (props, context) {
    if (!context.frame) {
      return;
    }

    var indicators = props.indicators,
        type = props.type,
        valueKeys = props.valueKeys,
        title = props.title,
        rightMargin = props.rightMargin,
        topMargin = props.topMargin,
        titleColor = props.titleColor,
        fontSize = props.fontSize,
        fontFamily = props.fontFamily,
        fontWeight = props.fontWeight;
    var events = context.events,
        currentItem = context.currentItem,
        xScale = context.xScale,
        data = context.data,
        indicatorData = context.indicatorData,
        domain = context.domain,
        frame = context.frame;
    var width = frame.width;

    var tooltipInfo = [];
    var originX = width - rightMargin;
    var font = { fontFamily: fontFamily, fontWeight: fontWeight, fontSize: fontSize };
    if (events.longPressEvent) {
      if (!_this2._dataIndex) {
        var plotData = data.slice(domain.start, domain.end);
        _this2._dataIndex = (0, _util.getCurrentItem)(xScale, null, [currentItem.x], plotData, 'index') + domain.start;
      }
      tooltipInfo = _this2._getDetailToolTip(indicators, indicatorData, _this2._dataIndex, originX, topMargin, type, title, valueKeys, titleColor, fontSize, font);
    } else {
      tooltipInfo = _this2._getNormalTooltip(indicators, originX, topMargin, type, title, titleColor, fontSize, font);
    }
    _this2.setState({ tooltipInfo: tooltipInfo });
  };

  this._getDetailToolTip = function (indicators, indicatorData, dataIndex, originX, originY, type, title, valueKeys, titleColor, fontSize, font) {
    var tooltipInfo = null;
    var len = indicators.length;
    var curIndicator = null;
    var data = null;
    var text = null;
    for (var idx = len - 1; idx >= 0; idx--) {
      curIndicator = indicators[idx];
      data = indicatorData[curIndicator.dataKey][dataIndex];
      if (type === 'group') {
        var indicatorKeys = Object.keys(curIndicator.stroke);
        var indicatorKeysLen = indicatorKeys.length;
        for (var j = indicatorKeys.length - 1; j >= 0; j--) {
          var indicatorKey = indicatorKeys[j];
          if (data === '-') {
            text = ' ' + indicatorKey + ': -';
          } else {
            text = ' ' + indicatorKey + ': ' + (data[valueKeys[j]] ? data[valueKeys[j]].toFixed(2) : '-');
          }
          var offset = j === indicatorKeysLen - 1 ? 0 : 3;
          originX = originX - text.length * fontSize / 2.0 - offset;
          tooltipInfo = _this2._updateTooltip(tooltipInfo, originX, originY, text, curIndicator.stroke[indicatorKey], font);
        }
      } else {
        text = ' ' + curIndicator.dataKey + ': ' + (data && data !== '-' ? data.toFixed(2) : '-');
        originX = originX - text.length * fontSize / 2.0 - 5;
        tooltipInfo = _this2._updateTooltip(tooltipInfo, originX, originY, text, curIndicator.stroke, font);
      }
    }
    text = title + '(' + _this2._periodStr + ') ';
    originX -= text.length * fontSize / 2.0;
    tooltipInfo = _this2._updateTooltip(tooltipInfo, originX, originY, text, titleColor, font);
    return tooltipInfo;
  };

  this._getNormalTooltip = function (indicators, originX, originY, type, title, titleColor, fontSize, font) {
    var tooltipInfo = null;
    var periodArr = [];
    if (indicators) {
      indicators.forEach(function (item) {
        if (type === 'group') {
          periodArr.push(Object.values(item.params).join(','));
        } else {
          periodArr.push(item.params.period);
        }
      });
      _this2._periodStr = periodArr.join(',');
      var content = title + '(' + _this2._periodStr + ')';
      originX -= content.length * fontSize / 2.0;
      tooltipInfo = _this2._updateTooltip(tooltipInfo, originX, originY, content, titleColor, font);
    }
    return tooltipInfo;
  };

  this._updateTooltip = function (preToolTipInfo, x, y, text, stroke, font) {
    var tempToolTipInfo = preToolTipInfo || [];
    tempToolTipInfo.push({
      x: x, y: y, text: text, stroke: stroke, font: font
    });
    return tempToolTipInfo;
  };
};

exports.default = BaseTooltip;


BaseTooltip.contextTypes = {
  events: _propTypes2.default.object,
  xScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func,
  currentItem: _propTypes2.default.object,
  data: _propTypes2.default.array,
  indicatorData: _propTypes2.default.object,
  domain: _propTypes2.default.object,
  frame: _propTypes2.default.object
};