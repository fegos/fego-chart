/**
 * 手势管理组件
 *
 * @author eric
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder } from 'react-native';

/**
 * 阈值
 */
const moveThreshold = 5;
const doublePressAvailableThreshold = 45;

/**
 * 手势种类，同一时间只能识别一种，手势之间互斥。
 */
const GestureType = {
  idle: 100,
  pan: 101,
  pinch: 102,
  press: 103,
  longPress: 104,
  doublePress: 105,

  judgingLongPress: 106,
  judgingDoublePress: 107,
};

export default class EventCapture extends Component {
  /**
   * 手势状态
   */
  static EventState = {
    start: 1001,
    changing: 1002,
    end: 1003,
  };

  static defaultProps = {
    shouldCaptureMoveGesture: false,
    shouldCapturePressGesture: false,
    shouldTerminationRequest: true,
    shouldBlockNativeResponder: false,

    eventCaptures: [],

    onPan: () => { },
    onPinch: () => { },
    onPress: () => { },
    onLongPress: () => { },
    onDoublePress: () => { },

    longPressTimeoutInterval: 500,
    doublePressTimeoutInterval: 300,
  }

  static propTypes = {
    // 事件回调
    onPan: PropTypes.func,
    onPinch: PropTypes.func,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    onDoublePress: PropTypes.func,

    // 监听的事件集 pan/press/doublePress/longPress/pinch
    eventCaptures: PropTypes.arrayOf(PropTypes.string),

    // 是否捕获手势
    shouldCaptureMoveGesture: PropTypes.bool,
    shouldCapturePressGesture: PropTypes.bool,

    // 收到手势捕获请求时，是否终止响应
    shouldTerminationRequest: PropTypes.bool,
    shouldBlockNativeResponder: PropTypes.bool,

    // 手势timer时长
    longPressTimeoutInterval: PropTypes.number,
    doublePressTimeoutInterval: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this._gestureType = GestureType.idle;

    this._orignalSpan = 0; // 初始指距
    this._activeSpan = 0; // 活动指距

    this._firstTouch = {}; // 双击手势的第一个落点

    this._longPressTimer = null; // 长按事件计时器
    this._doublePressTimer = null; // 双击事件计时器

    this._panResponder = PanResponder.create({
      // 是否捕获手势，用来抢占子view的手势
      onStartShouldSetPanResponderCapture: this._onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponderCapture: this._onMoveShouldSetPanResponderCapture,

      // 是否成为手势的响应者
      onStartShouldSetPanResponder: this._onStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder,

      // 手势处理
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderStart: this._onPanResponderStart,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderEnd: this._onpanResponderEnd,
      onPanResponderRelease: this._onPanResponderRelease,
      onPanResponderTerminate: this._onPanResponderTerminate,
      onShouldBlockNativeResponder: this._onShouldBlockNativeResponder,
      onPanResponderTerminationRequest: this._onPanResponderTerminationRequest,
    });
  }


  /**
   * 是否响应手势
   *
   * @memberof EventCapture
   */

  /**
   * 是否响应点击类手势
   */
  _shouldBecomePressResponder = (e, gestureState) => {
    const { eventCaptures } = this.props;
    let should = false;
    if (eventCaptures && eventCaptures.length) {
      if (gestureState.numberActiveTouches === 1) {
        if (eventCaptures.includes('press') ||
          eventCaptures.includes('longPress') ||
          eventCaptures.includes('doublePress')) {
          should = true;
        }
      }
    }
    return should;
  }

