'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

var _helper = require('../common/helper');

var _util = require('../../util');

var _scale = require('../../scale');

var _index = require('../EventCapture/index.web');

var _index2 = _interopRequireDefault(_index);

var _CalculateUtil = require('../CalculateUtil');

var _CalculateUtil2 = _interopRequireDefault(_CalculateUtil);

var _lang = require('lodash/lang');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ChartContainer组件 图表整体容器
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Props:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + frame 尺寸，布局
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + data 原始数据
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + xAccessor 获取X轴数据
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + extraData 自定义计算数据字典
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # State:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + containerFrame
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + plotData
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + plotConfig 图像尺寸设置
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + events
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + xScale
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Cache:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + canvas context
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Method:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * + updateContainer: chartContainer状态控制，[props更新]或者[事件捕捉]都可以触发是否重绘的判断
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var emptyEvent = {
	trigger: false,
	mouseX: null,
	mouseY: null
};

var ChartContainer = function (_Component) {
	_inherits(ChartContainer, _Component);

	function ChartContainer(props) {
		_classCallCheck(this, ChartContainer);

		var _this = _possibleConstructorReturn(this, (ChartContainer.__proto__ || Object.getPrototypeOf(ChartContainer)).call(this, props));

		_initialiseProps.call(_this);

		var frame = _this.props.frame;
		//初始化ChartContainer内部状态

		_this.state = {
			containerFrame: (0, _helper.getContainerFrame)(frame),
			events: {
				mouseEnter: emptyEvent,
				mouseDown: emptyEvent,
				mouseDrag: emptyEvent,
				mouseMove: emptyEvent,
				mouseLeave: emptyEvent,
				mouseWheel: emptyEvent
			},
			plotData: {
				indexs: [],
				currentData: []
			},
			plotConfig: {
				barWidth: 10, //K线宽度
				spacing: 5, //K线距离
				step: 15, //分时数据点距离
				zoomMultiplier: 1.05
			},
			xScale: null,
			currentZoom: 1,
			canvas: null
			//初始化cache
		};_this.cache = {};
		return _this;
	}

	_createClass(ChartContainer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var canvas = this.cache.canvas;
			if (canvas) {
				var context = canvas.getContext('2d');
				this.updateContainer(this.props);
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			//更新container状态
			this.updateContainer(nextProps);
		}

		// 设置事件状态，eventTypes支持传字符串和数组

	}, {
		key: 'getChildContext',


		//设置context
		value: function getChildContext() {
			var _state = this.state,
			    plotData = _state.plotData,
			    plotConfig = _state.plotConfig,
			    containerFrame = _state.containerFrame,
			    events = _state.events,
			    xScale = _state.xScale;
			var _cache = this.cache,
			    context = _cache.context,
			    canvas = _cache.canvas;

			return {
				context: context,
				plotData: plotData,
				plotConfig: plotConfig,
				containerFrame: containerFrame,
				events: events,
				xScale: xScale,
				canvas: canvas
			};
		}

		//更新ChartContainer, 更新props或者事件触发

	}, {
		key: 'shouldUpdateContainer',


		//通过对比新旧props判断是否更新
		value: function shouldUpdateContainer(prevProps, nextProps) {
			return !(0, _lang.isEqual)(prevProps, nextProps);
		}

		//清除画布


		//数据计算和选取


		//计算xScale

		//鼠标移动事件

		//鼠标拖动事件


		//鼠标滚动

	}, {
		key: 'render',
		value: function render() {
			var _props = this.props,
			    children = _props.children,
			    eventCaptures = _props.eventCaptures;
			var containerFrame = this.state.containerFrame;
			var width = containerFrame.width,
			    height = containerFrame.height;


			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement('canvas', {
					ref: this.getCanvasRef,
					width: width,
					height: height
				}),
				_react2.default.createElement(
					_index2.default,
					{
						eventCaptures: eventCaptures,
						canvas: this.cache.canvas,
						onmouseenter: this.handleMouseEnter,
						onmousemove: [this.handleMouseMove, this.handleMouseDrag],
						onmouseleave: this.handleMouseLeave,
						onmousewheel: this.handleMouseWheel,
						onmouseup: this.handleMouseUp,
						onmousedown: this.handleMouseDown
					},
					children
				)
			);
		}
	}]);

	return ChartContainer;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
	var _this2 = this;

	this.setEvent = function (eventTypes) {
		var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var mouseX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		var mouseY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
		var moreProps = arguments[4];

		var events = Object.assign({}, _this2.state.events),
		    eventArr = [];
		eventArr = typeof eventTypes === 'string' ? [eventTypes] : Array.isArray(eventTypes) ? eventTypes : [];
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = eventArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var item = _step.value;

				events[item] ? events[item] = _extends({ trigger: trigger, mouseX: mouseX, mouseY: mouseY }, moreProps) : null;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		_this2.setState({ events: events });
	};

	this.updateContainer = function (nextProps, moreProps, moreState) {
		_this2.clearCanvas();
		//更新数据
		var plotData = _this2.getPlotData(nextProps, moreProps);
		//更新xScale
		var xScale = _this2.getXScale(plotData, moreProps);
		if (moreState && moreState.xScale) xScale = moreState.xScale;
		_this2.setState(_extends({
			plotData: plotData,
			xScale: xScale
		}, moreState));
	};

	this.clearCanvas = function () {
		var context = _this2.cache.context;

		if (context) {
			context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
		}
	};

	this.getPlotData = function (nextProps, moreProps) {
		var xExtents = nextProps.xExtents,
		    data = nextProps.data,
		    indicators = nextProps.indicators,
		    newIndicators = nextProps.newIndicators;

		if (moreProps) xExtents = moreProps.xExtents;
		var plotData = {};
		if (data && data.length > 0) {
			//选取数据
			plotData.fullData = data;
			plotData.dateTime = data.map(function (d) {
				return d[0];
			});
			plotData.indexs = xExtents || [0, 100];
			plotData.currentData = Array.from(data).slice(plotData.indexs[0], plotData.indexs[1]);
			//计算indicators
			if (indicators) {
				if (!plotData.calcedData) plotData.calcedData = {};
				_CalculateUtil2.default.indicatorsHelper(indicators, plotData);
			}
		}
		return plotData;
	};

	this.getXScale = function (plotData, moreProps) {
		var _props2 = _this2.props,
		    xAccessor = _props2.xAccessor,
		    totalCount = _props2.totalCount;
		var containerFrame = _this2.state.containerFrame;
		var currentData = plotData.currentData;

		if (currentData && currentData.length > 0) {
			var xData = void 0;
			if (totalCount && !isNaN(+totalCount)) xData = [0, totalCount];else xData = [0, currentData.length - 1];
			var xScale = (0, _scale.calculateXScale)(xData, containerFrame, 'index');
			return xScale;
		} else {
			return null;
		}
	};

	this.isMouseBeyondLastItem = function () {};

	this.handleMouseMove = function (e) {
		var frame = _this2.props.frame;
		var _state2 = _this2.state,
		    xScale = _state2.xScale,
		    plotData = _state2.plotData;

		_this2.clearCanvas();
		var rect = _this2.cache.canvas.getBoundingClientRect();
		var mouseX = void 0,
		    mouseY = void 0,
		    realMouseX = void 0;
		if (plotData.indexs) {
			mouseX = e.clientX - rect.left;
			var lastItemX = xScale(plotData.currentData.length - 1) + frame.padding.left;
			realMouseX = mouseX;
			mouseX = Math.min(mouseX, lastItemX);
			mouseY = e.clientY - rect.top;
		}
		_this2.setEvent('mouseMove', true, mouseX, mouseY, { realMouseX: realMouseX });
		if (_this2.state.events.mouseWheel.trigger) {
			_this2.setEvent('mouseWheel');
		}
	};

	this.handleMouseEnter = function (e) {
		_this2.clearCanvas();
		_this2.setEvent('mouseEnter', true);
		_this2.setEvent('mouseLeave', false);
	};

	this.handleMouseLeave = function (e) {
		_this2.clearCanvas();
		_this2.setEvent(['mouseEnter', 'mouseDown']);
		_this2.setEvent('mouseLeave', true);
	};

	this.handleMouseDown = function (e) {
		_this2.clearCanvas();
		var _state3 = _this2.state,
		    containerFrame = _state3.containerFrame,
		    plotData = _state3.plotData,
		    xScale = _state3.xScale;
		var onClick = _this2.props.onClick;

		var _getMousePosition = (0, _util.getMousePosition)(e, _this2.cache.canvas, containerFrame),
		    _getMousePosition2 = _slicedToArray(_getMousePosition, 2),
		    mouseX = _getMousePosition2[0],
		    mouseY = _getMousePosition2[1];

		var item = void 0;
		_this2.setEvent('mouseDown', true);
		_this2.setEvent('mouseDrag', false, mouseX, mouseY);
		// onClick回调返回当前点击item的时间毫秒数
		onClick && (item = (0, _util.getCurrentItem)(xScale, null, [mouseX, mouseY], plotData.currentData, 'index')) && onClick(plotData.currentData[item][0]); // onClick回调返回当前点击item的时间毫秒数
	};

	this.handleMouseDrag = function (e) {
		var onLoadMore = _this2.props.onLoadMore;
		var events = _this2.state.events;
		var context = _this2.cache.context;


		if (events.mouseDown.trigger) {
			var _state4 = _this2.state,
			    containerFrame = _state4.containerFrame,
			    xScale = _state4.xScale,
			    plotData = _state4.plotData,
			    plotConfig = _state4.plotConfig;

			var newXScale = xScale.copy();

			var _getMousePosition3 = (0, _util.getMousePosition)(e, _this2.cache.canvas, containerFrame),
			    _getMousePosition4 = _slicedToArray(_getMousePosition3, 2),
			    mouseX = _getMousePosition4[0],
			    mouseY = _getMousePosition4[1];

			var mouseDistance = mouseX - events.mouseDrag.mouseX;
			var barWidth = (0, _helper.calcBarWidth)(1, _this2.state);
			if (Math.abs(mouseDistance) < barWidth) return;
			var shiftIndex = Math.ceil(mouseDistance / barWidth);
			var xExtents = void 0,
			    plotDataNum = plotData.indexs[1] - plotData.indexs[0];
			if (plotData.indexs[0] + shiftIndex < 0) {
				if (onLoadMore && typeof onLoadMore === 'function') {
					onLoadMore();
					xExtents = [0, plotDataNum];
				} else {
					xExtents = [0, plotDataNum];
				}
			} else if (plotData.indexs[1] + shiftIndex > plotData.fullData.length) {
				xExtents = [plotData.fullData.length - plotDataNum, plotData.fullData.length];
			} else {
				xExtents = plotData.indexs.map(function (data, idx) {
					return data + shiftIndex;
				});
			}
			_this2.setEvent('mouseDrag', true, mouseX, mouseY);
			_this2.updateContainer(_this2.props, { xExtents: xExtents }, { xScale: newXScale });
		}
	};

	this.handleMouseUp = function () {
		_this2.setEvent(['mouseDown', 'mouseDrag']);
	};

	this.handleMouseWheel = function (e) {
		e.preventDefault();
		var thresholds = _this2.props.thresholds;
		var _state5 = _this2.state,
		    containerFrame = _state5.containerFrame,
		    xScale = _state5.xScale,
		    plotData = _state5.plotData,
		    plotConfig = _state5.plotConfig,
		    currentZoom = _state5.currentZoom;

		var zoomDirection = e.deltaY > 0 ? 1 : -1;
		if (currentZoom < thresholds.minZoom && zoomDirection < 0 || currentZoom > thresholds.maxZoom && zoomDirection > 0) return;

		_this2.clearCanvas();
		var zoomMultiplier = plotConfig.zoomMultiplier;
		var indexs = plotData.indexs;

		var mouseXY = (0, _util.getMousePosition)(e, _this2.cache.canvas, containerFrame);

		//根据缩放程度计算新domain
		var item = void 0,
		    cx = void 0,
		    c = void 0,
		    newDomain = void 0;
		item = (0, _util.getCurrentItem)(xScale, null, mouseXY, plotData.currentData, 'index');
		cx = xScale(item);
		c = zoomDirection > 0 ? zoomMultiplier : 1 / zoomMultiplier;
		newDomain = xScale.range().map(function (x) {
			return cx + (x - cx) * c;
		}).map(xScale.invert);
		var newZoom = c * currentZoom;

		//计算新plotData和scale
		var shiftIndexs = zoomDirection > 0 ? [-1, 1] : [1, -1];
		var newIndexes = [Math.max(0, indexs[0] + shiftIndexs[0]), indexs[1] + shiftIndexs[1]];
		_this2.setEvent('mouseWheel', true);
		_this2.updateContainer(_this2.props, { xExtents: newIndexes }, { currentZoom: newZoom });
	};

	this.getCanvasRef = function (node) {
		if (node) {
			_this2.cache.canvas = node;
			_this2.cache.context = node.getContext('2d');
		} else {
			_this2.cache.canvas = null;
			_this2.cache.context = null;
		}
	};
};

ChartContainer.propTypes = {
	frame: _propTypes2.default.object,
	data: _propTypes2.default.array,
	xAccessor: _propTypes2.default.func
};
ChartContainer.childContextTypes = {
	context: _propTypes2.default.object,
	plotData: _propTypes2.default.object,
	plotConfig: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	xScale: _propTypes2.default.func,
	events: _propTypes2.default.object,
	canvas: _propTypes2.default.object
};
ChartContainer.defaultProps = {
	xAccessor: function xAccessor(d) {
		return d[0];
	},
	thresholds: {
		minZoom: 0.50,
		maxZoom: 2.0
	}
};

exports.default = ChartContainer;