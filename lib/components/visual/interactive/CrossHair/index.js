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

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _util = require('../../../../util');

var _helper = require('../../../../util/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 十字线组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author: Xu Dachi、eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group,
    Text = _reactNative.ART.Text;

var CrossHair = function (_Component) {
  _inherits(CrossHair, _Component);

  function CrossHair() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CrossHair);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CrossHair.__proto__ || Object.getPrototypeOf(CrossHair)).call.apply(_ref, [this].concat(args))), _this), _this._drawCrossHairCursor = function () {
      var _this$context = _this.context,
          frame = _this$context.frame,
          data = _this$context.data,
          domain = _this$context.domain,
          currentItem = _this$context.currentItem,
          yScale = _this$context.yScale,
          xScale = _this$context.xScale;


      if (frame && data && domain) {
        var _this$props = _this.props,
            showHorLabel = _this$props.showHorLabel,
            showHorSubLabel = _this$props.showHorSubLabel,
            showVerLabel = _this$props.showVerLabel,
            fontColor = _this$props.fontColor,
            riseFontColor = _this$props.riseFontColor,
            fallFontColor = _this$props.fallFontColor,
            topOffset = _this$props.topOffset,
            bottomOffset = _this$props.bottomOffset,
            leftOffset = _this$props.leftOffset,
            rightOffset = _this$props.rightOffset,
            horLineVerPadding = _this$props.horLineVerPadding,
            horLabelXOffset = _this$props.horLabelXOffset,
            horLabelYOffset = _this$props.horLabelYOffset,
            verLabelXOffset = _this$props.verLabelXOffset,
            verLabelYOffset = _this$props.verLabelYOffset,
            horLabelWidth = _this$props.horLabelWidth,
            horSubLabelWidth = _this$props.horSubLabelWidth,
            horLabelHeight = _this$props.horLabelHeight,
            verLabelHeight = _this$props.verLabelHeight,
            verLabelWidth = _this$props.verLabelWidth,
            borderColor = _this$props.borderColor,
            fillColor = _this$props.fillColor,
            borderRadius = _this$props.borderRadius,
            isTimestamp = _this$props.isTimestamp,
            timezone = _this$props.timezone,
            dateFormat = _this$props.dateFormat;
        var preClosedPrice = _this.props.preClosedPrice;
        var locX = currentItem.x,
            locY = currentItem.y;

        var loc = [locX, locY];
        var y = frame.y,
            width = frame.width,
            height = frame.height;


        var pathInfo = {};
        var horLabelBackground = {};
        var horSubLabelBackground = {};

        // 绘制十字线
        var path = _reactNative.ART.Path();
        var shouldDrawHLine = (0, _helper.isDotInsideChart)(loc, frame);

        var actualX = loc[0];

        var actualY = loc[1];
        if (loc[1] < y) actualY = y;
        if (loc[1] > y + height) actualY = y + height;
        actualY -= y;
        actualY = Math.max(actualY, horLineVerPadding);
        actualY = Math.min(actualY, height - horLineVerPadding);

        var actualFontColor = fontColor;
        var currValue = +yScale.invert(actualY).toFixed(2);
        if (!Number.isNaN(+preClosedPrice)) {
          preClosedPrice = +preClosedPrice;
          if (currValue > preClosedPrice) actualFontColor = riseFontColor;
          if (currValue < preClosedPrice) actualFontColor = fallFontColor;
        }

        // 绘制横线
        if (shouldDrawHLine) {
          var left = leftOffset;
          var right = width - rightOffset;
          if (showHorLabel) {
            left += horLabelWidth;
          }
          if (showHorSubLabel) {
            right -= horSubLabelWidth;
          }
          path.moveTo(left, actualY);
          path.lineTo(right, actualY);
        }
        // 绘制纵线
        {
          var top = topOffset;
          var bottom = height - bottomOffset;
          if (showVerLabel) {
            top += verLabelHeight;
          }
          path.moveTo(actualX, top);
          path.lineTo(actualX, bottom);
        }

        pathInfo.path = path;

        if (shouldDrawHLine) {
          // 绘制横线Label
          if (showHorLabel) {
            var horLabel = {
              x: leftOffset + horLabelXOffset,
              y: actualY - horLabelHeight / 2 + horLabelYOffset,
              text: currValue.toFixed(2),
              fill: actualFontColor
            };
            pathInfo.horLabel = horLabel;

            var horLabelBackgroundPath = _reactNative.ART.Path();
            var _top = actualY - horLabelHeight / 2;
            var _bottom = actualY + horLabelHeight / 2;
            var _left = leftOffset;
            var _right = horLabelWidth + leftOffset;
            horLabelBackgroundPath.moveTo(_left, _top + borderRadius);
            horLabelBackgroundPath.arc(borderRadius, -borderRadius, borderRadius, 0, 0, false);
            horLabelBackgroundPath.lineTo(_right - borderRadius, _top);
            horLabelBackgroundPath.arc(borderRadius, borderRadius, borderRadius, 0, 0, false);
            horLabelBackgroundPath.lineTo(_right, _bottom - borderRadius);
            horLabelBackgroundPath.arc(-borderRadius, borderRadius, borderRadius, 0, 0, false);
            horLabelBackgroundPath.lineTo(_left + borderRadius, _bottom);
            horLabelBackgroundPath.arc(-borderRadius, -borderRadius, borderRadius, 0, 0, false);
            horLabelBackgroundPath.lineTo(_left, _top + borderRadius);
            horLabelBackground.path = horLabelBackgroundPath;
            horLabelBackground.stroke = borderColor;
            horLabelBackground.fill = fillColor;
            pathInfo.horLabelBackground = horLabelBackground;
          } else {
            // 当手指除出chart时清除横线label
            pathInfo.horLabelBackground = null;
            pathInfo.horLabel = null;
          }

          // 绘制横线副Label
          if (showHorSubLabel) {
            var currChangePct = ((currValue - preClosedPrice) / preClosedPrice * 100).toFixed(2);
            var horSubLabel = {
              x: frame.width - rightOffset - horSubLabelWidth + horLabelXOffset,
              y: actualY - horLabelHeight / 2 + horLabelYOffset,
              text: currChangePct + '%',
              fill: actualFontColor
            };
            pathInfo.horSubLabel = horSubLabel;

            // bg
            var horSubLabelBackgroundPath = _reactNative.ART.Path();
            var _top2 = actualY - horLabelHeight / 2;
            var _bottom2 = actualY + horLabelHeight / 2;
            var _left2 = frame.width - rightOffset - horSubLabelWidth;
            var _right2 = frame.width - rightOffset;
            horSubLabelBackgroundPath.moveTo(_left2, _top2 + borderRadius);
            horSubLabelBackgroundPath.arc(borderRadius, -borderRadius, borderRadius, 0, 0, false);
            horSubLabelBackgroundPath.lineTo(_right2 - borderRadius, _top2);
            horSubLabelBackgroundPath.arc(borderRadius, borderRadius, borderRadius, 0, 0, false);
            horSubLabelBackgroundPath.lineTo(_right2, _bottom2 - borderRadius);
            horSubLabelBackgroundPath.arc(-borderRadius, borderRadius, borderRadius, 0, 0, false);
            horSubLabelBackgroundPath.lineTo(_left2 + borderRadius, _bottom2);
            horSubLabelBackgroundPath.arc(-borderRadius, -borderRadius, borderRadius, 0, 0, false);
            horSubLabelBackgroundPath.lineTo(_left2, _top2 + borderRadius);
            horSubLabelBackground.path = horSubLabelBackgroundPath;
            horSubLabelBackground.stroke = borderColor;
            horSubLabelBackground.fill = fillColor;
            pathInfo.horSubLabelBackground = horSubLabelBackground;
          } else {
            // 当手指除出chart时清除横线label
            pathInfo.horSubLabelBackground = null;
            pathInfo.horSubLabel = null;
          }
        }

        // 绘制纵线Label
        if (showVerLabel) {
          var plotData = data.slice(domain.start, domain.end + 1);
          var verLabelText = plotData[(0, _util.getCurrentItem)(xScale, null, [loc[0]], plotData, 'index')][0];
          if (isTimestamp) {
            verLabelText = _momentTimezone2.default.tz(verLabelText, timezone).format(dateFormat);
          } else {
            var timestamp = (0, _util.getTimestamp)(verLabelText, timezone);
            verLabelText = _momentTimezone2.default.tz(timestamp, timezone).format(dateFormat);
          }
          var verLabelX = actualX - verLabelWidth / 2;
          if (verLabelX < leftOffset) {
            verLabelX = leftOffset;
          } else if (verLabelX > width - verLabelWidth - rightOffset) {
            verLabelX = width - verLabelWidth - rightOffset;
          }
          var verLabel = {
            x: verLabelX + verLabelXOffset,
            y: topOffset + verLabelYOffset,
            text: verLabelText
          };
          var verLabelBackground = {};
          var verLabelBackgroundPath = _reactNative.ART.Path();
          var _top3 = topOffset;
          var _bottom3 = verLabelHeight + topOffset;
          var _left3 = verLabelX;
          var _right3 = verLabelX + verLabelWidth;
          verLabelBackgroundPath.moveTo(_left3, _top3 + borderRadius);
          verLabelBackgroundPath.arc(borderRadius, -borderRadius, borderRadius, 0, 0, false);
          verLabelBackgroundPath.lineTo(_right3 - borderRadius, _top3);
          verLabelBackgroundPath.arc(borderRadius, borderRadius, borderRadius, 0, 0, false);
          verLabelBackgroundPath.lineTo(_right3, _bottom3 - borderRadius);
          verLabelBackgroundPath.arc(-borderRadius, borderRadius, borderRadius, 0, 0, false);
          verLabelBackgroundPath.lineTo(_left3 + borderRadius, _bottom3);
          verLabelBackgroundPath.arc(-borderRadius, -borderRadius, borderRadius, 0, 0, false);
          verLabelBackgroundPath.lineTo(_left3, _top3 + borderRadius);
          verLabelBackground.path = verLabelBackgroundPath;
          verLabelBackground.stroke = borderColor;
          verLabelBackground.fill = fillColor;
          pathInfo.verLabelBackground = verLabelBackground;
          pathInfo.verLabel = verLabel;
        }
        return pathInfo;
      }

      return {
        path: null,
        verLabel: null,
        verLabelBackground: null,
        horLabel: null,
        horLabelBackground: null,
        horSubLabel: null,
        horSubLabelBackground: null
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * 组件属性
   *
   * @static
   * @memberof CrossHair
   */


  _createClass(CrossHair, [{
    key: 'shouldComponentUpdate',


    /**
     * 生命周期
     *
     * @memberof CrossHair
     */
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var shouldUpdate = false;

      if (nextContext) {
        var _context = this.context,
            preEvents = _context.events,
            preXScale = _context.xScale,
            preYScale = _context.yScale,
            preCurrentItem = _context.currentItem,
            preDomain = _context.domain,
            preData = _context.data,
            preFrame = _context.frame;
        var events = nextContext.events,
            xScale = nextContext.xScale,
            yScale = nextContext.yScale,
            currentItem = nextContext.currentItem,
            domain = nextContext.domain,
            data = nextContext.data,
            frame = nextContext.frame;


        if (JSON.stringify(preEvents.longPressEvent) !== JSON.stringify(events.longPressEvent)) {
          shouldUpdate = true;
        }
        if (JSON.stringify(currentItem) !== JSON.stringify(preCurrentItem)) {
          shouldUpdate = true;
        }
        if (!preXScale || !xScale || !preYScale || !yScale) {
          shouldUpdate = true;
        }
        if (events.longPressEvent) {
          var testNumber = 10;
          if (JSON.stringify(domain) !== JSON.stringify(preDomain) || JSON.stringify(data) !== JSON.stringify(preData) || JSON.stringify(frame) !== JSON.stringify(preFrame) || xScale(testNumber) !== preXScale(testNumber) || yScale(testNumber) !== preYScale(testNumber)) {
            shouldUpdate = true;
          }
        }
      }
      if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
        shouldUpdate = true;
      }
      return shouldUpdate;
    }

    /**
     * 绘制十字线
     *
     * @memberof CrossHair
     */

  }, {
    key: 'render',


    /**
     * 渲染区
     *
     * @returns
     * @memberof CrossHair
     */
    value: function render() {
      var events = this.context.events;

      var pathInfo = void 0;
      if (events) {
        var longPressEvent = events.longPressEvent;

        if (longPressEvent) {
          pathInfo = this._drawCrossHairCursor();
        } else {
          pathInfo = {
            path: null,
            verLabel: null,
            verLabelBackground: null,
            horLabel: null,
            horLabelBackground: null,
            horSubLabel: null,
            horSubLabelBackground: null
          };
        }
      }
      var _pathInfo = pathInfo,
          path = _pathInfo.path,
          verLabel = _pathInfo.verLabel,
          verLabelBackground = _pathInfo.verLabelBackground,
          horLabel = _pathInfo.horLabel,
          horLabelBackground = _pathInfo.horLabelBackground,
          horSubLabel = _pathInfo.horSubLabel,
          horSubLabelBackground = _pathInfo.horSubLabelBackground;
      var _props = this.props,
          fontFamily = _props.fontFamily,
          fontWeight = _props.fontWeight,
          fontSize = _props.fontSize,
          borderWidth = _props.borderWidth,
          fontColor = _props.fontColor,
          lineColor = _props.lineColor,
          lineWidth = _props.lineWidth;


      var font = { fontFamily: fontFamily, fontWeight: fontWeight, fontSize: fontSize };

      return _react2.default.createElement(
        Group,
        null,
        _react2.default.createElement(Shape, { d: path, stroke: lineColor, strokeWidth: lineWidth }),
        verLabelBackground ? _react2.default.createElement(Shape, {
          d: verLabelBackground.path,
          stroke: verLabelBackground.stroke,
          fill: verLabelBackground.fill,
          strokeWidth: borderWidth
        }) : null,
        verLabel ? _react2.default.createElement(
          Text,
          {
            font: font,
            fill: fontColor,
            x: verLabel.x,
            y: verLabel.y
          },
          verLabel.text
        ) : null,
        horLabelBackground ? _react2.default.createElement(Shape, {
          d: horLabelBackground.path,
          stroke: horLabelBackground.stroke,
          fill: horLabelBackground.fill,
          strokeWidth: borderWidth
        }) : null,
        horLabel ? _react2.default.createElement(
          Text,
          {
            font: font,
            fill: horLabel.fill,
            x: horLabel.x,
            y: horLabel.y
          },
          horLabel.text
        ) : null,
        horSubLabelBackground ? _react2.default.createElement(Shape, {
          d: horSubLabelBackground.path,
          stroke: horSubLabelBackground.stroke,
          fill: horSubLabelBackground.fill,
          strokeWidth: borderWidth
        }) : null,
        horSubLabel ? _react2.default.createElement(
          Text,
          {
            font: font,
            fill: horSubLabel.fill,
            x: horSubLabel.x,
            y: horSubLabel.y
          },
          horSubLabel.text
        ) : null
      );
    }
  }]);

  return CrossHair;
}(_react.Component);

