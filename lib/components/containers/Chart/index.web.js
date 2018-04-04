'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helper = require('../common/helper');

var _scale = require('../../scale');

var _lodash = require('lodash.flattendeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _CalculateUtil = require('../CalculateUtil');

var _CalculateUtil2 = _interopRequireDefault(_CalculateUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Chart组件，为独立绘图元素（如Axis,Series)的容器
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Chart = function (_Component) {
	_inherits(Chart, _Component);

	function Chart(props) {
		_classCallCheck(this, Chart);

		var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props));

		_this.updateYScale = function (plotData, height, nextProps) {
			if (plotData.currentData && height) {
				var data = _this.getYScale(plotData, nextProps);
				_this.setState({
					yScale: (0, _scale.calculateYScale)(data, { chartHeight: _this.props.frame.height })
				});
			}
		};

		_this.calcluateValues = function (func) {
			return function (d) {
				var obj = typeof func === 'function' ? func(d) : func;
				return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj) ? Object.keys(obj).map(function (key) {
					return obj[key];
				}) : obj;
			};
		};

		_this.getYScale = function (plotData, nextProps) {
			var yExtents = nextProps.yExtents,
			    yAxisMargin = nextProps.yAxisMargin,
			    indicators = nextProps.indicators;

			var yValues = [],
			    max = Number.MIN_VALUE,
			    min = Number.MAX_VALUE,
			    _max = void 0,
			    _min = void 0;
			if (yExtents && Array.isArray(yExtents)) {
				var fullDataYExtents = [],
				    indicatorsYExtents = [];
				yExtents.map(function (eachExtent) {
					if (typeof eachExtent === 'function') {
						fullDataYExtents.push(eachExtent);
					} else if (typeof eachExtent === 'string') {
						indicatorsYExtents.push(eachExtent);
					}
				});
				yValues = fullDataYExtents.map(function (eachExtent) {
					return plotData.currentData.map(_this.calcluateValues(eachExtent));
				});
				yValues = (0, _lodash2.default)(yValues);
				indicatorsYExtents.map(function (eachIndicator) {
					var calcedValues = [];
					calcedValues = Array.from(plotData.calcedData[eachIndicator]).slice(plotData.indexs[0], plotData.indexs[1]);
					if (eachIndicator === 'MACD') {
						var _arr = [];
						calcedValues.map(function (data) {
							_arr.push(data.MACD ? data.MACD : '-');
							_arr.push(data.signal ? data.signal : '-');
							_arr.push(data.histogram ? data.histogram : '-');
						});
						calcedValues = _arr;
					}
					var arr = calcedValues.filter(function (data) {
						return data !== '-';
					});
					yValues = yValues.concat(arr);
				});
				var allValues = (0, _lodash2.default)(yValues);
				allValues.map(function (value) {
					if (value > max) {
						max = value;
					}
					if (value < min) {
						min = value;
					}
				});
				if (min < 0 && Math.abs(max) > Math.abs(min)) {
					min = -Math.abs(max);
				}
				_max = max * yAxisMargin[1];
				_min = min > 0 ? min * yAxisMargin[0] : min * yAxisMargin[1];
				return [_max, _min];
			}
		};

		_this.state = {
			yScale: null
		};
		return _this;
	}

	_createClass(Chart, [{
		key: 'componentDidMount',
		value: function componentDidMount() {}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextContext) {
			var frame = nextProps.frame;
			var plotData = nextContext.plotData;

			this.updateYScale(plotData, frame.height, nextProps);
		}
	}, {
		key: 'getChildContext',
		value: function getChildContext() {
			return {
				chartFrame: this.props.frame,
				yScale: this.state.yScale
			};
		}
	}, {
		key: 'render',
		value: function render() {
			var children = this.props.children;
			var yScale = this.state.yScale;

			return _react2.default.createElement(
				'div',
				null,
				children
			);
		}
	}]);

	return Chart;
}(_react.Component);

Chart.propTypes = {
	plotData: _propTypes2.default.object,
	frame: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	yExtents: _propTypes2.default.array
};
Chart.defaultProps = {
	//yScale留出多余空间 
	yAxisMargin: [0.90, 1.10]
};
exports.default = Chart;


Chart.contextTypes = {
	containerFrame: _propTypes2.default.object,
	plotData: _propTypes2.default.object
};

Chart.childContextTypes = {
	chartFrame: _propTypes2.default.object,
	yScale: _propTypes2.default.func
};