  /**
   * 是否响应滑动类手势
   */
  _shouldBecomeMoveResponder = (e, gestureState) => {
    const { eventCaptures } = this.props;
    let should = false;
    if (eventCaptures && eventCaptures.length) {
      switch (gestureState.numberActiveTouches) {
        case 1:
          if (eventCaptures.includes('pan')) {
            const { dx, dy } = gestureState;
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

        default: break;
      }
    }
    return should;
  }


  /**
   * PanResponder手势周期
   *
   * @memberof EventCapture
   */

  /**
   * 是否捕获点击事件
   */
  _onStartShouldSetPanResponderCapture = () => this.props.shouldCapturePressGesture;

  /**
   * 是否捕获滑动事件
   */
  _onMoveShouldSetPanResponderCapture = () => this.props.shouldCaptureMoveGesture;

  /**
   * 是否成为点击响应者
   */
  _onStartShouldSetPanResponder = (e, gestureState) => this._shouldBecomePressResponder(e, gestureState);

  /**
   * 是否成为滑动响应者，在以上API返回false的情况下调用
   */
  _onMoveShouldSetPanResponder = (e, gestureState) => this._shouldBecomeMoveResponder(e, gestureState);

  /**
   * 在收到手势捕获请求时，决定是否终止响应，true为结束响应，出让手势，false为拒绝。
   */
  _onPanResponderTerminationRequest = () => {
    if (this._gestureType === GestureType.longPress ||
      this._gestureType === GestureType.pan) {
      return false;
    } else {
      return this.props.shouldTerminationRequest;
    }
  }

  /**
   * 手势被争夺之后的回调
   */
  _onPanResponderTerminate = (e, gestureState) => {
    // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
    this._setGestureType(GestureType.idle, e, gestureState);
  }

  /**
   * 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
   * 默认返回true。目前暂时只支持android。
   */
  _onShouldBlockNativeResponder = () => this.props.shouldBlockNativeResponder;

  /**
   * 点击事件回调
   */
  _onPanResponderStart = (e, gestureState) => {
    const { eventCaptures } = this.props;
    switch (this._gestureType) {
      case GestureType.idle:
        if (eventCaptures.includes('longPress')) {
          this._setGestureType(GestureType.judgingLongPress, e, gestureState);
        }
        break;

      case GestureType.judgingDoublePress:
        if (this._isSecondTouchAvailable(e, gestureState)) {
          this._setGestureType(GestureType.doublePress, e, gestureState);
        } else {
          this._setGestureType(GestureType.idle, e, gestureState);
        }
        break;

      default: break;
    }
  }

  /**
   * 移动事件回调
   */
  _onPanResponderMove = (e, gestureState) => {
    const { eventCaptures } = this.props;
    let { dx, dy } = gestureState;
    switch (gestureState.numberActiveTouches) {
      case 1:
        switch (this._gestureType) {
          case GestureType.idle:
          case GestureType.judgingLongPress:
            dx = Math.abs(dx);
            dy = Math.abs(dy);
            if (dx > moveThreshold || dy > moveThreshold) {
              if (eventCaptures.includes('pan') &&
                dx > dy) {
                this._setGestureType(GestureType.pan, e, gestureState);
              } else {
                this._setGestureType(GestureType.idle, e, gestureState);
              }
            }
            break;

          case GestureType.pan:
            this._setGestureType(GestureType.pan, e, gestureState);
            break;

          case GestureType.longPress:
            this._setGestureType(GestureType.longPress, e, gestureState);
            break;

          default: break;
        }
        break;

      case 2:
        if (eventCaptures.includes('pinch')) {
          this._setGestureType(GestureType.pinch, e, gestureState);
        }
        break;

      default:
        this._setGestureType(GestureType.idle, e, gestureState);
        break;
    }
  }

  /**
   * 全部手指离开屏幕
   */
  _onPanResponderRelease = (e, gestureState) => {
    const { eventCaptures } = this.props;
    switch (this._gestureType) {
      case GestureType.longPress:
      case GestureType.doublePress:
      case GestureType.pinch:
      case GestureType.pan:
        this._setGestureType(GestureType.idle, e, gestureState);
        break;

      default:
        if (eventCaptures.includes('doublePress')) {
          this._setGestureType(GestureType.judgingDoublePress, e, gestureState);
        } else if (eventCaptures.includes('press')) {
          this._setGestureType(GestureType.press, e, gestureState);
        }
        break;
    }
  }


  /**
   * 状态管理
   *
   * @memberof EventCapture
   */
  _setGestureType = (gestureType, e, gestureState) => {
    switch (gestureType) {
      case GestureType.idle:
        switch (this._gestureType) {
          case GestureType.longPress:
            this._handleLongPressEvent(EventCapture.EventState.end, e, gestureState);
            break;

          case GestureType.pinch:
            this._handlePinchEvent(EventCapture.EventState.end, e, gestureState);
            break;

          case GestureType.pan:
            this._handlePanEvent(EventCapture.EventState.end, e, gestureState);
            break;

          case GestureType.judgingLongPress:
            this._removeLongPressTimer();
            break;

          case GestureType.judgingDoublePress:
            this._removeDoublePressTimer();
            break;

          default: break;
        }
        this._gestureType = GestureType.idle;
        break;

      case GestureType.press:
        if (this._gestureType === GestureType.judgingLongPress) {
          this._removeDoublePressTimer();
        }
        this._handlePressEvent(EventCapture.EventState.start, e, gestureState);
        this._gestureType = GestureType.idle;
        break;

      case GestureType.longPress:
        this._removeLongPressTimer();
        if (this._gestureType === GestureType.longPress) {
          this._handleLongPressEvent(EventCapture.EventState.changing, e, gestureState);
        } else {
          this._handleLongPressEvent(EventCapture.EventState.start, e, gestureState);
          this._gestureType = GestureType.longPress;
        }
        break;

      case GestureType.doublePress:
        this._gestureType = GestureType.doublePress;
        this._handleDoublePressEvent(EventCapture.EventState.start, e, gestureState);
        break;

      case GestureType.pan:
        if (this._gestureType === GestureType.pan) {
          this._handlePanEvent(EventCapture.EventState.changing, e, gestureState);
        } else {
          this._gestureType = GestureType.pan;
          this._removeLongPressTimer();
          this._handlePanEvent(EventCapture.EventState.start, e, gestureState);
        }
        break;

      case GestureType.pinch:
        switch (this._gestureType) {
          case GestureType.pinch:
            this._handlePinchEvent(EventCapture.EventState.changing, e, gestureState);
            break;

          case GestureType.pan:
            this._handlePanEvent(EventCapture.EventState.end, e, gestureState);
            this._recordOriginalSpan(e, gestureState);
            this._handlePinchEvent(EventCapture.EventState.start, e, gestureState);
            this._gestureType = GestureType.pinch;
            break;

          case GestureType.longPress:
            this._handleLongPressEvent(EventCapture.EventState.end, e, gestureState);
            this._recordOriginalSpan(e, gestureState);
            this._handlePinchEvent(EventCapture.EventState.start, e, gestureState);
            this._gestureType = GestureType.pinch;
            break;

          case GestureType.idle:
          case GestureType.judgingLongPress:
            this._removeLongPressTimer();
            this._recordOriginalSpan(e, gestureState);
            this._handlePinchEvent(EventCapture.EventState.start, e, gestureState);
            this._gestureType = GestureType.pinch;
            break;

          default: break;
        } break;

      case GestureType.judgingDoublePress:
        this._gestureType = GestureType.judgingDoublePress;
        this._recordFirstTouch(e, gestureState);
        this._setDoublePressTimer(e, gestureState);
        break;

      case GestureType.judgingLongPress:
        this._gestureType = GestureType.judgingLongPress;
        this._setLongPressTimer(e, gestureState);
        break;

      default: break;
    }
  }


  /**
   * 事件处理
   *
   * @memberof EventCapture
   */

  _handlePressEvent = (eventState, e, gestureState) => {
    this.props.onPress && this.props.onPress(eventState, e, gestureState);
  }

  _handleLongPressEvent = (eventState, e, gestureState) => {
    this.props.onLongPress && this.props.onLongPress(eventState, e, gestureState);
  }

  _handleDoublePressEvent = (eventState, e, gestureState) => {
    this.props.onDoublePress && this.props.onDoublePress(eventState, e, gestureState);
  }

  _handlePanEvent = (eventState, e, gestureState) => {
    this.props.onPan && this.props.onPan(eventState, e, gestureState);
  }

  _handlePinchEvent = (eventState, e) => {
    const { touches } = e.nativeEvent;
    if (touches && touches.length === 2) {
      const x = Math.pow(touches[0].locationX - touches[1].locationX, 2);
      const y = Math.pow(touches[0].locationY - touches[1].locationY, 2);
      const currentSpan = Math.sqrt(x + y);
      const totalScale = currentSpan / this._orignalSpan;
      const activeScale = currentSpan / this._activeSpan;
      this.props.onPinch && this.props.onPinch(eventState, e, totalScale, activeScale, this._recordActiveSpan);
    }
  }


  /**
   * 计时器管理
   *
   * @memberof EventCapture
   */

  /**
   * 长按手势计时器
   */
  _setLongPressTimer = (e, gestureState) => {
    this._removeLongPressTimer();
    const evt = { nativeEvent: e.nativeEvent };
    const tempGestureState = Object.assign({}, gestureState);
    this._longPressTimer = setTimeout(() => {
      if (this._gestureType === GestureType.judgingLongPress) {
        this._setGestureType(GestureType.longPress, evt, tempGestureState);
      }
    }, this.props.longPressTimeoutInterval);
  }

  _removeLongPressTimer = () => {
    clearTimeout(this._longPressTimer);
    this._longPressTimer = null;
  }

  /**
   * 双击计时器
   */
  _setDoublePressTimer = (e, gestureState) => {
    this._removeDoublePressTimer();
    const evt = { nativeEvent: e.nativeEvent };
    const tempGestureState = Object.assign({}, gestureState);
    const eventCaptures = Object.assign([], this.props.eventCaptures);
    this._doublePressTimer = setTimeout(() => {
      if (this._gestureType === GestureType.judgingDoublePress) {
        if (eventCaptures.includes('press')) {
          this._setGestureType(GestureType.press, evt, tempGestureState);
        } else {
          this._setGestureType(GestureType.idle, evt, tempGestureState);
        }
      }
    }, this.props.doublePressTimeoutInterval);
  }

  _removeDoublePressTimer = () => {
    clearTimeout(this._doublePressTimer);
    this._doublePressTimer = null;
  }


  /**
   * 工具方法
   *
   * @memberof EventCapture
   */

  /**
   * 记录双击的第一个落点
   */
  _recordFirstTouch = (e) => {
    const touches = e.nativeEvent.changedTouches;
    if (touches && touches.length) {
      const [touch] = touches;
      this._firstTouch = touch;
    }
  }

  /**
   * 判断双击第二个落点是否有效
   */
  _isSecondTouchAvailable = (e) => {
    if (e && e.nativeEvent) {
      if (e.nativeEvent.touches && e.nativeEvent.touches.length) {
        const firstTouch = this._firstTouch;
        const touch = e.nativeEvent.touches[0];
        const disX = Math.abs(touch.pageX - firstTouch.pageX);
        const disY = Math.abs(touch.pageY - firstTouch.pageY);
        if (disX < doublePressAvailableThreshold &&
          disY < doublePressAvailableThreshold) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 记录原始指距
   */
  _recordOriginalSpan = (e, gestureState) => {
    const { touches } = e.nativeEvent;
    if (touches && touches.length === 2 && gestureState.numberActiveTouches === 2) {
      const x = Math.pow(touches[1].locationX - touches[0].locationX, 2);
      const y = Math.pow(touches[1].locationY - touches[0].locationY, 2);
      this._orignalSpan = Math.sqrt(x + y);
      this._recordActiveSpan(e);
    }
  }

  /**
   * 记录临时指距
   */
  _recordActiveSpan = (e) => {
    const { touches } = e.nativeEvent;
    if (touches && touches.length === 2) {
      const x = Math.pow(touches[1].locationX - touches[0].locationX, 2);
      const y = Math.pow(touches[1].locationY - touches[0].locationY, 2);
      this._activeSpan = Math.sqrt(x + y);
    }
  }

  /**
   * 渲染区
   *
   * @returns
   * @memberof EventCapture
   */
  render() {
    return (
      <View
        style={this.props.style}
        onLayout={this.props.onLayout}
        {...this._panResponder.panHandlers}
      >
        {this.props.children}
      </View >
    );
  }
}

