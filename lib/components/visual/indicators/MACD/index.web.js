'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helper = require('../../../common/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var valueKeys = {
	MACD: 'histogram',
	DIFF: 'MACD',
	DEA: 'signal'
};
var defaultColor = 'skyblue';

var MACD = function (_Component) {
	_inherits(MACD, _Component);

	function MACD(props) {
		_classCallCheck(this, MACD);

		var _this = _possibleConstructorReturn(this, (MACD.__proto__ || Object.getPrototypeOf(MACD)).call(this, props));

		_this.drawBackgroundLine = function (nextProps, nextContext) {
			var context = nextContext.context,
			    xScale = nextContext.xScale,
			    yScale = nextContext.yScale,
			    containerFrame = nextContext.containerFrame,
			    chartFrame = nextContext.chartFrame;

			var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
			var xPos = chartFrame.origin[0] + offsets[0],
			    yPos = yScale(0) + offsets[1];
			context.save();
			context.beginPath();
			context.strokeStyle = defaultColor;
			context.lineWidth = 1;
			context.moveTo(xPos, yPos);
			context.lineTo(containerFrame.chartWidth + containerFrame.padding.left, yPos);
			context.stroke();
			context.closePath();
			context.restore();
		};

		_this.drawHistogram = function (nextProps, nextContext) {
			var context = nextContext.context,
			    plotData = nextContext.plotData,
			    containerFrame = nextContext.containerFrame,
			    chartFrame = nextContext.chartFrame,
			    xScale = nextContext.xScale,
			    yScale = nextContext.yScale;

			var data = [],
			    originData = nextContext.plotData.calcedData.MACD;
			data = plotData.dateTime.map(function (dt, idx) {
				return [dt].concat(originData[idx].histogram);
			});
			data = data.slice(plotData.indexs[0], plotData.indexs[1]);
			//绘制K线
			for (var i = 0; i < data.length; i++) {
				_this.drawEachHistogram(data[i], nextProps, nextContext, i, data.length - 1);
			}
		};

		_this.drawEachHistogram = function (data, nextProps, nextContext, idx, lastIdx) {
			if (data[1] === undefined) return;
			var barWidth = nextProps.barWidth;
			var context = nextContext.context,
			    xScale = nextContext.xScale,
			    yScale = nextContext.yScale,
			    containerFrame = nextContext.containerFrame,
			    chartFrame = nextContext.chartFrame;

			barWidth = (0, _helper.calcBarWidth)(nextProps, nextContext) || barWidth;
			var xPos = xScale(idx),
			    yPos = yScale(data[1]),
			    offsets = (0, _helper.calcOffset)(containerFrame, chartFrame),
			    baseY = yScale(0),
			    yCoord = data[1] > 0 ? offsets[1] + yPos : offsets[1] + baseY,
			    height = Math.abs(yPos - baseY);
			context.save();
			context.beginPath();
			context.fillStyle = data[1] > 0 ? nextProps.stroke['Raise'] || defaultColor : nextProps.stroke['Fall'] || defaultColor;
			if (idx === 0) {
				context.rect(offsets[0] + xPos, yCoord, barWidth / 4, height);
			} else if (idx === lastIdx) {
				context.rect(offsets[0] + xPos - barWidth / 4, yCoord, barWidth / 4, height);
			} else {
				context.rect(offsets[0] + xPos - barWidth / 4, yCoord, barWidth / 2, height);
			}
			context.fill();
			context.closePath();
			context.restore();
		};

		_this.drawLine = function (nextProps, nextContext, dataKey) {
			var context = nextContext.context,
			    plotData = nextContext.plotData,
			    containerFrame = nextContext.containerFrame,
			    chartFrame = nextContext.chartFrame,
			    xScale = nextContext.xScale,
			    yScale = nextContext.yScale;

			var data = [],
			    originData = nextContext.plotData.calcedData.MACD;
			data = plotData.dateTime.map(function (dt, idx) {
				return [dt].concat(originData[idx][valueKeys[dataKey]]);
			});
			data = data.slice(plotData.indexs[0], plotData.indexs[1]);
			if (data.length > 0) {
				context.save();
				context.beginPath();
				context.strokeStyle = nextProps.stroke[dataKey] || 'skyblue';
				context.lineCap = "round";
				var begPoint = _this.calcPointPos(data[0], xScale, yScale, containerFrame, chartFrame, 0);
				context.moveTo(begPoint[0], begPoint[1]);
				for (var i = 1; i < data.length - 1; i++) {
					//使用平滑曲线绘制
					var point1 = _this.calcPointPos(data[i], xScale, yScale, containerFrame, chartFrame, i);
					var point2 = _this.calcPointPos(data[i + 1], xScale, yScale, containerFrame, chartFrame, i + 1);
					var midPointX = (point1[0] + point2[0]) / 2;
					var midPointY = (point1[1] + point2[1]) / 2;
					context.quadraticCurveTo(point1[0], point1[1], midPointX, midPointY);
				}
				context.stroke();
				context.closePath();
				context.restore();
			}
		};

		_this.calcPointPos = function (point, xScale, yScale, containerFrame, chartFrame, index) {
			if (point && typeof xScale === 'function' && typeof yScale === 'function') {
				if (point[1] === '-') return [undefined, undefined];
				var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
				//使用当前数据的index计算x轴位置
				var x = xScale(index) + offsets[0];
				var y = yScale(point[1]) + offsets[1];
				var pointLoc = [x, y];
				return _this.isOverBoundary(pointLoc, containerFrame, chartFrame);
			} else {
				return [undefined, undefined];
			}
		};

		return _this;
	}

	_createClass(MACD, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextContext) {
			if (!nextContext.plotData.calcedData) return;
			this.drawLine(nextProps, nextContext, 'DIFF');
			this.drawLine(nextProps, nextContext, 'DEA');
			this.drawHistogram(nextProps, nextContext);
			this.drawBackgroundLine(nextProps, nextContext);
		}
		// 绘制直方图

	}, {
		key: 'isOverBoundary',

		//监测绘制点坐标是否越界
		value: function isOverBoundary(point, containerFrame, chartFrame) {
			return point;
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return MACD;
}(_react.Component);

MACD.defaultProps = {
	barWidth: 8,
	lineWidth: 1,
	strokeStyle: '#3E3E3E'
};
exports.default = MACD;


MACD.contextTypes = {
	context: _propTypes2.default.object,
	plotData: _propTypes2.default.object,
	plotConfig: _propTypes2.default.object,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func,
	containerFrame: _propTypes2.default.object,
	chartFrame: _propTypes2.default.object
};