'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _LineSeries = require('../LineSeries');

var _LineSeries2 = _interopRequireDefault(_LineSeries);

var _helper = require('../../common/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AreaSeries = function (_Component) {
	_inherits(AreaSeries, _Component);

	function AreaSeries(props) {
		_classCallCheck(this, AreaSeries);

		var _this = _possibleConstructorReturn(this, (AreaSeries.__proto__ || Object.getPrototypeOf(AreaSeries)).call(this, props));

		_this.state = {};
		return _this;
	}

	_createClass(AreaSeries, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextContext) {}
	}, {
		key: 'draw',
		value: function draw() {}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return AreaSeries;
}(_react.Component);

AreaSeries.defaultProps = {};


AreaSeries.contextTypes = {
	context: _propTypes2.default.object,
	plotData: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	chartFrame: _propTypes2.default.object,
	events: _propTypes2.default.object,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func
};

exports.default = AreaSeries;