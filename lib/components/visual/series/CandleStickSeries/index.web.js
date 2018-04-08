'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helper = require('../../common/helper');

var _util = require('../../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * K线图组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CandleStickSeries = function (_Component) {
	_inherits(CandleStickSeries, _Component);

	function CandleStickSeries(props) {
		_classCallCheck(this, CandleStickSeries);

		var _this = _possibleConstructorReturn(this, (CandleStickSeries.__proto__ || Object.getPrototypeOf(CandleStickSeries)).call(this, props));

		_initialiseProps.call(_this);

		_this.state = {};
		return _this;
	}

	_createClass(CandleStickSeries, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextContext) {
			this.draw(nextProps, nextContext);
			this.addMouseEvent(nextContext);
		}
		// 添加鼠标移动时事件监听

		// 鼠标事件回调

		// 判断是否在矩形区域内

	}, {
		key: 'draw',

		//绘制K线
		value: function draw(nextProps, nextContext) {
			var context = nextContext.context,
			    plotData = nextContext.plotData,
			    containerFrame = nextContext.containerFrame,
			    chartFrame = nextContext.chartFrame,
			    xScale = nextContext.xScale,
			    yScale = nextContext.yScale,
			    canvas = nextContext.canvas;

			if (!plotData.dateTime) return;

			//计算数据
			var data = [];
			data = plotData.dateTime.map(function (dt, idx) {
				return [dt].concat(nextProps.yAccessor(plotData.fullData[idx]));
			});
			data = data.slice(plotData.indexs[0], plotData.indexs[1]);
			plotData.macdRegion = [];
			//绘制K线
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				var candleStickObj = this.calcCandleStick(d, nextProps, nextContext, i, data.length - 1);
				plotData.macdRegion[i] = this.drawEachCandle(candleStickObj, nextProps, nextContext);
			}
		}

		//计算每条K线的绘制属性


		//绘制单条K线

	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return CandleStickSeries;
}(_react.Component);

CandleStickSeries.defaultProps = {
	yAccessor: function yAccessor(d) {
		return [d[1], d[2], d[3], d[4]];
	},
	barWidth: 8,
	lineWidth: 1,
	strokeStyle: '#3E3E3E',
	fill: function fill(d) {
		return d[1] > d[2] ? "#6BA583" : "#D75442";
	},
	onClick: function onClick() {}
};
CandleStickSeries.propTypes = {
	yAccessor: _propTypes2.default.func,
	barWidth: _propTypes2.default.number,
	lineWidth: _propTypes2.default.number,
	strokeStyle: _propTypes2.default.string,
	fill: _propTypes2.default.func,
	onClick: _propTypes2.default.func
};

