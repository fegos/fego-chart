'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 手势管理组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author eric
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * 阈值
 */
var moveThreshold = 5;
var doublePressAvailableThreshold = 45;

/**
 * 手势种类，同一时间只能识别一种，手势之间互斥。
 */
var GestureType = {
  idle: 100,
  pan: 101,
  pinch: 102,
  press: 103,
  longPress: 104,
  doublePress: 105,

  judgingLongPress: 106,
  judgingDoublePress: 107
};

var EventCapture = function (_Component) {
  _inherits(EventCapture, _Component);

  function EventCapture(props) {
    _classCallCheck(this, EventCapture);

    var _this = _possibleConstructorReturn(this, (EventCapture.__proto__ || Object.getPrototypeOf(EventCapture)).call(this, props));

    _this._shouldBecomePressResponder = function (e, gestureState) {
      var eventCaptures = _this.props.eventCaptures;

      var should = false;
      if (eventCaptures && eventCaptures.length) {
        if (gestureState.numberActiveTouches === 1) {
          if (eventCaptures.includes('press') || eventCaptures.includes('longPress') || eventCaptures.includes('doublePress')) {
            should = true;
          }
        }
      }
      return should;
    };

    _this._shouldBecomeMoveResponder = function (e, gestureState) {
      var eventCaptures = _this.props.eventCaptures;

      var should = false;
      if (eventCaptures && eventCaptures.length) {
        switch (gestureState.numberActiveTouches) {
          case 1:
            if (eventCaptures.includes('pan')) {
              var dx = gestureState.dx,
                  dy = gestureState.dy;

              if (Math.abs(dx) > Math.abs(dy)) {
                should = true;
              }
            }
            break;

          case 2:
            if (eventCaptures.includes('pinch')) {
              should = true;
            }
            break;

          default:
            break;
        }
      }
      return should;
    };

    _this._onStartShouldSetPanResponderCapture = function () {
      return _this.props.shouldCapturePressGesture;
    };

    _this._onMoveShouldSetPanResponderCapture = function () {
      return _this.props.shouldCaptureMoveGesture;
    };

    _this._onStartShouldSetPanResponder = function (e, gestureState) {
      return _this._shouldBecomePressResponder(e, gestureState);
    };

    _this._onMoveShouldSetPanResponder = function (e, gestureState) {
      return _this._shouldBecomeMoveResponder(e, gestureState);
    };

    _this._onPanResponderTerminationRequest = function () {
      if (_this._gestureType === GestureType.longPress || _this._gestureType === GestureType.pan) {
        return false;
      } else {
        return _this.props.shouldTerminationRequest;
      }
    };

    _this._onPanResponderTerminate = function (e, gestureState) {
      // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      _this._setGestureType(GestureType.idle, e, gestureState);
    };

    _this._onShouldBlockNativeResponder = function () {
      return _this.props.shouldBlockNativeResponder;
    };

    _this._onPanResponderStart = function (e, gestureState) {
      var eventCaptures = _this.props.eventCaptures;

      switch (_this._gestureType) {
        case GestureType.idle:
          if (eventCaptures.includes('longPress')) {
            _this._setGestureType(GestureType.judgingLongPress, e, gestureState);
          }
          break;

        case GestureType.judgingDoublePress:
          if (_this._isSecondTouchAvailable(e, gestureState)) {
            _this._setGestureType(GestureType.doublePress, e, gestureState);
          } else {
            _this._setGestureType(GestureType.idle, e, gestureState);
          }
          break;

        default:
          break;
      }
    };

    _this._onPanResponderMove = function (e, gestureState) {
      var eventCaptures = _this.props.eventCaptures;
      var dx = gestureState.dx,
          dy = gestureState.dy;

      switch (gestureState.numberActiveTouches) {
        case 1:
          switch (_this._gestureType) {
            case GestureType.idle:
            case GestureType.judgingLongPress:
              dx = Math.abs(dx);
              dy = Math.abs(dy);
              if (dx > moveThreshold || dy > moveThreshold) {
                if (eventCaptures.includes('pan') && dx > dy) {
                  _this._setGestureType(GestureType.pan, e, gestureState);
                } else {
                  _this._setGestureType(GestureType.idle, e, gestureState);
                }
              }
              break;

            case GestureType.pan:
              _this._setGestureType(GestureType.pan, e, gestureState);
              break;

            case GestureType.longPress:
              _this._setGestureType(GestureType.longPress, e, gestureState);
              break;

            default:
              break;
          }
          break;

        case 2:
          if (eventCaptures.includes('pinch')) {
            _this._setGestureType(GestureType.pinch, e, gestureState);
          }
          break;

        default:
          _this._setGestureType(GestureType.idle, e, gestureState);
          break;
      }
    };

    _this._onPanResponderRelease = function (e, gestureState) {
      var eventCaptures = _this.props.eventCaptures;

      switch (_this._gestureType) {
        case GestureType.longPress:
        case GestureType.doublePress:
        case GestureType.pinch:
        case GestureType.pan:
          _this._setGestureType(GestureType.idle, e, gestureState);
          break;

        default:
          if (eventCaptures.includes('doublePress')) {
            _this._setGestureType(GestureType.judgingDoublePress, e, gestureState);
          } else if (eventCaptures.includes('press')) {
            _this._setGestureType(GestureType.press, e, gestureState);
          }
          break;
      }
    };

    _this._setGestureType = function (gestureType, e, gestureState) {
      switch (gestureType) {
        case GestureType.idle:
          switch (_this._gestureType) {
            case GestureType.longPress:
              _this._handleLongPressEvent(EventCapture.EventState.end, e, gestureState);
              break;

            case GestureType.pinch:
              _this._handlePinchEvent(EventCapture.EventState.end, e, gestureState);
              break;

            case GestureType.pan:
              _this._handlePanEvent(EventCapture.EventState.end, e, gestureState);
              break;

            case GestureType.judgingLongPress:
              _this._removeLongPressTimer();
              break;

            case GestureType.judgingDoublePress:
              _this._removeDoublePressTimer();
              break;

            default:
              break;
          }
          _this._gestureType = GestureType.idle;
          break;

        case GestureType.press:
          if (_this._gestureType === GestureType.judgingLongPress) {
            _this._removeDoublePressTimer();
          }
          _this._handlePressEvent(EventCapture.EventState.start, e, gestureState);
          _this._gestureType = GestureType.idle;
          break;

        case GestureType.longPress:
          _this._removeLongPressTimer();
          if (_this._gestureType === GestureType.longPress) {
            _this._handleLongPressEvent(EventCapture.EventState.changing, e, gestureState);
          } else {
            _this._handleLongPressEvent(EventCapture.EventState.start, e, gestureState);
            _this._gestureType = GestureType.longPress;
          }
          break;

        case GestureType.doublePress:
          _this._gestureType = GestureType.doublePress;
          _this._handleDoublePressEvent(EventCapture.EventState.start, e, gestureState);
          break;

        case GestureType.pan:
          if (_this._gestureType === GestureType.pan) {
            _this._handlePanEvent(EventCapture.EventState.changing, e, gestureState);
          } else {
            _this._gestureType = GestureType.pan;
            _this._removeLongPressTimer();
            _this._handlePanEvent(EventCapture.EventState.start, e, gestureState);
          }
          break;

        case GestureType.pinch:
          switch (_this._gestureType) {
            case GestureType.pinch:
              _this._handlePinchEvent(EventCapture.EventState.changing, e, gestureState);
              break;

            case GestureType.pan:
              _this._handlePanEvent(EventCapture.EventState.end, e, gestureState);
              _this._recordOriginalSpan(e, gestureState);
              _this._handlePinchEvent(EventCapture.EventState.start, e, gestureState);
              _this._gestureType = GestureType.pinch;
              break;

            case GestureType.longPress:
              _this._handleLongPressEvent(EventCapture.EventState.end, e, gestureState);
              _this._recordOriginalSpan(e, gestureState);
              _this._handlePinchEvent(EventCapture.EventState.start, e, gestureState);
              _this._gestureType = GestureType.pinch;
              break;

            case GestureType.idle:
            case GestureType.judgingLongPress:
              _this._removeLongPressTimer();
              _this._recordOriginalSpan(e, gestureState);
              _this._handlePinchEvent(EventCapture.EventState.start, e, gestureState);
              _this._gestureType = GestureType.pinch;
              break;

            default:
              break;
          }break;

        case GestureType.judgingDoublePress:
          _this._gestureType = GestureType.judgingDoublePress;
          _this._recordFirstTouch(e, gestureState);
          _this._setDoublePressTimer(e, gestureState);
          break;

        case GestureType.judgingLongPress:
          _this._gestureType = GestureType.judgingLongPress;
          _this._setLongPressTimer(e, gestureState);
          break;

        default:
          break;
      }
    };

    _this._handlePressEvent = function (eventState, e, gestureState) {
      _this.props.onPress && _this.props.onPress(eventState, e, gestureState);
    };

    _this._handleLongPressEvent = function (eventState, e, gestureState) {
      _this.props.onLongPress && _this.props.onLongPress(eventState, e, gestureState);
    };

    _this._handleDoublePressEvent = function (eventState, e, gestureState) {
      _this.props.onDoublePress && _this.props.onDoublePress(eventState, e, gestureState);
    };

    _this._handlePanEvent = function (eventState, e, gestureState) {
      _this.props.onPan && _this.props.onPan(eventState, e, gestureState);
    };

    _this._handlePinchEvent = function (eventState, e) {
      var touches = e.nativeEvent.touches;

      if (touches && touches.length === 2) {
        var x = Math.pow(touches[0].locationX - touches[1].locationX, 2);
        var y = Math.pow(touches[0].locationY - touches[1].locationY, 2);
        var currentSpan = Math.sqrt(x + y);
        var totalScale = currentSpan / _this._orignalSpan;
        var activeScale = currentSpan / _this._activeSpan;
        _this.props.onPinch && _this.props.onPinch(eventState, e, totalScale, activeScale, _this._recordActiveSpan);
      }
    };

    _this._setLongPressTimer = function (e, gestureState) {
      _this._removeLongPressTimer();
      var evt = { nativeEvent: e.nativeEvent };
      var tempGestureState = Object.assign({}, gestureState);
      _this._longPressTimer = setTimeout(function () {
        if (_this._gestureType === GestureType.judgingLongPress) {
          _this._setGestureType(GestureType.longPress, evt, tempGestureState);
        }
      }, _this.props.longPressTimeoutInterval);
    };

    _this._removeLongPressTimer = function () {
      clearTimeout(_this._longPressTimer);
      _this._longPressTimer = null;
    };

    _this._setDoublePressTimer = function (e, gestureState) {
      _this._removeDoublePressTimer();
      var evt = { nativeEvent: e.nativeEvent };
      var tempGestureState = Object.assign({}, gestureState);
      var eventCaptures = Object.assign([], _this.props.eventCaptures);
      _this._doublePressTimer = setTimeout(function () {
        if (_this._gestureType === GestureType.judgingDoublePress) {
          if (eventCaptures.includes('press')) {
            _this._setGestureType(GestureType.press, evt, tempGestureState);
          } else {
            _this._setGestureType(GestureType.idle, evt, tempGestureState);
          }
        }
      }, _this.props.doublePressTimeoutInterval);
    };

    _this._removeDoublePressTimer = function () {
      clearTimeout(_this._doublePressTimer);
      _this._doublePressTimer = null;
    };

    _this._recordFirstTouch = function (e) {
      var touches = e.nativeEvent.changedTouches;
      if (touches && touches.length) {
        var _touches = _slicedToArray(touches, 1),
            touch = _touches[0];

        _this._firstTouch = touch;
      }
    };

    _this._isSecondTouchAvailable = function (e) {
      if (e && e.nativeEvent) {
        if (e.nativeEvent.touches && e.nativeEvent.touches.length) {
          var firstTouch = _this._firstTouch;
          var touch = e.nativeEvent.touches[0];
          var disX = Math.abs(touch.pageX - firstTouch.pageX);
          var disY = Math.abs(touch.pageY - firstTouch.pageY);
          if (disX < doublePressAvailableThreshold && disY < doublePressAvailableThreshold) {
            return true;
          }
        }
      }
      return false;
    };

    _this._recordOriginalSpan = function (e, gestureState) {
      var touches = e.nativeEvent.touches;

      if (touches && touches.length === 2 && gestureState.numberActiveTouches === 2) {
        var x = Math.pow(touches[1].locationX - touches[0].locationX, 2);
        var y = Math.pow(touches[1].locationY - touches[0].locationY, 2);
        _this._orignalSpan = Math.sqrt(x + y);
        _this._recordActiveSpan(e);
      }
    };

    _this._recordActiveSpan = function (e) {
      var touches = e.nativeEvent.touches;

      if (touches && touches.length === 2) {
        var x = Math.pow(touches[1].locationX - touches[0].locationX, 2);
        var y = Math.pow(touches[1].locationY - touches[0].locationY, 2);
        _this._activeSpan = Math.sqrt(x + y);
      }
    };

    _this._gestureType = GestureType.idle;

    _this._orignalSpan = 0; // 初始指距
    _this._activeSpan = 0; // 活动指距

    _this._firstTouch = {}; // 双击手势的第一个落点

    _this._longPressTimer = null; // 长按事件计时器
    _this._doublePressTimer = null; // 双击事件计时器

    _this._panResponder = _reactNative.PanResponder.create({
      // 是否捕获手势，用来抢占子view的手势
      onStartShouldSetPanResponderCapture: _this._onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponderCapture: _this._onMoveShouldSetPanResponderCapture,

      // 是否成为手势的响应者
      onStartShouldSetPanResponder: _this._onStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: _this._onMoveShouldSetPanResponder,

      // 手势处理
      onPanResponderGrant: _this._onPanResponderGrant,
      onPanResponderStart: _this._onPanResponderStart,
      onPanResponderMove: _this._onPanResponderMove,
      onPanResponderEnd: _this._onpanResponderEnd,
      onPanResponderRelease: _this._onPanResponderRelease,
      onPanResponderTerminate: _this._onPanResponderTerminate,
      onShouldBlockNativeResponder: _this._onShouldBlockNativeResponder,
      onPanResponderTerminationRequest: _this._onPanResponderTerminationRequest
    });
    return _this;
  }

  /**
   * 是否响应手势
   *
   * @memberof EventCapture
   */

  /**
   * 是否响应点击类手势
   */

  /**
   * 手势状态
   */


  /**
   * 是否响应滑动类手势
   */


  /**
   * PanResponder手势周期
   *
   * @memberof EventCapture
   */

  /**
   * 是否捕获点击事件
   */


  /**
   * 是否捕获滑动事件
   */


  /**
   * 是否成为点击响应者
   */


  /**
   * 是否成为滑动响应者，在以上API返回false的情况下调用
   */


  /**
   * 在收到手势捕获请求时，决定是否终止响应，true为结束响应，出让手势，false为拒绝。
   */


  /**
   * 手势被争夺之后的回调
   */


  /**
   * 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
   * 默认返回true。目前暂时只支持android。
   */


  /**
   * 点击事件回调
   */


  /**
   * 移动事件回调
   */


  /**
   * 全部手指离开屏幕
   */


  /**
   * 状态管理
   *
   * @memberof EventCapture
   */


  /**
   * 事件处理
   *
   * @memberof EventCapture
   */

  /**
   * 计时器管理
   *
   * @memberof EventCapture
   */

  /**
   * 长按手势计时器
   */


  /**
   * 双击计时器
   */


  /**
   * 工具方法
   *
   * @memberof EventCapture
   */

  /**
   * 记录双击的第一个落点
   */


  /**
   * 判断双击第二个落点是否有效
   */


  /**
   * 记录原始指距
   */


  /**
   * 记录临时指距
   */


  _createClass(EventCapture, [{
    key: 'render',


    /**
     * 渲染区
     *
     * @returns
     * @memberof EventCapture
     */
    value: function render() {
      return _react2.default.createElement(
        _reactNative.View,
        _extends({
          style: this.props.style,
          onLayout: this.props.onLayout
        }, this._panResponder.panHandlers),
        this.props.children
      );
    }
  }]);

  return EventCapture;
}(_react.Component);

