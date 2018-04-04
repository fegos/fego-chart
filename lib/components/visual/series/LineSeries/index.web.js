'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helper = require('../../common/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineSeries = function (_Component) {
	_inherits(LineSeries, _Component);

	function LineSeries(props) {
		_classCallCheck(this, LineSeries);

		var _this = _possibleConstructorReturn(this, (LineSeries.__proto__ || Object.getPrototypeOf(LineSeries)).call(this, props));

		_this.calcPointPos = function (point, xScale, yScale, containerFrame, chartFrame, index) {
			if (point && typeof xScale === 'function' && typeof yScale === 'function') {
				if (point[1] === '-') return [undefined, undefined];
				var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
				//使用当前数据的index计算x轴位置
				var x = xScale(index) + offsets[0];
				var y = yScale(point[1]) + offsets[1];
				var pointLoc = [x, y];
				return pointLoc;
			} else {
				return [undefined, undefined];
			}
		};

		_this.state = {};
		return _this;
	}

	_createClass(LineSeries, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextContext) {
			this.draw(nextProps, nextContext);
		}
	}, {
		key: 'draw',
		value: function draw(nextProps, nextContext) {
			var filled = this.props.filled;
			var context = nextContext.context,
			    plotData = nextContext.plotData,
			    containerFrame = nextContext.containerFrame,
			    chartFrame = nextContext.chartFrame,
			    xScale = nextContext.xScale,
			    yScale = nextContext.yScale;

			var data = [];
			var firstPointX = void 0;

			//有dataKey为指标，否则使用yAccessor
			if (nextProps.dataKey && plotData.dateTime) {
				for (var i = 0; i < plotData.dateTime.length; i++) {
					data.push([plotData.dateTime[i], plotData.calcedData[nextProps.dataKey][i]]);
				}
				data = data.slice(plotData.indexs[0], plotData.indexs[1]);
			} else if (nextProps.yAccessor) {
				if (!plotData.dateTime) return;
				data = plotData.dateTime.map(function (dt, idx) {
					return [dt].concat(nextProps.yAccessor(plotData.fullData[idx]));
				});
				data = data.slice(plotData.indexs[0], plotData.indexs[1]);
			}
			if (data.length > 0) {
				context.save();
				context.strokeStyle = nextProps.stroke || 'skyblue';
				context.fillStyle = nextProps.fillStyle || 'skyblue';
				context.beginPath();
				context.lineCap = "round";
				var begPoint = this.calcPointPos(data[0], xScale, yScale, containerFrame, chartFrame, 0);
				var firstDrawPoint = begPoint[0] ? begPoint : null;
				//todo, fill覆盖到最后一个点
				var lastDrawPoint = null;
				context.moveTo(begPoint[0], begPoint[1]);
				for (var _i = 1; _i < data.length - 1; _i++) {
					//使用平滑曲线绘制
					var point1 = this.calcPointPos(data[_i], xScale, yScale, containerFrame, chartFrame, _i);
					var point2 = this.calcPointPos(data[_i + 1], xScale, yScale, containerFrame, chartFrame, _i + 1);
					//锁定第一个和最后一个绘制点用来进行fill
					if (!firstDrawPoint || firstDrawPoint && !firstDrawPoint[0]) firstDrawPoint = point1;
					if (point2[0]) lastDrawPoint = point2;
					//最后一个point
					if (_i === data.length - 2) {
						context.lineTo(point2[0], point2[1]);
					} else {
						var midPointX = (point1[0] + point2[0]) / 2;
						var midPointY = (point1[1] + point2[1]) / 2;
						context.quadraticCurveTo(point1[0], point1[1], midPointX, midPointY);
					}
				}
				context.stroke();
				if (filled) {
					var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
					context.lineTo(lastDrawPoint[0], offsets[1] + chartFrame.height);
					context.lineTo(firstDrawPoint[0], offsets[1] + chartFrame.height);
					context.closePath();
					context.fill();
				} else {
					context.closePath();
				}
				context.restore();
			}
		}
	}, {
		key: 'isOverBoundary',


		//监测绘制点坐标是否越界
		value: function isOverBoundary(point, containerFrame, chartFrame) {
			// let { padding } = containerFrame
			// let { origin } = chartFrame
			// let leftBorder = padding.left + origin[0]
			// let rightBorder = containerFrame.width - padding.right
			// let topBorder = padding.top + origin[1]
			// let bottomBorder = Math.min(padding.top + chartFrame.height, containerFrame.height - padding.bottom)
			// if(point[0] < leftBorder || point[1] > rightBorder) return [undefined,undefined];
			// if(point[1] < topBorder || point[1] > bottomBorder) return [undefined,undefined];
			return point;
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return LineSeries;
}(_react.Component);

LineSeries.defaultProps = {
	strokeStyle: 'skyblue',
	fillStyle: 'rgba(207,242,253,0.5)',
	filled: false
};


LineSeries.contextTypes = {
	context: _propTypes2.default.object,
	plotData: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	chartFrame: _propTypes2.default.object,
	events: _propTypes2.default.object,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func
};

exports.default = LineSeries;