var _initialiseProps = function _initialiseProps() {
	var _this2 = this;

	this.cache = {
		isMouseEvent: false
	};

	this.addMouseEvent = function (nextContext, eventHandler) {
		var events = nextContext.events,
		    canvas = nextContext.canvas,
		    plotData = nextContext.plotData;
		var mouseDrag = events.mouseDrag,
		    mouseWheel = events.mouseWheel,
		    mouseDown = events.mouseDown;
		// 拖动和滚轮时清空事件监听

		if ((mouseDrag.trigger || mouseWheel.trigger) && _this2.cache.isMouseEvent) {
			canvas.removeEventListener('mousemove', _this2.mouseHandler.bind(_this2, nextContext, ''));
			canvas.removeEventListener('mousedown', _this2.mouseHandler.bind(_this2, nextContext, 'down'));
			_this2.cache.isMouseEvent = false;
		}
		// 第一次鼠标移动时添加事件监听
		if (_this2.cache.isMouseEvent || mouseDrag.trigger || mouseWheel.trigger) return;
		if (plotData.macdRegion) {
			canvas.addEventListener('mousemove', _this2.mouseHandler.bind(_this2, nextContext, ''));
			canvas.addEventListener('mousedown', _this2.mouseHandler.bind(_this2, nextContext, 'down'));
			_this2.cache.isMouseEvent = true;
		}
	};

	this.mouseHandler = function (nextContext) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		var e = arguments[2];
		var onClick = _this2.props.onClick;
		var canvas = nextContext.canvas,
		    plotData = nextContext.plotData,
		    containerFrame = nextContext.containerFrame,
		    xScale = nextContext.xScale,
		    events = nextContext.events;

		var _getMousePosition = (0, _util.getMousePosition)(e, canvas, containerFrame),
		    _getMousePosition2 = _slicedToArray(_getMousePosition, 2),
		    mouseX = _getMousePosition2[0],
		    mouseY = _getMousePosition2[1];

		var item = (0, _util.getCurrentItem)(xScale, null, [mouseX, mouseY], plotData.currentData, 'index');
		mouseX += containerFrame.padding.left;
		mouseY += containerFrame.padding.top;
		var isInRect = _this2.isInRect([mouseX, mouseY], plotData.macdRegion[item]);
		canvas.style.cursor = isInRect ? 'pointer' : 'default';
		// onClick props回调
		if (type === 'down' && isInRect) {
			onClick && plotData.currentData[item] && onClick(plotData.currentData[item][0]);
		}
	};

	this.isInRect = function (mouse, rect) {
		if (!rect) return false;

		var _mouse = _slicedToArray(mouse, 2),
		    x = _mouse[0],
		    y = _mouse[1],
		    _rect = _slicedToArray(rect, 4),
		    x1 = _rect[0],
		    y1 = _rect[1],
		    width = _rect[2],
		    height = _rect[3];

		if (x >= x1 && y >= y1 && x <= x1 + width && y <= y1 + height) {
			return true;
		}
		return false;
	};

	this.calcCandleStick = function (candle, props, chartContext, idx, lastIdx) {
		var fill = _this2.props.fill;
		var xScale = chartContext.xScale,
		    yScale = chartContext.yScale;

		var xPos = xScale(idx),
		    openPos = yScale(candle[1]),
		    closePos = yScale(candle[2]),
		    highPos = yScale(candle[3]),
		    lowPos = yScale(candle[4]),
		    fillStyle = fill(candle),
		    isFirst = +idx === 0,
		    isLast = +idx === +lastIdx;

		return {
			xPos: xPos,
			openPos: openPos,
			closePos: closePos,
			highPos: highPos,
			lowPos: lowPos,
			fillStyle: fillStyle,
			isFirst: isFirst,
			isLast: isLast
		};
	};

	this.drawEachCandle = function (candle, props, chartContext) {
		var barWidth = props.barWidth,
		    spacing = props.spacing,
		    strokeStyle = props.strokeStyle;
		var context = chartContext.context,
		    containerFrame = chartContext.containerFrame,
		    chartFrame = chartContext.chartFrame;

		if (!context) return;
		barWidth = (0, _helper.calcBarWidth)(props, chartContext) || barWidth;
		var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
		var candleRegion = [];
		candle.xPos = candle.xPos + offsets[0];
		candle.openPos = candle.openPos + offsets[1];
		candle.closePos = candle.closePos + offsets[1];
		candle.highPos = candle.highPos + offsets[1];
		candle.lowPos = candle.lowPos + offsets[1];

		context.save();
		//绘制方块, 本身值越高则pos值越低, 因为在计算yScale的时候的range是[heihgt,0]
		context.beginPath();
		context.fillStyle = candle.fillStyle;
		if (candle.isFirst) {
			candleRegion = [candle.xPos, Math.min(candle.openPos, candle.closePos), barWidth / 2, Math.abs(candle.closePos - candle.openPos)];
		} else if (candle.isLast) {
			candleRegion = [candle.xPos - barWidth / 2, Math.min(candle.openPos, candle.closePos), barWidth / 2, Math.abs(candle.closePos - candle.openPos)];
		} else {
			candleRegion = [candle.xPos - barWidth / 2, Math.min(candle.openPos, candle.closePos), barWidth, Math.abs(candle.closePos - candle.openPos)];
		}
		context.rect.apply(context, _toConsumableArray(candleRegion));
		context.fill();
		context.closePath();

		//绘制上下蜡烛芯
		context.beginPath();
		context.strokeStyle = strokeStyle;
		context.lineWidth = _this2.props.lineWidth;
		context.moveTo(candle.xPos, Math.min(candle.openPos, candle.closePos));
		context.lineTo(candle.xPos, candle.highPos);
		context.stroke();
		context.moveTo(candle.xPos, Math.max(candle.openPos, candle.closePos));
		context.lineTo(candle.xPos, candle.lowPos);
		context.stroke();
		context.closePath();
		context.restore();
		return candleRegion;
	};
};

CandleStickSeries.contextTypes = {
	context: _propTypes2.default.object,
	plotData: _propTypes2.default.object,
	plotConfig: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	chartFrame: _propTypes2.default.object,
	events: _propTypes2.default.object,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func,
	canvas: _propTypes2.default.object
};

exports.default = CandleStickSeries;