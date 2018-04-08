'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _helper = require('../../common/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * CrossHairCursor组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author 徐达迟
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 十字线以及浮动数值组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * TODO:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 1.抽离HLineLabel,vLineLabel
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CrossHair = function (_Component) {
	_inherits(CrossHair, _Component);

	function CrossHair(props) {
		_classCallCheck(this, CrossHair);

		var _this = _possibleConstructorReturn(this, (CrossHair.__proto__ || Object.getPrototypeOf(CrossHair)).call(this, props));

		_initialiseProps.call(_this);

		return _this;
	}

	_createClass(CrossHair, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextContext) {
			this.draw(nextProps, nextContext);
		}

		//绘制十字线


		//计算十字线坐标


		//绘制十字线横线左侧Label


		//绘制十字线横线右侧Label

	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return CrossHair;
}(_react.Component);

CrossHair.defaultProps = {
	lineDash: [10, 5],
	showHLineLtLabel: false,
	showHLineRtLabel: false,
	showVLineLable: false,
	preClosedPrice: null,
	hLineLtLabel: {
		width: 45,
		height: 20,
		padding: [5, 2]
	},
	hLineRtLabel: {
		width: 45,
		height: 20,
		padding: [5, 2]
	},
	hLineRtLabelInPct: false,
	vLineLabel: {
		width: 40,
		height: 15,
		padding: [5, 10]
	},
	vLineLabelFormat: 'MM/DD'
};

