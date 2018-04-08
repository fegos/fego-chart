'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _indexWeb = require('../index.web.js');

var _indexWeb2 = _interopRequireDefault(_indexWeb);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'whatwg-fetch'

var data = void 0,
    indicators = void 0,
    nextProps = void 0;
beforeEach(function () {
	indicators = {
		MA: [{
			params: { period: 5 },
			selector: function selector(data) {
				return +data[1];
			},
			stroke: 'red',
			dataKey: 'MA5'
		}, {
			params: { period: 10 },
			selector: function selector(data) {
				return +data[1];
			},
			stroke: 'blue',
			dataKey: 'MA10'
		}, {
			params: { period: 30 },
			selector: function selector(data) {
				return +data[1];
			},
			stroke: 'limegreen',
			dataKey: 'MA30'
		}],
		MACD: [{
			params: {
				fastPeriod: 5,
				slowPeriod: 8,
				signalPeriod: 3
			},
			selector: function selector(data) {
				return +data[1];
			},
			stroke: {
				macd: "#FF0000",
				signal: "#00F300",
				divergence: "#4682B4"
			},
			dataKey: 'MACD'
		}]
	};
	nextProps = {
		frame: {
			width: 800,
			height: 600,
			padding: {
				left: 50,
				right: 50,
				top: 50,
				bottom: 50
			}
		},
		xExtents: [0, 50],
		indicators: indicators
	};
});

describe('ChartContainer', function () {
	it('calls componentDidMount', function () {
		_sinon2.default.spy(_indexWeb2.default.prototype, 'componentDidMount');
		return (0, _isomorphicFetch2.default)('http://localhost:5001/api/kLineQuote', {
			credentials: 'include'
		}).then(function (resp) {
			return resp.json();
		}).then(function (res) {
			data = res.data.result;
			var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_indexWeb2.default, {
				frame: {
					width: 800,
					height: 600,
					padding: { left: 50, right: 50, top: 50, bottom: 50 }
				},
				xExtents: [0, 50],
				data: data,
				indicators: indicators
			}));
			expect(_indexWeb2.default.prototype.componentDidMount.calledOnce).toEqual(true);
		}).catch(function (err) {
			console.log(err);
		});
	});
	it('props&state change', function () {
		var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_indexWeb2.default, {
			frame: {
				width: 800,
				height: 600,
				padding: { left: 50, right: 50, top: 50, bottom: 50 }
			},
			xExtents: [0, 50],
			data: data,
			indicators: indicators
		}));
		nextProps.data = data;
		expect(wrapper.instance().props.xExtents).toEqual(nextProps.xExtents);
		expect(wrapper.instance().props.indicators).toEqual(nextProps.indicators);
		expect(wrapper.state('plotData').indexs).toEqual(nextProps.xExtents);
		expect(wrapper.state('plotData').currentData.length).toBe(50);
		expect(wrapper.state('containerFrame')).toEqual(Object.assign({}, nextProps.frame, {
			chartWidth: 700, chartHeight: 500
		}));
		expect(Object.keys(wrapper.state('plotData').calcedData)).toEqual(['MA5', 'MA10', 'MA30', 'MACD']);
		expect(wrapper.state('xScale').domain()).toEqual([0, 49]);
		expect(wrapper.state('xScale').range()).toEqual([0, 700]);
		// expect(wrapper).toMatchSnapshot()
	});
	it('events change', function () {
		var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_indexWeb2.default, {
			frame: {
				width: 800,
				height: 600,
				padding: { left: 50, right: 50, top: 50, bottom: 50 }
			},
			xExtents: [0, 50],
			data: data,
			indicators: indicators
		}));
		_sinon2.default.spy(wrapper.instance(), 'updateContainer');
		expect(wrapper.state('events').mouseEnter).toBe(false);
		wrapper.instance().handleMouseEnter();
		expect(wrapper.state('events').mouseEnter).toBe(true);
		wrapper.instance().handleMouseDown({ clientX: 689, clientY: 218 });
		expect(wrapper.state('events').mouseDown).toBe(true);
		wrapper.instance().handleMouseDrag({ clientX: 709, clientY: 218 });
		expect(wrapper.state('plotData').indexs).toEqual([3, 53]);
		// expect(wrapper.instance().updateContainer.calledOnce).toEqual(true)
		// console.log(wrapper.instance().updateContainer.callCount)
	});
});