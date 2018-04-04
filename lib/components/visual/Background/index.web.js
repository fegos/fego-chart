'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helper = require('../common/helper');

var _lang = require('lodash/lang');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 背景组件:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 可接受theme style以及背景text
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var themesMap = {
	normal: {
		fillStyle: '',
		strokeStyle: ''
	},
	dark: {
		fillStyle: '#3F3F3F',
		strokeStyle: '#FFFFFF'
	}
};

var Background = function (_Component) {
	_inherits(Background, _Component);

	function Background(props) {
		_classCallCheck(this, Background);

		var _this = _possibleConstructorReturn(this, (Background.__proto__ || Object.getPrototypeOf(Background)).call(this, props));

		_this.draw = function (chartProps, chartContext) {
			var _this$props = _this.props,
			    fillGradient = _this$props.fillGradient,
			    fillGradientColors = _this$props.fillGradientColors;
			var bordered = chartProps.bordered,
			    filled = chartProps.filled,
			    stroke = chartProps.stroke,
			    fill = chartProps.fill;
			var context = chartContext.context,
			    containerFrame = chartContext.containerFrame,
			    chartFrame = chartContext.chartFrame;
			var padding = containerFrame.padding;
			var origin = chartFrame.origin;


			context.save();
			if (bordered) {
				context.strokeStyle = stroke;
				context.beginPath();
				var offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
				context.moveTo(offsets[0], offsets[1]);
				context.lineTo(containerFrame.width - padding.right, offsets[1]);
				context.lineTo(containerFrame.width - padding.right, offsets[1] + chartFrame.height);
				context.lineTo(offsets[0], offsets[1] + chartFrame.height);
				context.closePath();
				context.stroke();
			}

			if (filled) {
				var _offsets = (0, _helper.calcOffset)(containerFrame, chartFrame);
				if (fillGradient) {
					var gradient = context.createLinearGradient(_offsets[0], _offsets[1], _offsets[0], _offsets[1] + chartFrame.height);
					gradient.addColorStop(0, fillGradientColors[0]);
					gradient.addColorStop(1, fillGradientColors[1]);
					fill = gradient;
				}
				context.fillStyle = fill;
				context.beginPath();
				context.moveTo(_offsets[0], _offsets[1]);
				context.lineTo(containerFrame.width - padding.right, _offsets[1]);
				context.lineTo(containerFrame.width - padding.right, _offsets[1] + chartFrame.height);
				context.lineTo(_offsets[0], _offsets[1] + chartFrame.height);
				context.closePath();
				context.fill();
			}

			context.restore();
		};

		return _this;
	}

	_createClass(Background, [{
		key: 'componentDidMount',
		value: function componentDidMount() {}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextContext) {
			this.draw(nextProps, nextContext);
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return Background;
}(_react.Component);

Background.defaultProps = {
	theme: 'normal',
	fillGradient: false,
	fillGradientColors: ["#232526", "#414345"]
};
exports.default = Background;


Background.contextTypes = {
	context: _propTypes2.default.object,
	containerFrame: _propTypes2.default.object,
	chartFrame: _propTypes2.default.object
};