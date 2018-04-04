'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventCapture = function (_Component) {
	_inherits(EventCapture, _Component);

	function EventCapture(props) {
		_classCallCheck(this, EventCapture);

		var _this = _possibleConstructorReturn(this, (EventCapture.__proto__ || Object.getPrototypeOf(EventCapture)).call(this, props));

		_this.addEventListener = function (nextProps) {
			var canvas = nextProps.canvas,
			    eventCaptures = nextProps.eventCaptures;

			var eventObj = {};
			//根据eventCaptures设定增加事件监听
			var eventArr = ['onmousemove', 'onmouseenter', 'onmouseleave', 'onmouseup', 'onmousedown', 'onmousewheel'];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = eventArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var eventItem = _step.value;

					if (eventCaptures.includes(eventItem) && nextProps[eventItem]) eventObj[eventItem] = nextProps[eventItem];
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

			Object.keys(eventObj).map(function (event) {
				if (Array.isArray(eventObj[event])) {
					eventObj[event].map(function (handler) {
						canvas.addEventListener(event.slice(2), handler);
					});
				} else {
					canvas.addEventListener(event.slice(2), eventObj[event]);
				}
			});
			_this.setState({
				isBindEvent: true
			});
		};

		_this.state = {
			isBindEvent: false
		};
		return _this;
	}

	_createClass(EventCapture, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var canvas = nextProps.canvas;

			if (this.state.isBindEvent) return;
			nextProps.canvas && this.addEventListener(nextProps);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				this.props.children
			);
		}
	}]);

	return EventCapture;
}(_react.Component);

exports.default = EventCapture;