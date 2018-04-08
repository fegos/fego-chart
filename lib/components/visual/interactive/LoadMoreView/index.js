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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * OnLoadMore视觉组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author 徐达迟
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Shape = _reactNative.ART.Shape,
    Group = _reactNative.ART.Group,
    Text = _reactNative.ART.Text;

var LoadMoreView = function (_Component) {
  _inherits(LoadMoreView, _Component);

  function LoadMoreView(props) {
    _classCallCheck(this, LoadMoreView);

    var _this = _possibleConstructorReturn(this, (LoadMoreView.__proto__ || Object.getPrototypeOf(LoadMoreView)).call(this, props));

    _this.drawLoadMoreView = function () {
      if (_this.context) {
        var _this$props = _this.props,
            width = _this$props.width,
            visible = _this$props.visible,
            preloadText = _this$props.preloadText,
            loadingText = _this$props.loadingText,
            fontFamily = _this$props.fontFamily,
            fontWeight = _this$props.fontWeight,
            fontSize = _this$props.fontSize,
            fontColor = _this$props.fontColor;
        var _this$context = _this.context,
            frame = _this$context.frame,
            offset = _this$context.offset,
            loadStatus = _this$context.loadStatus,
            hasMore = _this$context.hasMore;
        var chartHeight = frame.height;

        var loadViewPath = null;
        var loadViewText = null;
        var loadViewIcon = null;

        // 如果没有更多历史数据或者visible属性为false，则不显示任何元素
        if (!hasMore || !visible) {
          _this._drawInfo = {
            loadViewPath: loadViewPath,
            loadViewText: loadViewText,
            loadViewIcon: loadViewIcon
          };
        } else {
          // 绘制背景
          loadViewPath = _reactNative.ART.Path();
          var left = offset - width;
          var right = offset;
          loadViewPath.moveTo(left, 0);
          loadViewPath.lineTo(right, 0);
          loadViewPath.lineTo(right, chartHeight);
          loadViewPath.lineTo(left, chartHeight);
          loadViewPath.close();

          var font = { fontFamily: fontFamily, fontWeight: fontWeight, fontSize: fontSize };
          // 绘制Icon
          loadViewIcon = {
            x: offset - width * 0.5,
            y: chartHeight * 0.3,
            fill: fontColor,
            font: font,
            text: String.fromCharCode(0xE638)
          };
          var loadText = void 0;
          if (loadStatus === 'preload') {
            loadText = preloadText;
          } else if (loadStatus === 'loading') {
            loadText = loadingText;
          }
          // 绘制文案
          loadViewText = {
            x: offset - width * 0.5,
            y: chartHeight * 0.5,
            fill: fontColor,
            font: font,
            text: loadText
          };

          _this._drawInfo = {
            loadViewPath: loadViewPath,
            loadViewText: loadViewText,
            loadViewIcon: loadViewIcon
          };
        }
      }
    };

    _this._drawInfo = {
      loadViewPath: null,
      loadViewIcon: null,
      loadViewText: null
    };
    return _this;
  }

  _createClass(LoadMoreView, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      if (JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.context) !== JSON.stringify(nextContext)) {
        return true;
      }
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          backgroundColor = _props.backgroundColor,
          fontColor = _props.fontColor;

      this.drawLoadMoreView();
      var _drawInfo = this._drawInfo,
          loadViewPath = _drawInfo.loadViewPath,
          loadViewIcon = _drawInfo.loadViewIcon,
          loadViewText = _drawInfo.loadViewText;


      return _react2.default.createElement(
        Group,
        null,
        loadViewPath ? _react2.default.createElement(Shape, { d: loadViewPath, fill: backgroundColor }) : null,
        loadViewText ? _react2.default.createElement(
          Text,
          {
            font: loadViewText.font,
            fill: fontColor,
            x: loadViewText.x,
            y: loadViewText.y,
            alignment: 'center'
          },
          loadViewText.text
        ) : null,
        loadViewIcon ? _react2.default.createElement(
          Text,
          {
            font: loadViewIcon.font,
            fill: fontColor,
            x: loadViewIcon.x,
            y: loadViewIcon.y,
            alignment: 'center'
          },
          loadViewIcon.text
        ) : null
      );
    }
  }]);

  return LoadMoreView;
}(_react.Component);

LoadMoreView.defaultProps = {
  width: 100,
  visible: true,
  backgroundColor: 'rgba(255,255,255,0)',
  fontColor: '#FFF',
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  fontSize: 13,
  preloadText: '加载更多',
  loadingText: '加载中...'
};
LoadMoreView.propTypes = {
  // 组件宽度
  width: _propTypes2.default.number,
  // 是否可见
  visible: _propTypes2.default.bool,
  // 背景颜色
  backgroundColor: _propTypes2.default.string,
  // 展示颜色
  fontColor: _propTypes2.default.string,
  // 字体集
  fontFamily: _propTypes2.default.string,
  // 字体粗细
  fontWeight: _propTypes2.default.string,
  // 字体大小
  fontSize: _propTypes2.default.number,
  // 预加载文案
  preloadText: _propTypes2.default.string,
  // 加载中文案
  loadingText: _propTypes2.default.string
};
exports.default = LoadMoreView;


LoadMoreView.contextTypes = {
  frame: _propTypes2.default.object,
  offset: _propTypes2.default.number,
  hasMore: _propTypes2.default.bool,
  loadStatus: _propTypes2.default.string
};