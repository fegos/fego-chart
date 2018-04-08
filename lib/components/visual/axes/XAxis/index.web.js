'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _BaseAxis = require('../BaseAxis');

var _BaseAxis2 = _interopRequireDefault(_BaseAxis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //X轴组件


var XAxis = function (_Component) {
	_inherits(XAxis, _Component);

	function XAxis(props) {
		_classCallCheck(this, XAxis);

		return _possibleConstructorReturn(this, (XAxis.__proto__ || Object.getPrototypeOf(XAxis)).call(this, props));
	}

	_createClass(XAxis, [{
		key: 'render',
		value: function render() {
			var _props = this.props,
			    showTicks = _props.showTicks,
			    axisAt = _props.axisAt,
			    showGridLine = _props.showGridLine,
			    moreProps = _objectWithoutProperties(_props, ['showTicks', 'axisAt', 'showGridLine']);

			var xScale = this.context.xScale;

			return _react2.default.createElement(_BaseAxis2.default, _extends({
				axisAt: axisAt,
				type: 'XAxis',
				showTicks: showTicks,
				scale: xScale,
				showGridLine: showGridLine
			}, moreProps));
		}
	}]);

	return XAxis;
}(_react.Component);

XAxis.defaultProps = {};


XAxis.propTypes = {};

XAxis.contextTypes = {
	context: _propTypes2.default.object,
	plotData: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	chartFrame: _propTypes2.default.object,
	events: _propTypes2.default.object,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func
};

exports.default = XAxis;