'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

var _d3Time = require('d3-time');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _helper = require('../../common/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * BaseAxis: 负责Axis的具体绘制工作
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author 徐达迟
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * TODO:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 1.分离axisLine,gridLine,tickLine,tickLabel的绘制
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var BaseAxis = function (_Component) {
  _inherits(BaseAxis, _Component);

  function BaseAxis(props) {
    _classCallCheck(this, BaseAxis);

    var _this = _possibleConstructorReturn(this, (BaseAxis.__proto__ || Object.getPrototypeOf(BaseAxis)).call(this, props));

    _initialiseProps.call(_this);

    _this.cache = {
      axisLinePos: []
    };
    return _this;
  }

  _createClass(BaseAxis, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.drawAxis(this.props, this.context);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextContext) {
      this.drawAxis(nextProps, nextContext);
    }

    // 绘制坐标轴Wrapper


    // 绘制轴线


    // 绘制GridLine


    // 绘制刻度线


    // 绘制刻度Label


    // 绘制单个刻度Wrapper


    // 绘制固定ticks(设定tickValues时)


    // 绘制所有刻度Wrapper


    // 计算tick刻度以及label坐标

  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return BaseAxis;
}(_react.Component);

BaseAxis.defaultProps = {
  tickNums: 5,
  tickLineLength: 5,
  XAxisTickLabelOffset: [15, 10],
  YAxisTickLabelOffset: {
    left: [35, 5],
    right: [10, 5]
  }
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.drawAxis = function (props, chartContext) {
    var min = props.min,
        max = props.max,
        tickNums = props.tickNums,
        tickValues = props.tickValues;
    var yScale = chartContext.yScale;

    if (min && max && yScale) {
      yScale.domain([min, max]);
    }
    _this2.drawAxisLine(props, chartContext);
    if (tickValues) {
      _this2.drawFixedAxisTicks(props, chartContext);
    } else {
      _this2.drawAxisTicks(props, chartContext);
    }
  };

  this.drawAxisLine = function (props, chartContext) {
    var axisAt = props.axisAt,
        type = props.type;
    var context = chartContext.context,
        containerFrame = chartContext.containerFrame,
        chartFrame = chartContext.chartFrame;

    if (!context) return;
    context.save();
    var xBeg = void 0,
        xEnd = void 0,
        yBeg = void 0,
        yEnd = void 0;
    var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
    if (type === 'XAxis') {
      context.beginPath();
      xBeg = offsets[0];
      xEnd = containerFrame.width - containerFrame.padding.right;
      if (axisAt === 'bottom') {
        yBeg = offsets[1] + chartFrame.height;
      } else if (axisAt === 'top') {
        yBeg = offsets[1];
      }
      yEnd = yBeg;
    } else if (type === 'YAxis') {
      context.beginPath();
      yBeg = offsets[1];
      yEnd = offsets[1] + chartFrame.height;
      if (axisAt === 'left') {
        xBeg = offsets[0];
      } else if (axisAt === 'right') {
        xBeg = offsets[0] + containerFrame.chartWidth;
      }
      xEnd = xBeg;
    }
    context.moveTo(xBeg, yBeg);
    context.lineTo(xEnd, yEnd);
    context.stroke();
    context.restore();
    _this2.cache.axisLinePos = [xBeg, yBeg, xEnd, yEnd];
  };

  this.drawGridLines = function () {};

  this.drawTickLines = function () {};

  this.drawTickLabels = function () {};

  this.drawEachTick = function (tick, props, chartContext, showGridLine) {
    if (!tick) return;
    var type = props.type;
    var context = chartContext.context,
        containerFrame = chartContext.containerFrame,
        chartFrame = chartContext.chartFrame;

    var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
    context.save();
    context.beginPath();
    context.moveTo(tick.x1, tick.y1);
    context.lineTo(tick.x2, tick.y2);
    context.closePath();
    context.fillText(tick.text, tick.textX, tick.textY);
    context.stroke();
    if (showGridLine) {
      context.strokeStyle = '#DDD';
      context.beginPath();
      if (type === 'XAxis') {
        context.moveTo(tick.x1, tick.y1);
        context.lineTo(tick.x1, tick.y1 - chartFrame.height);
      } else {
        context.moveTo(tick.x1 + (props.axisAt === 'left' ? containerFrame.chartWidth : -containerFrame.chartWidth), tick.y1);
        context.lineTo(tick.x1, tick.y1);
      }
      context.stroke();
      context.closePath();
    }
    context.restore();
  };

  this.drawFixedAxisTicks = function (props, chartContext) {
    var axisAt = props.axisAt,
        originTickValues = props.tickValues,
        scale = props.scale,
        type = props.type,
        showGridLine = props.showGridLine,
        XAxisTickLabelOffset = props.XAxisTickLabelOffset,
        tickPos = props.tickPos;
    var containerFrame = chartContext.containerFrame,
        chartFrame = chartContext.chartFrame,
        context = chartContext.context;

    if (!context || !originTickValues) return;
    var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
    if (type === 'XAxis') {
      // 按照X周长度均分ticks
      var ticksPos = [];
      var tickValues = void 0;
      var tickObj = {};
      var width = containerFrame.width,
          padding = containerFrame.padding;
      var origin = chartFrame.origin,
          currChartHeight = chartFrame.height;

      tickValues = Array.from(originTickValues);
      if (tickPos === 'center') {
        tickValues.push('');
      }
      var centerPosOffset = tickPos === 'center' ? (width - padding.left - padding.right) / (2 * (tickValues.length - 1)) : 0;
      for (var i = 0; i < tickValues.length; i++) {
        var tickX = padding.left + i * ((width - padding.left - padding.right) / (tickValues.length - 1));
        var tickYBase = origin[1] + currChartHeight + offsets[1];
        tickObj = {
          x1: tickX,
          y1: tickYBase,
          x2: tickX,
          y2: tickYBase + 10,
          textX: tickX - 12 + centerPosOffset,
          textY: tickYBase + 10 + XAxisTickLabelOffset[1],
          text: tickValues[i]
        };
        ticksPos.push(Object.assign({}, tickObj));
      }
      ticksPos.map(function (tp) {
        _this2.drawEachTick(tp, props, chartContext, showGridLine);
      });
    }
  };

  this.drawAxisTicks = function (props, chartContext) {
    if (!props.showTicks) return;
    var showGridLine = props.showGridLine,
        min = props.min,
        max = props.max,
        tickNums = props.tickNums,
        tickValues = props.tickValues;
    var scale = _this2.props.scale;

    if (scale && typeof scale === 'function') {
      var _ticks = void 0;
      // 设置了最小值和最大值
      if (min && max && tickNums) {
        _ticks = (0, _d3Array.range)(min, max + 1, (max - min) / (tickNums - 1));
      } else {
        _ticks = scale.ticks(tickNums);
      }
      var ticksPos = _ticks.map(function (tick) {
        return _this2.calcTickPos(tick, props, chartContext);
      });
      ticksPos.map(function (tp) {
        _this2.drawEachTick(tp, props, chartContext, showGridLine);
      });
    }
  };

  this.calcTickPos = function (tick, props, chartContext) {
    var tickObject = {};
    var scale = props.scale,
        axisAt = props.axisAt,
        tickLineLength = props.tickLineLength,
        XAxisTickLabelOffset = props.XAxisTickLabelOffset,
        YAxisTickLabelOffset = props.YAxisTickLabelOffset,
        tickFormat = props.tickFormat,
        preClosedPrice = props.preClosedPrice;
    var context = chartContext.context,
        containerFrame = chartContext.containerFrame,
        chartFrame = chartContext.chartFrame,
        plotData = chartContext.plotData,
        xScale = chartContext.xScale;
    var axisLinePos = _this2.cache.axisLinePos;

    if (props.type === 'XAxis' && scale) {
      var tickX = scale(tick);
      var currentItemIdx = (0, _helper.getCurrentItem)(xScale, null, [tickX], plotData.currentData, 'index');
      var currentItem = plotData.currentData[currentItemIdx];
      if (!currentItem) return null;
      tickObject.x1 = tickX + axisLinePos[0];
      tickObject.y1 = axisLinePos[1];
      tickObject.x2 = tickObject.x1;
      tickObject.y2 = tickObject.y1 + tickLineLength;
      tickObject.text = String((0, _moment2.default)(currentItem[0]).format('YYYY/MM/DD'));
      var textMetrics = context.measureText(tickObject.text);
      tickObject.textX = tickObject.x1 - textMetrics.width / 2;
      tickObject.textY = tickObject.y2 + XAxisTickLabelOffset[1];
    } else if (props.type === 'YAxis' && scale) {
      var tickY = scale(tick);
      tickObject.x1 = axisLinePos[0];
      tickObject.y1 = axisLinePos[1] + tickY;
      tickObject.x2 = tickObject.x1 - (axisAt === 'left' ? tickLineLength : -tickLineLength);
      tickObject.y2 = tickObject.y1;
      tickObject.textX = tickObject.x2 - (axisAt === 'left' ? YAxisTickLabelOffset.left[0] : -YAxisTickLabelOffset.right[0]);
      tickObject.textY = tickObject.y2 + YAxisTickLabelOffset.left[1];
      var showPercent = void 0;
      if (tickFormat) showPercent = tickFormat.showPercent;
      if (showPercent && !isNaN(preClosedPrice) && +preClosedPrice !== 0) {
        tickObject.text = (100 * (tick - preClosedPrice) / preClosedPrice).toFixed(2) + '%';
      } else {
        tickObject.text = tick.toFixed(2);
      }
    }
    return tickObject;
  };
};

BaseAxis.propTypes = {};

BaseAxis.contextTypes = {
  context: _propTypes2.default.object,
  plotData: _propTypes2.default.object,
  containerFrame: _propTypes2.default.object,
  chartFrame: _propTypes2.default.object,
  events: _propTypes2.default.object,
  xScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func
};

exports.default = BaseAxis;