EventCapture.EventState = {
  start: 1001,
  changing: 1002,
  end: 1003
};
EventCapture.defaultProps = {
  shouldCaptureMoveGesture: false,
  shouldCapturePressGesture: false,
  shouldTerminationRequest: true,
  shouldBlockNativeResponder: false,

  eventCaptures: [],

  onPan: function onPan() {},
  onPinch: function onPinch() {},
  onPress: function onPress() {},
  onLongPress: function onLongPress() {},
  onDoublePress: function onDoublePress() {},

  longPressTimeoutInterval: 500,
  doublePressTimeoutInterval: 300
};
EventCapture.propTypes = {
  // 事件回调
  onPan: _propTypes2.default.func,
  onPinch: _propTypes2.default.func,
  onPress: _propTypes2.default.func,
  onLongPress: _propTypes2.default.func,
  onDoublePress: _propTypes2.default.func,

  // 监听的事件集 pan/press/doublePress/longPress/pinch
  eventCaptures: _propTypes2.default.arrayOf(_propTypes2.default.string),

  // 是否捕获手势
  shouldCaptureMoveGesture: _propTypes2.default.bool,
  shouldCapturePressGesture: _propTypes2.default.bool,

  // 收到手势捕获请求时，是否终止响应
  shouldTerminationRequest: _propTypes2.default.bool,
  shouldBlockNativeResponder: _propTypes2.default.bool,

  // 手势timer时长
  longPressTimeoutInterval: _propTypes2.default.number,
  doublePressTimeoutInterval: _propTypes2.default.number
};
exports.default = EventCapture;