var _initialiseProps = function _initialiseProps() {
	var _this2 = this;

	this.draw = function (props, chartContext) {
		var lineDash = props.lineDash,
		    stroke = props.stroke,
		    showHLineLtLabel = props.showHLineLtLabel,
		    showHLineRtLabel = props.showHLineRtLabel,
		    showVLineLabel = props.showVLineLabel;
		var context = chartContext.context,
		    events = chartContext.events,
		    xScale = chartContext.xScale;

		if (!context || !xScale || !events.mouseMove.trigger || !events.mouseEnter.trigger) return;
		var ch = _this2.calcCrossHairCursor(chartContext);

		context.save();
		//设置dash
		if (stroke) context.strokeStyle = stroke;
		context.setLineDash(lineDash);
		//绘制横线
		context.beginPath();
		context.moveTo(ch.hLine.begX, ch.hLine.begY);
		context.lineTo(ch.hLine.endX, ch.hLine.endY);
		context.stroke();
		context.closePath();
		//绘制竖线
		context.beginPath();
		context.moveTo(ch.vLine.begX, ch.vLine.begY);
		context.lineTo(ch.vLine.endX, ch.vLine.endY);
		context.stroke();
		context.closePath();
		context.restore();

		//绘制横线左侧label
		if (showHLineLtLabel) _this2.drawHLineLtLabel(ch, chartContext);
		//绘制横线右侧label
		if (showHLineRtLabel) _this2.drawHLineRtLabel(ch, chartContext);
		//绘制纵线Label
		if (showVLineLabel) _this2.drawVLineLabel(ch, chartContext);
		context.fillStyle = '#000';
	};

	this.calcCrossHairCursor = function (chartContext) {
		var events = chartContext.events,
		    containerFrame = chartContext.containerFrame,
		    chartFrame = chartContext.chartFrame,
		    xScale = chartContext.xScale,
		    plotData = chartContext.plotData;
		var mouseMove = events.mouseMove;
		var padding = containerFrame.padding;

		var crossHairObj = {};
		var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
		var currentItemIdx = (0, _helper.getCurrentItem)(xScale, null, [mouseMove.mouseX - offsets[0]], plotData.currentData, 'index');
		var currentItemX = xScale(currentItemIdx) + offsets[0];
		if (!chartFrame) {
			//直接置于ChartContainer下的十字线
			var hLineYPos = mouseMove.mouseY;
			var vLineXPos = currentItemX;
			if (mouseMove.mouseY > containerFrame.height - padding.bottom) {
				hLineYPos = containerFrame.height - padding.bottom;
			} else if (mouseMove.mouseY < padding.top) {
				hLineYPos = padding.top;
			}
			if (currentItemX > containerFrame.width - padding.right) {
				vLineXPos = containerFrame.width - padding.right;
			} else if (currentItemX < padding.left) {
				vLineXPos = padding.left;
			}
			crossHairObj = {
				hLine: {
					begX: padding.left,
					begY: hLineYPos,
					endX: containerFrame.width - padding.right,
					endY: hLineYPos
				},
				vLine: {
					begX: vLineXPos,
					begY: padding.top,
					endX: vLineXPos,
					endY: containerFrame.height - padding.bottom
				}
			};
		} else {
			//置于Chart下的十字线
			var origin = chartFrame.origin,
			    chartHeight = chartFrame.height;

			var _hLineYPos = mouseMove.mouseY;
			var _vLineXPos = currentItemX;
			if (mouseMove.mouseY > padding.top + origin[0] + chartHeight) {
				_hLineYPos = padding.top + origin[0] + chartHeight;
			} else if (mouseMove.mouseY < padding.top + origin[0]) {
				_hLineYPos = padding.top + origin[0];
			}
			if (currentItemX > containerFrame.width - padding.right) {
				_vLineXPos = containerFrame.width - padding.right;
			} else if (currentItemX < padding.left) {
				_vLineXPos = padding.left;
			}
			crossHairObj = {
				hLine: {
					begX: padding.left,
					begY: _hLineYPos,
					endX: containerFrame.width - padding.right,
					endY: _hLineYPos
				},
				vLine: {
					begX: _vLineXPos,
					begY: padding.top + origin[0],
					endX: _vLineXPos,
					endY: padding.top + origin[0] + chartHeight
				}
			};
		}
		return crossHairObj;
	};

	this.drawHLineLtLabel = function (ch, chartContext) {
		var labelProps = _this2.props.hLineLtLabel;
		var context = chartContext.context,
		    yScale = chartContext.yScale,
		    containerFrame = chartContext.containerFrame,
		    chartFrame = chartContext.chartFrame;

		if (!yScale) return;
		var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
		context.save();
		context.fillStyle = '#000';
		context.fillRect(ch.hLine.begX - labelProps.width, ch.hLine.begY - labelProps.height / 2, labelProps.width, labelProps.height);
		context.fillStyle = '#FFF';
		context.fillText(yScale.invert(ch.hLine.begY - offsets[1]).toFixed(2), ch.hLine.begX - labelProps.width + labelProps.padding[0], ch.hLine.begY + labelProps.padding[1]);
		context.restore();
	};

	this.drawHLineRtLabel = function (ch, chartContext) {
		var _props = _this2.props,
		    labelProps = _props.hLineRtLabel,
		    preClosedPrice = _props.preClosedPrice,
		    hLineRtLabelInPct = _props.hLineRtLabelInPct;
		var context = chartContext.context,
		    yScale = chartContext.yScale,
		    containerFrame = chartContext.containerFrame,
		    chartFrame = chartContext.chartFrame;

		if (!yScale) return;
		var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
		context.save();
		context.fillStyle = '#000';
		context.fillRect(ch.hLine.endX, ch.hLine.endY - labelProps.height / 2, labelProps.width, labelProps.height);
		context.fillStyle = '#FFF';
		var labelText = '';
		if (hLineRtLabelInPct && !isNaN(preClosedPrice)) {
			var currValue = yScale.invert(ch.hLine.endY - offsets[1]);
			preClosedPrice = +preClosedPrice;
			labelText = (100 * (currValue - preClosedPrice) / preClosedPrice).toFixed(2) + "%";
		} else {
			labelText = yScale.invert(ch.hLine.endY - offsets[1]).toFixed(2);
		}
		context.fillText(labelText, ch.hLine.endX + labelProps.padding[0], ch.hLine.endY + labelProps.padding[1]);
		context.restore();
	};

	this.drawVLineLabel = function (ch, chartContext) {
		var _props2 = _this2.props,
		    labelProps = _props2.vLineLabel,
		    format = _props2.vLineLabelFormat;
		var context = chartContext.context,
		    xScale = chartContext.xScale,
		    containerFrame = chartContext.containerFrame,
		    chartFrame = chartContext.chartFrame,
		    plotData = chartContext.plotData;

		if (!xScale) return;
		var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
		context.save();
		context.fillStyle = '#000';
		context.fillRect(ch.vLine.begX - labelProps.width / 2, ch.vLine.endY, labelProps.width, labelProps.height);
		context.fillStyle = '#FFF';
		var data = plotData.fullData;
		var item = (0, _helper.getCurrentItem)(xScale, null, [ch.vLine.begX - offsets[0]], data, 'index');
		var labelText = (0, _moment2.default)(plotData.currentData[item][0]).format(format);
		context.fillText(labelText, ch.vLine.begX - labelProps.width / 2 + labelProps.padding[0], ch.vLine.endY + labelProps.padding[1]);
		context.restore();
	};
};

exports.default = CrossHair;


CrossHair.contextTypes = {
	context: _propTypes2.default.object,
	plotData: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	chartFrame: _propTypes2.default.object,
	events: _propTypes2.default.object,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func
};