CrossHair.defaultProps = {
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  fontSize: 10,
  fontColor: 'gray',
  riseFontColor: '#F45642',
  fallFontColor: '#42F486',
  leftOffset: 0,
  rightOffset: 0,
  topOffset: 0,
  bottomOffset: 0,
  horLineVerPadding: 20,
  horLabelHeight: 20,
  horLabelWidth: 40,
  horSubLabelWidth: 40,
  horLabelYOffset: 3,
  horLabelXOffset: 3,
  verLabelYOffset: 3,
  verLabelXOffset: 3,
  verLabelHeight: 18,
  verLabelWidth: 58,
  fillColor: '#31323A',
  borderColor: '#78797E',
  borderRadius: 0,
  borderWidth: _reactNative.StyleSheet.hairlineWidth,
  lineColor: 'gray',
  lineWidth: _reactNative.StyleSheet.hairlineWidth,

  preClosedPrice: NaN,
  showHorLabel: true,
  showHorSubLabel: false,
  showVerLabel: false,
  isTimestamp: true,
  dateFormat: 'HH:mm',
  timezone: 'Asia/Shanghai'
};
CrossHair.propTypes = {
  // 字体集
  fontFamily: _propTypes2.default.string,
  // 字体粗细
  fontWeight: _propTypes2.default.string,
  // 字体大小
  fontSize: _propTypes2.default.number,
  // 字体颜色
  fontColor: _propTypes2.default.string,
  // 上涨颜色
  riseFontColor: _propTypes2.default.string,
  // 下跌颜色
  fallFontColor: _propTypes2.default.string,
  // 左侧偏移量
  leftOffset: _propTypes2.default.number,
  // 右侧偏移量
  rightOffset: _propTypes2.default.number,
  // 顶部偏移量
  topOffset: _propTypes2.default.number,
  // 底部偏移量
  bottomOffset: _propTypes2.default.number,
  // 横线的垂直方向padding
  horLineVerPadding: _propTypes2.default.number,
  // horLabel
  // 水平方向label高度
  horLabelHeight: _propTypes2.default.number,
  // 水平label宽度
  horLabelWidth: _propTypes2.default.number,
  // 水平副label宽度
  horSubLabelWidth: _propTypes2.default.number,
  // 水平label左侧偏移量
  horLabelXOffset: _propTypes2.default.number,
  // 水平label顶部偏移量
  horLabelYOffset: _propTypes2.default.number,
  // 垂直label左侧偏移量
  verLabelYOffset: _propTypes2.default.number,
  // 水平label顶部偏移量
  verLabelXOffset: _propTypes2.default.number,
  // 垂直方向label高度
  verLabelHeight: _propTypes2.default.number,
  // 垂直label宽度
  verLabelWidth: _propTypes2.default.number,
  // label填充色
  fillColor: _propTypes2.default.string,
  // label边框色
  borderColor: _propTypes2.default.string,
  // label边框圆角
  borderRadius: _propTypes2.default.number,
  // label边框粗细
  borderWidth: _propTypes2.default.number,
  // 十字线颜色
  lineColor: _propTypes2.default.string,
  // 十字线粗细
  lineWidth: _propTypes2.default.number,

  // 昨日收盘价
  preClosedPrice: _propTypes2.default.number,
  // 显示垂直方向的顶部label
  showVerLabel: _propTypes2.default.bool,
  // 显示水平方向的左侧label
  showHorLabel: _propTypes2.default.bool,
  // 显示水平方向的右侧label
  showHorSubLabel: _propTypes2.default.bool,
  // 是否是时间戳
  isTimestamp: _propTypes2.default.bool,
  // 日期格式
  dateFormat: _propTypes2.default.string,
  // 时区
  timezone: _propTypes2.default.string };
exports.default = CrossHair;


CrossHair.contextTypes = {
  data: _propTypes2.default.array,
  domain: _propTypes2.default.object,
  frame: _propTypes2.default.object,
  xScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func,
  events: _propTypes2.default.object,
  currentItem: _propTypes2.default.object
};