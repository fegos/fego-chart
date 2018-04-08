'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _util = require('../../../util');

var _helper = require('../../common/helper');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * BaseTooltip
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var xSpace = 10,
    ySpace = 20,
    boxWidth = 0,
    xLeft = 0,
    xRight = 0;
var defaultTextColor = '#fff';
var defaultBackgroundColor = '#000';

var BaseTooltip = function (_Component) {
	_inherits(BaseTooltip, _Component);

	function BaseTooltip() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, BaseTooltip);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BaseTooltip.__proto__ || Object.getPrototypeOf(BaseTooltip)).call.apply(_ref, [this].concat(args))), _this), _this.cache = {
			isDraw: false
		}, _this.drawTip = function (props, nextContext) {
			var indicators = props.indicators,
			    type = props.type,
			    valueKeys = props.valueKeys,
			    visible = props.visible,
			    xPos = props.xPos,
			    yPos = props.yPos;
			var xScale = nextContext.xScale,
			    yScale = nextContext.yScale,
			    plotData = nextContext.plotData,
			    context = nextContext.context,
			    chartFrame = nextContext.chartFrame,
			    containerFrame = nextContext.containerFrame,
			    events = nextContext.events;

			if (!visible) return;
			var data = plotData.fullData;
			var mouseMove = events.mouseMove;

			if (context && xScale && data && data.length > 0) {
				// tooltip初始位置为左上角
				xLeft = chartFrame.origin[0] + containerFrame.padding.left + xPos;
				xRight = containerFrame.chartWidth + containerFrame.padding.right - (boxWidth + xPos);
				var x = xLeft,
				    y = chartFrame.origin[1] ? chartFrame.origin[1] + yPos : chartFrame.origin[1] + containerFrame.padding.top + yPos,
				    toolTipText = '',
				    item = void 0;
				// 鼠标移动
				if (mouseMove.trigger) {
					var rect = context.canvas.getBoundingClientRect();
					var e = {
						clientX: mouseMove.mouseX + rect.left,
						clientY: mouseMove.mouseY + rect.top
					};
					var mouseXY = (0, _util.getMousePosition)(e, context.canvas, containerFrame);
					item = (0, _util.getCurrentItem)(xScale, null, mouseXY, data, 'index');
				}
				context.save();
				if (indicators) {
					_this.drawCalcedData(context, indicators, plotData, valueKeys, toolTipText, item, type, x, y);
				} else {
					_this.isInsideChart(mouseMove, containerFrame, chartFrame) && _this.drawOriginData(context, props, plotData, item, events, containerFrame, x, y);
				}
				context.restore();
			}
		}, _this.isInsideChart = function (mouseMove, containerFrame, chartFrame) {
			var frame = {
				width: containerFrame.chartWidth,
				height: chartFrame.height,
				x: chartFrame.origin[0],
				y: chartFrame.origin[1]
			},
			    e = {
				clientX: mouseMove.realMouseX - containerFrame.padding.left,
				clientY: mouseMove.mouseY - containerFrame.padding.top
			};
			return (0, _helper.isDotInsideChart)([e.clientX, e.clientY], frame);
		}, _this.drawOriginData = function (context, props, plotData, item, events, containerFrame, x, y) {
			var formatter = props.formatter;
			var mouseMove = events.mouseMove;

			if (!formatter) return;
			var data = plotData.currentData[item];
			if (!data) return;
			if (mouseMove.mouseX > containerFrame.chartWidth / 2) {
				x = xRight;
			} else {
				x = xLeft;
			}
			var res = formatter.selector(data),
			    name = formatter.name,
			    rectY = y;
			for (var i = 0; i < name.length; i++) {
				var len = context.measureText(name[i] + ':' + res[i]).width;
				if (len + xSpace * 3 > boxWidth) {
					boxWidth = len + xSpace * 3;
				}
			}
			context.fillStyle = props.bgColor;
			context.globalAlpha = props.alpha;
			context.lineJoin = "round";
			context.clearRect(x, rectY, boxWidth, ySpace * (name.length + 1));
			context.fillRect(x, rectY, boxWidth, ySpace * (name.length + 1));
			context.font = props.font;
			context.globalAlpha = 1;
			for (var _i = 0; _i < name.length; _i++) {
				y += ySpace;
				if (typeof formatter.stroke === 'string') {
					context.fillStyle = formatter.stroke || defaultTextColor;
				} else if (Array.isArray(formatter.stroke)) {
					var textColor = formatter.stroke[_i];
					if (textColor instanceof Function) {
						context.fillStyle = formatter.stroke[_i](res[_i]);
					} else if (typeof textColor === 'string') {
						context.fillStyle = formatter.stroke[_i] || defaultTextColor;
					}
				} else {
					context.fillStyle = defaultTextColor;
				}
				context.fillText(name[_i] + '\uFF1A' + res[_i], x + xSpace, y);
			}
		}, _this.drawCalcedData = function (context, indicators, plotData, valueKeys, toolTipText, item, type, xPos, yPos) {
			var len = indicators.length,
			    eachKey = void 0,
			    text = '';
			for (var i = len - 1; i >= 0; i--) {
				eachKey = indicators[i];
				var data = plotData.calcedData[eachKey.dataKey][plotData.indexs[0] + item];
				// type = 'group' 表示MACD和KDJ、BOLL等复合指标线，type = '' 表示 MA、RSI等单条指标线
				if (type === 'group') {
					var dataKeyArr = Object.keys(eachKey.stroke),
					    len2 = dataKeyArr.length;
					for (var j = len2 - 1; j >= 0; j--) {
						var xCoord = xPos + context.measureText(toolTipText).width;
						if (!data || data === '-') {
							text = dataKeyArr[j] + '\uFF1A-  ';
						} else {
							text = dataKeyArr[j] + '\uFF1A' + (data[valueKeys[j]] ? data[valueKeys[j]].toFixed(2) : '-') + '  ';
						}
						context.fillStyle = eachKey.stroke[dataKeyArr[j]];
						context.fillText(text, xCoord, yPos);
						toolTipText += text;
					}
				} else if (type === '') {
					var _xCoord = xPos + context.measureText(toolTipText).width;
					var _text = eachKey.dataKey + '\uFF1A' + (data && data !== '-' ? data.toFixed(2) : '-') + '  ';
					context.fillStyle = eachKey.stroke;
					context.fillText(_text, _xCoord, yPos);
					toolTipText += _text;
				}
			}
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(BaseTooltip, [{
		key: 'compontDidMount',
		value: function compontDidMount() {
			this.drawTip(this.props, this.context);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextContext) {
			this.drawTip(nextProps, nextContext);
		}
		// 绘制图例

		// 检测鼠标是否在chart内

		// 绘制分时和K线图例数据

		// 绘制技术指标图例数据

	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return BaseTooltip;
}(_react.Component);

BaseTooltip.defaultProps = {
	visible: true,
	xPos: 10,
	yPos: 20,
	type: '', // type 可为 group 和 ''，type = 'group' 表示MACD和KDJ、BOLL等复合指标线，type = '' 表示 MA、RSI等单条指标线
	bgColor: defaultBackgroundColor,
	alpha: 0.4,
	font: "italic 25px"
};
BaseTooltip.propTypes = {
	visible: _propTypes2.default.bool,
	xPos: _propTypes2.default.number,
	yPos: _propTypes2.default.number,
	type: _propTypes2.default.string,
	indicators: _propTypes2.default.array,
	valueKeys: _propTypes2.default.array,
	bgColor: _propTypes2.default.string,
	alpha: _propTypes2.default.number,
	font: _propTypes2.default.string
};


BaseTooltip.contextTypes = {
	context: _propTypes2.default.object,
	plotData: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	chartFrame: _propTypes2.default.object,
	events: _propTypes2.default.object,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func
};

exports.default = BaseTooltip;