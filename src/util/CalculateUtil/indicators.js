'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, '__esModule', { value: true });

var config = {};
function setConfig(key, value) {
	config[key] = value;
}
function getConfig(key) {
	return config[key];
}

function format(v) {
	var precision = getConfig('precision');
	if (precision) {
		return parseFloat(v.toPrecision(precision));
	}
	return v;
}

var IndicatorInput = function IndicatorInput() {
	(0, _classCallCheck3.default)(this, IndicatorInput);
};

var Indicator = function () {
	function Indicator(input) {
		(0, _classCallCheck3.default)(this, Indicator);

		this.format = input.format || format;
	}

	(0, _createClass3.default)(Indicator, [{
		key: 'getResult',
		value: function getResult() {
			return this.result;
		}
	}], [{
		key: 'reverseInputs',
		value: function reverseInputs(input) {
			if (input.reversedInput) {
				input.values ? input.values.reverse() : undefined;
				input.open ? input.open.reverse() : undefined;
				input.high ? input.high.reverse() : undefined;
				input.low ? input.low.reverse() : undefined;
				input.close ? input.close.reverse() : undefined;
				input.volume ? input.volume.reverse() : undefined;
				input.timestamp ? input.timestamp.reverse() : undefined;
			}
		}
	}]);
	return Indicator;
}();

var Item = function Item(data, prev, next) {
	(0, _classCallCheck3.default)(this, Item);

	this.next = next;
	if (next) next.prev = this;
	this.prev = prev;
	if (prev) prev.next = this;
	this.data = data;
};

var LinkedList = function () {
	function LinkedList() {
		(0, _classCallCheck3.default)(this, LinkedList);

		this._length = 0;
	}

	(0, _createClass3.default)(LinkedList, [{
		key: 'push',
		value: function push(data) {
			this._tail = new Item(data, this._tail);
			if (this._length === 0) {
				this._head = this._tail;
				this._current = this._head;
				this._next = this._head;
			}
			this._length++;
		}
	}, {
		key: 'pop',
		value: function pop() {
			var tail = this._tail;
			if (this._length === 0) {
				return;
			}
			this._length--;
			if (this._length === 0) {
				this._head = this._tail = this._current = this._next = undefined;
				return tail.data;
			}
			this._tail = tail.prev;
			this._tail.next = undefined;
			if (this._current === tail) {
				this._current = this._tail;
				this._next = undefined;
			}
			return tail.data;
		}
	}, {
		key: 'shift',
		value: function shift() {
			var head = this._head;
			if (this._length === 0) {
				return;
			}
			this._length--;
			if (this._length === 0) {
				this._head = this._tail = this._current = this._next = undefined;
				return head.data;
			}
			this._head = this._head.next;
			if (this._current === head) {
				this._current = this._head;
				this._next = this._current.next;
			}
			return head.data;
		}
	}, {
		key: 'unshift',
		value: function unshift(data) {
			this._head = new Item(data, undefined, this._head);
			if (this._length === 0) {
				this._tail = this._head;
				this._next = this._head;
			}
			this._length++;
		}
	}, {
		key: 'unshiftCurrent',
		value: function unshiftCurrent() {
			var current = this._current;
			if (current === this._head || this._length < 2) {
				return current && current.data;
			}
			// remove
			if (current === this._tail) {
				this._tail = current.prev;
				this._tail.next = undefined;
				this._current = this._tail;
			} else {
				current.next.prev = current.prev;
				current.prev.next = current.next;
				this._current = current.prev;
			}
			this._next = this._current.next;
			// unshift
			current.next = this._head;
			current.prev = undefined;
			this._head.prev = current;
			this._head = current;
			return current.data;
		}
	}, {
		key: 'removeCurrent',
		value: function removeCurrent() {
			var current = this._current;
			if (this._length === 0) {
				return;
			}
			this._length--;
			if (this._length === 0) {
				this._head = this._tail = this._current = this._next = undefined;
				return current.data;
			}
			if (current === this._tail) {
				this._tail = current.prev;
				this._tail.next = undefined;
				this._current = this._tail;
			} else if (current === this._head) {
				this._head = current.next;
				this._head.prev = undefined;
				this._current = this._head;
			} else {
				current.next.prev = current.prev;
				current.prev.next = current.next;
				this._current = current.prev;
			}
			this._next = this._current.next;
			return current.data;
		}
	}, {
		key: 'resetCursor',
		value: function resetCursor() {
			this._current = this._next = this._head;
			return this;
		}
	}, {
		key: 'next',
		value: function next() {
			var next = this._next;
			if (next !== undefined) {
				this._next = next.next;
				this._current = next;
				return next.data;
			}
		}
	}, {
		key: 'head',
		get: function get() {
			return this._head && this._head.data;
		}
	}, {
		key: 'tail',
		get: function get() {
			return this._tail && this._tail.data;
		}
	}, {
		key: 'current',
		get: function get() {
			return this._current && this._current.data;
		}
	}, {
		key: 'length',
		get: function get() {
			return this._length;
		}
	}]);
	return LinkedList;
}();

//STEP 1. Import Necessary indicator or rather last step
//STEP 2. Create the input for the indicator, mandatory should be in the constructor

//STEP3. Add class based syntax with export


var SMA = function (_Indicator) {
	(0, _inherits3.default)(SMA, _Indicator);

	function SMA(input) {
		(0, _classCallCheck3.default)(this, SMA);

		var _this = (0, _possibleConstructorReturn3.default)(this, (SMA.__proto__ || (0, _getPrototypeOf2.default)(SMA)).call(this, input));

		_this.period = input.period;
		_this.price = input.values;
		var genFn = _regenerator2.default.mark(function genFn(period) {
			var list, sum, counter, current, result;
			return _regenerator2.default.wrap(function genFn$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							list = new LinkedList();
							sum = 0;
							counter = 1;
							_context.next = 5;
							return;

						case 5:
							current = _context.sent;

							list.push(0);

						case 7:
							if (!true) {
								_context.next = 14;
								break;
							}

							if (counter < period) {
								counter++;
								list.push(current);
								sum = sum + current;
							} else {
								sum = sum - list.shift() + current;
								result = sum / period;
								list.push(current);
							}
							_context.next = 11;
							return result;

						case 11:
							current = _context.sent;
							_context.next = 7;
							break;

						case 14:
						case 'end':
							return _context.stop();
					}
				}
			}, genFn, this);
		});
		_this.generator = genFn(_this.period);
		_this.generator.next();
		_this.result = [];
		_this.price.forEach(function (tick) {
			var result = _this.generator.next(tick);
			if (result.value !== undefined) {
				_this.result.push(_this.format(result.value));
			}
		});
		return _this;
	}

	(0, _createClass3.default)(SMA, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined) return this.format(result);
		}
	}]);
	return SMA;
}(Indicator);

SMA.calculate = sma;
function sma(input) {
	Indicator.reverseInputs(input);
	var result = new SMA(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

//STEP 6. Run the tests

var EMA = function (_Indicator2) {
	(0, _inherits3.default)(EMA, _Indicator2);

	function EMA(input) {
		(0, _classCallCheck3.default)(this, EMA);

		var _this2 = (0, _possibleConstructorReturn3.default)(this, (EMA.__proto__ || (0, _getPrototypeOf2.default)(EMA)).call(this, input));

		var period = input.period;
		var priceArray = input.values;
		var exponent = 2 / (period + 1);
		var sma$$1;
		_this2.result = [];
		sma$$1 = new SMA({ period: period, values: [] });
		var genFn = _regenerator2.default.mark(function genFn() {
			var tick, prevEma;
			return _regenerator2.default.wrap(function genFn$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return;

						case 2:
							tick = _context2.sent;

						case 3:
							if (!true) {
								_context2.next = 21;
								break;
							}

							if (!(prevEma && tick)) {
								_context2.next = 11;
								break;
							}

							prevEma = (tick - prevEma) * exponent + prevEma;
							_context2.next = 8;
							return prevEma;

						case 8:
							tick = _context2.sent;
							_context2.next = 19;
							break;

						case 11:
							_context2.next = 13;
							return;

						case 13:
							tick = _context2.sent;

							prevEma = sma$$1.nextValue(tick);

							if (!prevEma) {
								_context2.next = 19;
								break;
							}

							_context2.next = 18;
							return prevEma;

						case 18:
							tick = _context2.sent;

						case 19:
							_context2.next = 3;
							break;

						case 21:
						case 'end':
							return _context2.stop();
					}
				}
			}, genFn, this);
		});
		_this2.generator = genFn();
		_this2.generator.next();
		_this2.generator.next();
		priceArray.forEach(function (tick) {
			var result = _this2.generator.next(tick);
			if (result.value != undefined) {
				_this2.result.push(_this2.format(result.value));
			}
		});
		return _this2;
	}

	(0, _createClass3.default)(EMA, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined) return this.format(result);
		}
	}]);
	return EMA;
}(Indicator);

EMA.calculate = ema;
function ema(input) {
	Indicator.reverseInputs(input);
	var result = new EMA(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var WMA = function (_Indicator3) {
	(0, _inherits3.default)(WMA, _Indicator3);

	function WMA(input) {
		(0, _classCallCheck3.default)(this, WMA);

		var _this3 = (0, _possibleConstructorReturn3.default)(this, (WMA.__proto__ || (0, _getPrototypeOf2.default)(WMA)).call(this, input));

		var period = input.period;
		var priceArray = input.values;
		_this3.result = [];
		_this3.generator = _regenerator2.default.mark(function _callee() {
			var data, denominator, result, i, next;
			return _regenerator2.default.wrap(function _callee$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							data = new LinkedList();
							denominator = period * (period + 1) / 2;

						case 2:
							if (!true) {
								_context3.next = 21;
								break;
							}

							if (!(data.length < period)) {
								_context3.next = 11;
								break;
							}

							_context3.t0 = data;
							_context3.next = 7;
							return;

						case 7:
							_context3.t1 = _context3.sent;

							_context3.t0.push.call(_context3.t0, _context3.t1);

							_context3.next = 19;
							break;

						case 11:
							data.resetCursor();
							result = 0;

							for (i = 1; i <= period; i++) {
								result = result + data.next() * i / denominator;
							}
							_context3.next = 16;
							return result;

						case 16:
							next = _context3.sent;

							data.shift();
							data.push(next);

						case 19:
							_context3.next = 2;
							break;

						case 21:
						case 'end':
							return _context3.stop();
					}
				}
			}, _callee, this);
		})();
		_this3.generator.next();
		priceArray.forEach(function (tick, index) {
			var result = _this3.generator.next(tick);
			if (result.value != undefined) {
				_this3.result.push(_this3.format(result.value));
			}
		});
		return _this3;
	}
	//STEP 5. REMOVE GET RESULT FUNCTION


	(0, _createClass3.default)(WMA, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined) return this.format(result);
		}
	}]);
	return WMA;
}(Indicator);

WMA.calculate = wma;

function wma(input) {
	Indicator.reverseInputs(input);
	var result = new WMA(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var WEMA = function (_Indicator4) {
	(0, _inherits3.default)(WEMA, _Indicator4);

	function WEMA(input) {
		(0, _classCallCheck3.default)(this, WEMA);

		var _this4 = (0, _possibleConstructorReturn3.default)(this, (WEMA.__proto__ || (0, _getPrototypeOf2.default)(WEMA)).call(this, input));

		var period = input.period;
		var priceArray = input.values;
		var exponent = 1 / period;
		var sma$$1;
		_this4.result = [];
		sma$$1 = new SMA({ period: period, values: [] });
		var genFn = _regenerator2.default.mark(function genFn() {
			var tick, prevEma;
			return _regenerator2.default.wrap(function genFn$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							_context4.next = 2;
							return;

						case 2:
							tick = _context4.sent;

						case 3:
							if (!true) {
								_context4.next = 21;
								break;
							}

							if (!(prevEma && tick != undefined)) {
								_context4.next = 11;
								break;
							}

							prevEma = (tick - prevEma) * exponent + prevEma;
							_context4.next = 8;
							return prevEma;

						case 8:
							tick = _context4.sent;
							_context4.next = 19;
							break;

						case 11:
							_context4.next = 13;
							return;

						case 13:
							tick = _context4.sent;

							prevEma = sma$$1.nextValue(tick);

							if (!prevEma) {
								_context4.next = 19;
								break;
							}

							_context4.next = 18;
							return prevEma;

						case 18:
							tick = _context4.sent;

						case 19:
							_context4.next = 3;
							break;

						case 21:
						case 'end':
							return _context4.stop();
					}
				}
			}, genFn, this);
		});
		_this4.generator = genFn();
		_this4.generator.next();
		_this4.generator.next();
		priceArray.forEach(function (tick) {
			var result = _this4.generator.next(tick);
			if (result.value != undefined) {
				_this4.result.push(_this4.format(result.value));
			}
		});
		return _this4;
	}

	(0, _createClass3.default)(WEMA, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined) return this.format(result);
		}
	}]);
	return WEMA;
}(Indicator);

WEMA.calculate = wema;
function wema(input) {
	Indicator.reverseInputs(input);
	var result = new WEMA(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

/**
 * Created by AAravindan on 5/4/16.
 */

var MACD = function (_Indicator5) {
	(0, _inherits3.default)(MACD, _Indicator5);

	function MACD(input) {
		(0, _classCallCheck3.default)(this, MACD);

		var _this5 = (0, _possibleConstructorReturn3.default)(this, (MACD.__proto__ || (0, _getPrototypeOf2.default)(MACD)).call(this, input));

		var oscillatorMAtype = input.SimpleMAOscillator ? SMA : EMA;
		var signalMAtype = input.SimpleMASignal ? SMA : EMA;
		var fastMAProducer = new oscillatorMAtype({
			period: input.fastPeriod, values: [], format: function format(v) {
				return v;
			}
		});
		var slowMAProducer = new oscillatorMAtype({
			period: input.slowPeriod, values: [], format: function format(v) {
				return v;
			}
		});
		var signalMAProducer = new signalMAtype({
			period: input.signalPeriod, values: [], format: function format(v) {
				return v;
			}
		});
		var format = _this5.format;
		_this5.result = [];
		_this5.generator = _regenerator2.default.mark(function _callee2() {
			var index, tick, MACD, signal, histogram, fast, slow;
			return _regenerator2.default.wrap(function _callee2$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							index = 0;

						case 1:
							if (!true) {
								_context5.next = 19;
								break;
							}

							if (!(index < input.slowPeriod)) {
								_context5.next = 10;
								break;
							}

							_context5.next = 5;
							return;

						case 5:
							tick = _context5.sent;

							fast = fastMAProducer.nextValue(tick);
							slow = slowMAProducer.nextValue(tick);
							index++;
							return _context5.abrupt('continue', 1);

						case 10:
							if (fast && slow) {
								MACD = fast - slow;
								signal = signalMAProducer.nextValue(MACD);
							}
							histogram = MACD - signal;
							_context5.next = 14;
							return {
								//fast : fast,
								//slow : slow,
								MACD: format(MACD),
								signal: signal ? format(signal) : undefined,
								histogram: isNaN(histogram) ? undefined : format(histogram)
							};

						case 14:
							tick = _context5.sent;

							fast = fastMAProducer.nextValue(tick);
							slow = slowMAProducer.nextValue(tick);
							_context5.next = 1;
							break;

						case 19:
						case 'end':
							return _context5.stop();
					}
				}
			}, _callee2, this);
		})();
		_this5.generator.next();
		input.values.forEach(function (tick) {
			var result = _this5.generator.next(tick);
			if (result.value != undefined) {
				_this5.result.push(result.value);
			}
		});
		return _this5;
	}

	(0, _createClass3.default)(MACD, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			return result;
		}
	}]);
	return MACD;
}(Indicator);

MACD.calculate = macd;
function macd(input) {
	Indicator.reverseInputs(input);
	var result = new MACD(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var AverageGain = function (_Indicator6) {
	(0, _inherits3.default)(AverageGain, _Indicator6);

	function AverageGain(input) {
		(0, _classCallCheck3.default)(this, AverageGain);

		var _this6 = (0, _possibleConstructorReturn3.default)(this, (AverageGain.__proto__ || (0, _getPrototypeOf2.default)(AverageGain)).call(this, input));

		var values = input.values;
		var period = input.period;
		var format = _this6.format;
		_this6.generator = _regenerator2.default.mark(function _callee3(period) {
			var currentValue, counter, gainSum, avgGain, gain, lastValue;
			return _regenerator2.default.wrap(function _callee3$(_context6) {
				while (1) {
					switch (_context6.prev = _context6.next) {
						case 0:
							_context6.next = 2;
							return;

						case 2:
							currentValue = _context6.sent;
							counter = 1;
							gainSum = 0;

						case 5:
							if (!true) {
								_context6.next = 17;
								break;
							}

							gain = lastValue ? currentValue - lastValue : 0;
							gain = gain ? gain : 0;
							if (gain > 0) {
								gainSum = gainSum + gain;
							}
							if (counter < period + 1) {
								counter++;
							} else if (!avgGain) {
								avgGain = gainSum / period;
							} else {
								avgGain = (avgGain * (period - 1) + (gain > 0 ? gain : 0)) / period;
							}
							lastValue = currentValue;
							avgGain = avgGain ? format(avgGain) : undefined;
							_context6.next = 14;
							return avgGain;

						case 14:
							currentValue = _context6.sent;
							_context6.next = 5;
							break;

						case 17:
						case 'end':
							return _context6.stop();
					}
				}
			}, _callee3, this);
		})(period);
		_this6.generator.next();
		_this6.result = [];
		values.forEach(function (tick) {
			var result = _this6.generator.next(tick);
			if (result.value !== undefined) {
				_this6.result.push(result.value);
			}
		});
		return _this6;
	}

	(0, _createClass3.default)(AverageGain, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}]);
	return AverageGain;
}(Indicator);

AverageGain.calculate = averagegain;
function averagegain(input) {
	Indicator.reverseInputs(input);
	var result = new AverageGain(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var AverageLoss = function (_Indicator7) {
	(0, _inherits3.default)(AverageLoss, _Indicator7);

	function AverageLoss(input) {
		(0, _classCallCheck3.default)(this, AverageLoss);

		var _this7 = (0, _possibleConstructorReturn3.default)(this, (AverageLoss.__proto__ || (0, _getPrototypeOf2.default)(AverageLoss)).call(this, input));

		var values = input.values;
		var period = input.period;
		var format = _this7.format;
		_this7.generator = _regenerator2.default.mark(function _callee4(period) {
			var currentValue, counter, lossSum, avgLoss, loss, lastValue;
			return _regenerator2.default.wrap(function _callee4$(_context7) {
				while (1) {
					switch (_context7.prev = _context7.next) {
						case 0:
							_context7.next = 2;
							return;

						case 2:
							currentValue = _context7.sent;
							counter = 1;
							lossSum = 0;

						case 5:
							if (!true) {
								_context7.next = 17;
								break;
							}

							loss = lastValue ? lastValue - currentValue : 0;
							loss = loss ? loss : 0;
							if (loss > 0) {
								lossSum = lossSum + loss;
							}
							if (counter < period + 1) {
								counter++;
							} else if (!avgLoss) {
								avgLoss = lossSum / period;
							} else {
								avgLoss = (avgLoss * (period - 1) + (loss > 0 ? loss : 0)) / period;
							}
							lastValue = currentValue;
							avgLoss = avgLoss ? format(avgLoss) : undefined;
							_context7.next = 14;
							return avgLoss;

						case 14:
							currentValue = _context7.sent;
							_context7.next = 5;
							break;

						case 17:
						case 'end':
							return _context7.stop();
					}
				}
			}, _callee4, this);
		})(period);
		_this7.generator.next();
		_this7.result = [];
		values.forEach(function (tick) {
			var result = _this7.generator.next(tick);
			if (result.value !== undefined) {
				_this7.result.push(result.value);
			}
		});
		return _this7;
	}

	(0, _createClass3.default)(AverageLoss, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}]);
	return AverageLoss;
}(Indicator);

AverageLoss.calculate = averageloss;
function averageloss(input) {
	Indicator.reverseInputs(input);
	var result = new AverageLoss(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

/**
 * Created by AAravindan on 5/5/16.
 */

var RSI = function (_Indicator8) {
	(0, _inherits3.default)(RSI, _Indicator8);

	function RSI(input) {
		(0, _classCallCheck3.default)(this, RSI);

		var _this8 = (0, _possibleConstructorReturn3.default)(this, (RSI.__proto__ || (0, _getPrototypeOf2.default)(RSI)).call(this, input));

		var period = input.period;
		var values = input.values;
		var GainProvider = new AverageGain({ period: period, values: [] });
		var LossProvider = new AverageLoss({ period: period, values: [] });
		var count = 1;
		_this8.generator = _regenerator2.default.mark(function _callee5(period) {
			var current, lastAvgGain, lastAvgLoss, RS, currentRSI;
			return _regenerator2.default.wrap(function _callee5$(_context8) {
				while (1) {
					switch (_context8.prev = _context8.next) {
						case 0:
							_context8.next = 2;
							return;

						case 2:
							current = _context8.sent;

						case 3:
							if (!true) {
								_context8.next = 13;
								break;
							}

							lastAvgGain = GainProvider.nextValue(current);
							lastAvgLoss = LossProvider.nextValue(current);
							if (lastAvgGain && lastAvgLoss) {
								if (lastAvgLoss === 0) {
									currentRSI = 100;
								} else {
									RS = lastAvgGain / lastAvgLoss;
									currentRSI = parseFloat((100 - 100 / (1 + RS)).toFixed(2));
								}
							} else if (lastAvgGain && !lastAvgLoss) {
								currentRSI = 100;
							} else if (lastAvgLoss && !lastAvgGain) {
								currentRSI = 0;
							} else if (count >= period) {
								//if no average gain and average loss after the RSI period
								currentRSI = 0;
							}
							count++;
							_context8.next = 10;
							return currentRSI;

						case 10:
							current = _context8.sent;
							_context8.next = 3;
							break;

						case 13:
						case 'end':
							return _context8.stop();
					}
				}
			}, _callee5, this);
		})(period);
		_this8.generator.next();
		_this8.result = [];
		values.forEach(function (tick) {
			var result = _this8.generator.next(tick);
			if (result.value !== undefined) {
				_this8.result.push(result.value);
			}
		});
		return _this8;
	}

	(0, _createClass3.default)(RSI, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}]);
	return RSI;
}(Indicator);

RSI.calculate = rsi;
function rsi(input) {
	Indicator.reverseInputs(input);
	var result = new RSI(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

/**
 * Created by AAravindan on 5/7/16.
 */

var FixedSizeLinkedList = function (_LinkedList) {
	(0, _inherits3.default)(FixedSizeLinkedList, _LinkedList);

	function FixedSizeLinkedList(size, maintainHigh, maintainLow) {
		(0, _classCallCheck3.default)(this, FixedSizeLinkedList);

		var _this9 = (0, _possibleConstructorReturn3.default)(this, (FixedSizeLinkedList.__proto__ || (0, _getPrototypeOf2.default)(FixedSizeLinkedList)).call(this));

		_this9.size = size;
		_this9.maintainHigh = maintainHigh;
		_this9.maintainLow = maintainLow;
		_this9.periodHigh = 0;
		_this9.periodLow = Infinity;
		if (!size || typeof size !== 'number') {
			throw 'Size required and should be a number.';
		}
		_this9._push = _this9.push;
		_this9.push = function (data) {
			this.add(data);
		};
		return _this9;
	}

	(0, _createClass3.default)(FixedSizeLinkedList, [{
		key: 'add',
		value: function add(data) {
			if (this.length === this.size) {
				this.lastShift = this.shift();
				this._push(data);
				//TODO: FInd a better way
				if (this.maintainHigh) if (this.lastShift == this.periodHigh) this.calculatePeriodHigh();
				if (this.maintainLow) if (this.lastShift == this.periodLow) this.calculatePeriodLow();
			} else {
				this._push(data);
			}
			//TODO: FInd a better way
			if (this.maintainHigh) if (this.periodHigh <= data) this.periodHigh = data;
			if (this.maintainLow) if (this.periodLow >= data) this.periodLow = data;
		}
	}, {
		key: 'iterator',
		value: _regenerator2.default.mark(function iterator() {
			return _regenerator2.default.wrap(function iterator$(_context9) {
				while (1) {
					switch (_context9.prev = _context9.next) {
						case 0:
							this.resetCursor();

						case 1:
							if (!this.next()) {
								_context9.next = 6;
								break;
							}

							_context9.next = 4;
							return this.current;

						case 4:
							_context9.next = 1;
							break;

						case 6:
						case 'end':
							return _context9.stop();
					}
				}
			}, iterator, this);
		})
	}, {
		key: 'calculatePeriodHigh',
		value: function calculatePeriodHigh() {
			this.resetCursor();
			if (this.next()) this.periodHigh = this.current;
			while (this.next()) {
				if (this.periodHigh <= this.current) {
					this.periodHigh = this.current;
				}
			}
		}
	}, {
		key: 'calculatePeriodLow',
		value: function calculatePeriodLow() {
			this.resetCursor();
			if (this.next()) this.periodLow = this.current;
			while (this.next()) {
				if (this.periodLow >= this.current) {
					this.periodLow = this.current;
				}
			}
		}
	}]);
	return FixedSizeLinkedList;
}(LinkedList);

var SD = function (_Indicator9) {
	(0, _inherits3.default)(SD, _Indicator9);

	function SD(input) {
		(0, _classCallCheck3.default)(this, SD);

		var _this10 = (0, _possibleConstructorReturn3.default)(this, (SD.__proto__ || (0, _getPrototypeOf2.default)(SD)).call(this, input));

		var period = input.period;
		var priceArray = input.values;
		var sma$$1 = new SMA({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		_this10.result = [];
		_this10.generator = _regenerator2.default.mark(function _callee6() {
			var tick, mean, currentSet, sd, sum, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;

			return _regenerator2.default.wrap(function _callee6$(_context10) {
				while (1) {
					switch (_context10.prev = _context10.next) {
						case 0:
							currentSet = new FixedSizeLinkedList(period);
							_context10.next = 3;
							return;

						case 3:
							tick = _context10.sent;

						case 4:
							if (!true) {
								_context10.next = 34;
								break;
							}

							currentSet.push(tick);
							mean = sma$$1.nextValue(tick);

							if (!mean) {
								_context10.next = 29;
								break;
							}

							sum = 0;
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context10.prev = 12;

							for (_iterator = (0, _getIterator3.default)(currentSet.iterator()); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								x = _step.value;

								sum = sum + Math.pow(x - mean, 2);
							}
							_context10.next = 20;
							break;

						case 16:
							_context10.prev = 16;
							_context10.t0 = _context10['catch'](12);
							_didIteratorError = true;
							_iteratorError = _context10.t0;

						case 20:
							_context10.prev = 20;
							_context10.prev = 21;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 23:
							_context10.prev = 23;

							if (!_didIteratorError) {
								_context10.next = 26;
								break;
							}

							throw _iteratorError;

						case 26:
							return _context10.finish(23);

						case 27:
							return _context10.finish(20);

						case 28:
							sd = Math.sqrt(sum / period);

						case 29:
							_context10.next = 31;
							return sd;

						case 31:
							tick = _context10.sent;
							_context10.next = 4;
							break;

						case 34:
						case 'end':
							return _context10.stop();
					}
				}
			}, _callee6, this, [[12, 16, 20, 28], [21, , 23, 27]]);
		})();
		_this10.generator.next();
		priceArray.forEach(function (tick) {
			var result = _this10.generator.next(tick);
			if (result.value != undefined) {
				_this10.result.push(_this10.format(result.value));
			}
		});
		return _this10;
	}

	(0, _createClass3.default)(SD, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var nextResult = this.generator.next(price);
			if (nextResult.value != undefined) return this.format(nextResult.value);
		}
	}]);
	return SD;
}(Indicator);

SD.calculate = sd;
function sd(input) {
	Indicator.reverseInputs(input);
	var result = new SD(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var BollingerBands = function (_Indicator10) {
	(0, _inherits3.default)(BollingerBands, _Indicator10);

	function BollingerBands(input) {
		(0, _classCallCheck3.default)(this, BollingerBands);

		var _this11 = (0, _possibleConstructorReturn3.default)(this, (BollingerBands.__proto__ || (0, _getPrototypeOf2.default)(BollingerBands)).call(this, input));

		var period = input.period;
		var priceArray = input.values;
		var stdDev = input.stdDev;
		var format = _this11.format;
		var sma$$1, sd$$1;
		_this11.result = [];
		sma$$1 = new SMA({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		sd$$1 = new SD({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		_this11.generator = _regenerator2.default.mark(function _callee7() {
			var result, tick, calcSMA, calcsd, middle, upper, lower, pb;
			return _regenerator2.default.wrap(function _callee7$(_context11) {
				while (1) {
					switch (_context11.prev = _context11.next) {
						case 0:
							_context11.next = 2;
							return;

						case 2:
							tick = _context11.sent;

						case 3:
							if (!true) {
								_context11.next = 12;
								break;
							}

							calcSMA = sma$$1.nextValue(tick);
							calcsd = sd$$1.nextValue(tick);
							if (calcSMA) {
								middle = format(calcSMA);
								upper = format(calcSMA + calcsd * stdDev);
								lower = format(calcSMA - calcsd * stdDev);
								pb = format((tick - lower) / (upper - lower));

								result = {
									middle: middle,
									upper: upper,
									lower: lower,

								};
							}
							_context11.next = 9;
							return result;

						case 9:
							tick = _context11.sent;
							_context11.next = 3;
							break;

						case 12:
						case 'end':
							return _context11.stop();
					}
				}
			}, _callee7, this);
		})();
		_this11.generator.next();
		priceArray.forEach(function (tick) {
			var result = _this11.generator.next(tick);
			if (result.value != undefined) {
				_this11.result.push(result.value);
			}
		});
		return _this11;
	}

	(0, _createClass3.default)(BollingerBands, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}]);
	return BollingerBands;
}(Indicator);

BollingerBands.calculate = bollingerbands;
function bollingerbands(input) {
	Indicator.reverseInputs(input);
	var result = new BollingerBands(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

//STEP3. Add class based syntax with export

var WilderSmoothing = function (_Indicator11) {
	(0, _inherits3.default)(WilderSmoothing, _Indicator11);

	function WilderSmoothing(input) {
		(0, _classCallCheck3.default)(this, WilderSmoothing);

		var _this12 = (0, _possibleConstructorReturn3.default)(this, (WilderSmoothing.__proto__ || (0, _getPrototypeOf2.default)(WilderSmoothing)).call(this, input));

		_this12.period = input.period;
		_this12.price = input.values;
		var genFn = _regenerator2.default.mark(function genFn(period) {
			var list, sum, counter, current, result;
			return _regenerator2.default.wrap(function genFn$(_context12) {
				while (1) {
					switch (_context12.prev = _context12.next) {
						case 0:
							list = new LinkedList();
							sum = 0;
							counter = 1;
							_context12.next = 5;
							return;

						case 5:
							current = _context12.sent;
							result = 0;

						case 7:
							if (!true) {
								_context12.next = 14;
								break;
							}

							if (counter < period) {
								counter++;
								sum = sum + current;
								result = undefined;
							} else if (counter == period) {
								counter++;
								sum = sum + current;
								result = sum;
							} else {
								result = result - result / period + current;
							}
							_context12.next = 11;
							return result;

						case 11:
							current = _context12.sent;
							_context12.next = 7;
							break;

						case 14:
						case 'end':
							return _context12.stop();
					}
				}
			}, genFn, this);
		});
		_this12.generator = genFn(_this12.period);
		_this12.generator.next();
		_this12.result = [];
		_this12.price.forEach(function (tick) {
			var result = _this12.generator.next(tick);
			if (result.value != undefined) {
				_this12.result.push(_this12.format(result.value));
			}
		});
		return _this12;
	}

	(0, _createClass3.default)(WilderSmoothing, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined) return this.format(result);
		}
	}]);
	return WilderSmoothing;
}(Indicator);

WilderSmoothing.calculate = wildersmoothing;
function wildersmoothing(input) {
	Indicator.reverseInputs(input);
	var result = new WilderSmoothing(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

//STEP 6. Run the tests

var MDM = function (_Indicator12) {
	(0, _inherits3.default)(MDM, _Indicator12);

	function MDM(input) {
		(0, _classCallCheck3.default)(this, MDM);

		var _this13 = (0, _possibleConstructorReturn3.default)(this, (MDM.__proto__ || (0, _getPrototypeOf2.default)(MDM)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var format = _this13.format;
		if (lows.length != highs.length) {
			throw 'Inputs(low,high) not of equal size';
		}
		_this13.result = [];
		_this13.generator = _regenerator2.default.mark(function _callee8() {
			var minusDm, current, last, upMove, downMove;
			return _regenerator2.default.wrap(function _callee8$(_context13) {
				while (1) {
					switch (_context13.prev = _context13.next) {
						case 0:
							_context13.next = 2;
							return;

						case 2:
							current = _context13.sent;

						case 3:
							if (!true) {
								_context13.next = 11;
								break;
							}

							if (last) {
								upMove = current.high - last.high;
								downMove = last.low - current.low;

								minusDm = format(downMove > upMove && downMove > 0 ? downMove : 0);
							}
							last = current;
							_context13.next = 8;
							return minusDm;

						case 8:
							current = _context13.sent;
							_context13.next = 3;
							break;

						case 11:
						case 'end':
							return _context13.stop();
					}
				}
			}, _callee8, this);
		})();
		_this13.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this13.generator.next({
				high: highs[index],
				low: lows[index]
			});
			if (result.value !== undefined) _this13.result.push(result.value);
		});
		return _this13;
	}

	(0, _createClass3.default)(MDM, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}], [{
		key: 'calculate',
		value: function calculate(input) {
			Indicator.reverseInputs(input);
			var result = new MDM(input).result;
			if (input.reversedInput) {
				result.reverse();
			}
			Indicator.reverseInputs(input);
			return result;
		}
	}]);
	return MDM;
}(Indicator);

/**
 * Created by AAravindan on 5/8/16.
 */

var PDM = function (_Indicator13) {
	(0, _inherits3.default)(PDM, _Indicator13);

	function PDM(input) {
		(0, _classCallCheck3.default)(this, PDM);

		var _this14 = (0, _possibleConstructorReturn3.default)(this, (PDM.__proto__ || (0, _getPrototypeOf2.default)(PDM)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var format = _this14.format;
		if (lows.length != highs.length) {
			throw 'Inputs(low,high) not of equal size';
		}
		_this14.result = [];
		_this14.generator = _regenerator2.default.mark(function _callee9() {
			var plusDm, current, last, upMove, downMove;
			return _regenerator2.default.wrap(function _callee9$(_context14) {
				while (1) {
					switch (_context14.prev = _context14.next) {
						case 0:
							_context14.next = 2;
							return;

						case 2:
							current = _context14.sent;

						case 3:
							if (!true) {
								_context14.next = 11;
								break;
							}

							if (last) {
								upMove = current.high - last.high;
								downMove = last.low - current.low;

								plusDm = format(upMove > downMove && upMove > 0 ? upMove : 0);
							}
							last = current;
							_context14.next = 8;
							return plusDm;

						case 8:
							current = _context14.sent;
							_context14.next = 3;
							break;

						case 11:
						case 'end':
							return _context14.stop();
					}
				}
			}, _callee9, this);
		})();
		_this14.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this14.generator.next({
				high: highs[index],
				low: lows[index]
			});
			if (result.value !== undefined) _this14.result.push(result.value);
		});
		return _this14;
	}

	(0, _createClass3.default)(PDM, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}], [{
		key: 'calculate',
		value: function calculate(input) {
			Indicator.reverseInputs(input);
			var result = new PDM(input).result;
			if (input.reversedInput) {
				result.reverse();
			}
			Indicator.reverseInputs(input);
			return result;
		}
	}]);
	return PDM;
}(Indicator);

var TrueRange = function (_Indicator14) {
	(0, _inherits3.default)(TrueRange, _Indicator14);

	function TrueRange(input) {
		(0, _classCallCheck3.default)(this, TrueRange);

		var _this15 = (0, _possibleConstructorReturn3.default)(this, (TrueRange.__proto__ || (0, _getPrototypeOf2.default)(TrueRange)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var closes = input.close;
		var format = _this15.format;
		if (lows.length != highs.length) {
			throw 'Inputs(low,high) not of equal size';
		}
		_this15.result = [];
		_this15.generator = _regenerator2.default.mark(function _callee10() {
			var current, previousClose, result;
			return _regenerator2.default.wrap(function _callee10$(_context15) {
				while (1) {
					switch (_context15.prev = _context15.next) {
						case 0:
							_context15.next = 2;
							return;

						case 2:
							current = _context15.sent;

						case 3:
							if (!true) {
								_context15.next = 17;
								break;
							}

							if (!(previousClose === undefined)) {
								_context15.next = 9;
								break;
							}

							previousClose = current.close;
							_context15.next = 8;
							return result;

						case 8:
							current = _context15.sent;

						case 9:
							result = Math.max(current.high - current.low, isNaN(Math.abs(current.high - previousClose)) ? 0 : Math.abs(current.high - previousClose), isNaN(Math.abs(current.low - previousClose)) ? 0 : Math.abs(current.low - previousClose));
							previousClose = current.close;
							if (result != undefined) {
								result = format(result);
							}
							_context15.next = 14;
							return result;

						case 14:
							current = _context15.sent;
							_context15.next = 3;
							break;

						case 17:
						case 'end':
							return _context15.stop();
					}
				}
			}, _callee10, this);
		})();
		_this15.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this15.generator.next({
				high: highs[index],
				low: lows[index],
				close: closes[index]
			});
			if (result.value != undefined) {
				_this15.result.push(result.value);
			}
		});
		return _this15;
	}

	(0, _createClass3.default)(TrueRange, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}]);
	return TrueRange;
}(Indicator);

TrueRange.calculate = truerange;
function truerange(input) {
	Indicator.reverseInputs(input);
	var result = new TrueRange(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var ADXOutput = function (_IndicatorInput) {
	(0, _inherits3.default)(ADXOutput, _IndicatorInput);

	function ADXOutput() {
		(0, _classCallCheck3.default)(this, ADXOutput);
		return (0, _possibleConstructorReturn3.default)(this, (ADXOutput.__proto__ || (0, _getPrototypeOf2.default)(ADXOutput)).apply(this, arguments));
	}

	return ADXOutput;
}(IndicatorInput);

var ADX = function (_Indicator15) {
	(0, _inherits3.default)(ADX, _Indicator15);

	function ADX(input) {
		(0, _classCallCheck3.default)(this, ADX);

		var _this17 = (0, _possibleConstructorReturn3.default)(this, (ADX.__proto__ || (0, _getPrototypeOf2.default)(ADX)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var closes = input.close;
		var period = input.period;
		var format = _this17.format;
		var plusDM = new PDM({
			high: [],
			low: []
		});
		var minusDM = new MDM({
			high: [],
			low: []
		});
		var emaPDM = new WilderSmoothing({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		var emaMDM = new WilderSmoothing({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		var emaTR = new WilderSmoothing({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		var emaDX = new WEMA({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		var tr = new TrueRange({
			low: [],
			high: [],
			close: []
		});
		if (!(lows.length === highs.length && highs.length === closes.length)) {
			throw 'Inputs(low,high, close) not of equal size';
		}
		_this17.result = [];
		ADXOutput;
		_this17.generator = _regenerator2.default.mark(function _callee11() {
			var tick, index, lastATR, lastAPDM, lastAMDM, lastPDI, lastMDI, lastDX, smoothedDX, calcTr, calcPDM, calcMDM, _lastATR, _lastAPDM, _lastAMDM, diDiff, diSum;

			return _regenerator2.default.wrap(function _callee11$(_context16) {
				while (1) {
					switch (_context16.prev = _context16.next) {
						case 0:
							_context16.next = 2;
							return;

						case 2:
							tick = _context16.sent;
							index = 0;

							lastATR = 0;
							lastAPDM = 0;
							lastAMDM = 0;

						case 7:
							if (!true) {
								_context16.next = 25;
								break;
							}

							calcTr = tr.nextValue(tick);
							calcPDM = plusDM.nextValue(tick);
							calcMDM = minusDM.nextValue(tick);

							if (!(calcTr === undefined)) {
								_context16.next = 16;
								break;
							}

							_context16.next = 14;
							return;

						case 14:
							tick = _context16.sent;
							return _context16.abrupt('continue', 7);

						case 16:
							_lastATR = emaTR.nextValue(calcTr);
							_lastAPDM = emaPDM.nextValue(calcPDM);
							_lastAMDM = emaMDM.nextValue(calcMDM);

							if (_lastATR != undefined && _lastAPDM != undefined && _lastAMDM != undefined) {
								lastPDI = _lastAPDM * 100 / _lastATR;
								lastMDI = _lastAMDM * 100 / _lastATR;
								diDiff = Math.abs(lastPDI - lastMDI);
								diSum = lastPDI + lastMDI;

								lastDX = diDiff / diSum * 100;
								smoothedDX = emaDX.nextValue(lastDX);
								// console.log(tick.high.toFixed(2), tick.low.toFixed(2), tick.close.toFixed(2) , calcTr.toFixed(2), calcPDM.toFixed(2), calcMDM.toFixed(2), lastATR.toFixed(2), lastAPDM.toFixed(2), lastAMDM.toFixed(2), lastPDI.toFixed(2), lastMDI.toFixed(2), diDiff.toFixed(2), diSum.toFixed(2), lastDX.toFixed(2));
							}
							_context16.next = 22;
							return { adx: smoothedDX, pdi: lastPDI, mdi: lastMDI };

						case 22:
							tick = _context16.sent;
							_context16.next = 7;
							break;

						case 25:
						case 'end':
							return _context16.stop();
					}
				}
			}, _callee11, this);
		})();
		_this17.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this17.generator.next({
				high: highs[index],
				low: lows[index],
				close: closes[index]
			});
			if (result.value != undefined && result.value.adx != undefined) {
				_this17.result.push({ adx: format(result.value.adx), pdi: format(result.value.pdi), mdi: format(result.value.mdi) });
			}
		});
		return _this17;
	}

	(0, _createClass3.default)(ADX, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined && result.adx != undefined) {
				return { adx: this.format(result.adx), pdi: this.format(result.pdi), mdi: this.format(result.mdi) };
			}
		}
	}]);
	return ADX;
}(Indicator);

ADX.calculate = adx;
function adx(input) {
	Indicator.reverseInputs(input);
	var result = new ADX(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var ATR = function (_Indicator16) {
	(0, _inherits3.default)(ATR, _Indicator16);

	function ATR(input) {
		(0, _classCallCheck3.default)(this, ATR);

		var _this18 = (0, _possibleConstructorReturn3.default)(this, (ATR.__proto__ || (0, _getPrototypeOf2.default)(ATR)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var closes = input.close;
		var period = input.period;
		var format = _this18.format;
		if (!(lows.length === highs.length && highs.length === closes.length)) {
			throw 'Inputs(low,high, close) not of equal size';
		}
		var trueRange = new TrueRange({
			low: [],
			high: [],
			close: []
		});
		var wema$$1 = new WEMA({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		_this18.result = [];
		_this18.generator = _regenerator2.default.mark(function _callee12() {
			var tick, avgTrueRange, trange;
			return _regenerator2.default.wrap(function _callee12$(_context17) {
				while (1) {
					switch (_context17.prev = _context17.next) {
						case 0:
							_context17.next = 2;
							return;

						case 2:
							tick = _context17.sent;

						case 3:
							if (!true) {
								_context17.next = 11;
								break;
							}

							trange = trueRange.nextValue({
								low: tick.low,
								high: tick.high,
								close: tick.close
							});
							if (trange === undefined) {
								avgTrueRange = undefined;
							} else {
								avgTrueRange = wema$$1.nextValue(trange);
							}
							_context17.next = 8;
							return avgTrueRange;

						case 8:
							tick = _context17.sent;
							_context17.next = 3;
							break;

						case 11:
						case 'end':
							return _context17.stop();
					}
				}
			}, _callee12, this);
		})();
		_this18.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this18.generator.next({
				high: highs[index],
				low: lows[index],
				close: closes[index]
			});
			if (result.value !== undefined) {
				_this18.result.push(format(result.value));
			}
		});
		return _this18;
	}

	(0, _createClass3.default)(ATR, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}]);
	return ATR;
}(Indicator);

ATR.calculate = atr;
function atr(input) {
	Indicator.reverseInputs(input);
	var result = new ATR(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var ROC = function (_Indicator17) {
	(0, _inherits3.default)(ROC, _Indicator17);

	function ROC(input) {
		(0, _classCallCheck3.default)(this, ROC);

		var _this19 = (0, _possibleConstructorReturn3.default)(this, (ROC.__proto__ || (0, _getPrototypeOf2.default)(ROC)).call(this, input));

		var period = input.period;
		var priceArray = input.values;
		_this19.result = [];
		_this19.generator = _regenerator2.default.mark(function _callee13() {
			var index, pastPeriods, tick, roc;
			return _regenerator2.default.wrap(function _callee13$(_context18) {
				while (1) {
					switch (_context18.prev = _context18.next) {
						case 0:
							index = 1;
							pastPeriods = new FixedSizeLinkedList(period);
							_context18.next = 4;
							return;

						case 4:
							tick = _context18.sent;

						case 5:
							if (!true) {
								_context18.next = 13;
								break;
							}

							pastPeriods.push(tick);
							if (index < period) {
								index++;
							} else {
								roc = (tick - pastPeriods.lastShift) / pastPeriods.lastShift * 100;
							}
							_context18.next = 10;
							return roc;

						case 10:
							tick = _context18.sent;
							_context18.next = 5;
							break;

						case 13:
						case 'end':
							return _context18.stop();
					}
				}
			}, _callee13, this);
		})();
		_this19.generator.next();
		priceArray.forEach(function (tick) {
			var result = _this19.generator.next(tick);
			if (result.value != undefined && !isNaN(result.value)) {
				_this19.result.push(_this19.format(result.value));
			}
		});
		return _this19;
	}

	(0, _createClass3.default)(ROC, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var nextResult = this.generator.next(price);
			if (nextResult.value != undefined && !isNaN(nextResult.value)) {
				return this.format(nextResult.value);
			}
		}
	}]);
	return ROC;
}(Indicator);

ROC.calculate = roc;

function roc(input) {
	Indicator.reverseInputs(input);
	var result = new ROC(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var KST = function (_Indicator18) {
	(0, _inherits3.default)(KST, _Indicator18);

	function KST(input) {
		(0, _classCallCheck3.default)(this, KST);

		var _this20 = (0, _possibleConstructorReturn3.default)(this, (KST.__proto__ || (0, _getPrototypeOf2.default)(KST)).call(this, input));

		var priceArray = input.values;
		var rocPer1 = input.ROCPer1;
		var rocPer2 = input.ROCPer2;
		var rocPer3 = input.ROCPer3;
		var rocPer4 = input.ROCPer4;
		var smaPer1 = input.SMAROCPer1;
		var smaPer2 = input.SMAROCPer2;
		var smaPer3 = input.SMAROCPer3;
		var smaPer4 = input.SMAROCPer4;
		var signalPeriod = input.signalPeriod;
		var roc1 = new ROC({ period: rocPer1, values: [] });
		var roc2 = new ROC({ period: rocPer2, values: [] });
		var roc3 = new ROC({ period: rocPer3, values: [] });
		var roc4 = new ROC({ period: rocPer4, values: [] });
		var sma1 = new SMA({
			period: smaPer1, values: [], format: function format(v) {
				return v;
			}
		});
		var sma2 = new SMA({
			period: smaPer2, values: [], format: function format(v) {
				return v;
			}
		});
		var sma3 = new SMA({
			period: smaPer3, values: [], format: function format(v) {
				return v;
			}
		});
		var sma4 = new SMA({
			period: smaPer4, values: [], format: function format(v) {
				return v;
			}
		});
		var signalSMA = new SMA({
			period: signalPeriod, values: [], format: function format(v) {
				return v;
			}
		});
		var format = _this20.format;
		_this20.result = [];
		var firstResult = Math.max(rocPer1 + smaPer1, rocPer2 + smaPer2, rocPer3 + smaPer3, rocPer4 + smaPer4);
		_this20.generator = _regenerator2.default.mark(function _callee14() {
			var index, tick, kst, RCMA1, RCMA2, RCMA3, RCMA4, signal, result, roc1Result, roc2Result, roc3Result, roc4Result;
			return _regenerator2.default.wrap(function _callee14$(_context19) {
				while (1) {
					switch (_context19.prev = _context19.next) {
						case 0:
							index = 1;
							_context19.next = 3;
							return;

						case 3:
							tick = _context19.sent;
							kst = void 0;
							RCMA1 = void 0, RCMA2 = void 0, RCMA3 = void 0, RCMA4 = void 0, signal = void 0, result = void 0;

						case 6:
							if (!true) {
								_context19.next = 23;
								break;
							}

							roc1Result = roc1.nextValue(tick);
							roc2Result = roc2.nextValue(tick);
							roc3Result = roc3.nextValue(tick);
							roc4Result = roc4.nextValue(tick);

							RCMA1 = roc1Result !== undefined ? sma1.nextValue(roc1Result) : undefined;
							RCMA2 = roc2Result !== undefined ? sma2.nextValue(roc2Result) : undefined;
							RCMA3 = roc3Result !== undefined ? sma3.nextValue(roc3Result) : undefined;
							RCMA4 = roc4Result !== undefined ? sma4.nextValue(roc4Result) : undefined;
							if (index < firstResult) {
								index++;
							} else {
								kst = RCMA1 * 1 + RCMA2 * 2 + RCMA3 * 3 + RCMA4 * 4;
							}
							signal = kst !== undefined ? signalSMA.nextValue(kst) : undefined;
							result = kst !== undefined ? {
								kst: format(kst),
								signal: signal ? format(signal) : undefined
							} : undefined;
							_context19.next = 20;
							return result;

						case 20:
							tick = _context19.sent;
							_context19.next = 6;
							break;

						case 23:
						case 'end':
							return _context19.stop();
					}
				}
			}, _callee14, this);
		})();
		_this20.generator.next();
		priceArray.forEach(function (tick) {
			var result = _this20.generator.next(tick);
			if (result.value != undefined) {
				_this20.result.push(result.value);
			}
		});
		return _this20;
	}

	(0, _createClass3.default)(KST, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var nextResult = this.generator.next(price);
			if (nextResult.value != undefined) return nextResult.value;
		}
	}]);
	return KST;
}(Indicator);

KST.calculate = kst;
function kst(input) {
	Indicator.reverseInputs(input);
	var result = new KST(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

/*
  There seems to be a few interpretations of the rules for this regarding which prices.
  I mean the english from which periods are included. The wording does seem to
  introduce some discrepancy so maybe that is why. I want to put the author's
  own description here to reassess this later.
  ----------------------------------------------------------------------------------------
  For the first day of entry the SAR is the previous Significant Point

  If long the SP is the lowest price reached while in the previous short trade
  If short the SP is the highest price reached while in the previous long trade

  If long:
  Find the difference between the highest price made while in the trade and the SAR for today.
  Multiple the difference by the AF and ADD the result to today's SAR to obtain the SAR for tomorrow.
  Use 0.02 for the first AF and increase it by 0.02 on every day that a new high for the trade is made.
  If a new high is not made continue to use the AF as last increased. Do not increase the AF above .20

  Never move the SAR for tomorrow ABOVE the previous day's LOW or today's LOW.
  If the SAR is calculated to be ABOVE the previous day's LOW or today's LOW then use the lower low between today and the previous day as the new SAR.
  Make the next day's calculations based on this SAR.

  If short:
  Find the difference between the lowest price made while in the trade and the SAR for today.
  Multiple the difference by the AF and SUBTRACT the result to today's SAR to obtain the SAR for tomorrow.
  Use 0.02 for the first AF and increase it by 0.02 on every day that a new high for the trade is made.
  If a new high is not made continue to use the AF as last increased. Do not increase the AF above .20

  Never move the SAR for tomorrow BELOW the previous day's HIGH or today's HIGH.
  If the SAR is calculated to be BELOW the previous day's HIGH or today's HIGH then use the higher high between today and the previous day as the new SAR. Make the next day's calculations based on this SAR.
  ----------------------------------------------------------------------------------------
*/

var PSAR = function (_Indicator19) {
	(0, _inherits3.default)(PSAR, _Indicator19);

	function PSAR(input) {
		(0, _classCallCheck3.default)(this, PSAR);

		var _this21 = (0, _possibleConstructorReturn3.default)(this, (PSAR.__proto__ || (0, _getPrototypeOf2.default)(PSAR)).call(this, input));

		var highs = input.high || [];
		var lows = input.low || [];
		var genFn = _regenerator2.default.mark(function genFn(step, max) {
			var curr, extreme, sar, furthest, up, accel, prev;
			return _regenerator2.default.wrap(function genFn$(_context20) {
				while (1) {
					switch (_context20.prev = _context20.next) {
						case 0:
							curr = void 0, extreme = void 0, sar = void 0, furthest = void 0;
							up = true;
							accel = step;
							_context20.next = 5;
							return;

						case 5:
							prev = _context20.sent;

						case 6:
							if (!true) {
								_context20.next = 15;
								break;
							}

							if (curr) {
								sar = sar + accel * (extreme - sar);
								if (up) {
									sar = Math.min(sar, furthest.low, prev.low);
									if (curr.high > extreme) {
										extreme = curr.high;
										accel = Math.min(accel + step, max);
									}
								} else {
									sar = Math.max(sar, furthest.high, prev.high);
									if (curr.low < extreme) {
										extreme = curr.low;
										accel = Math.min(accel + step, max);
									}
								}
								if (up && curr.low < sar || !up && curr.high > sar) {
									accel = step;
									sar = extreme;
									up = !up;
									extreme = !up ? curr.low : curr.high;
								}
							} else {
								// Randomly setup start values? What is the trend on first tick??
								sar = prev.low;
								extreme = prev.high;
							}
							furthest = prev;
							if (curr) prev = curr;
							_context20.next = 12;
							return sar;

						case 12:
							curr = _context20.sent;
							_context20.next = 6;
							break;

						case 15:
						case 'end':
							return _context20.stop();
					}
				}
			}, genFn, this);
		});
		_this21.result = [];
		_this21.generator = genFn(input.step, input.max);
		_this21.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this21.generator.next({
				high: highs[index],
				low: lows[index]
			});
			if (result.value !== undefined) {
				_this21.result.push(result.value);
			}
		});
		return _this21;
	}

	(0, _createClass3.default)(PSAR, [{
		key: 'nextValue',
		value: function nextValue(input) {
			var nextResult = this.generator.next(input);
			if (nextResult.value !== undefined) return nextResult.value;
		}
	}]);
	return PSAR;
}(Indicator);

PSAR.calculate = psar;
function psar(input) {
	Indicator.reverseInputs(input);
	var result = new PSAR(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var Stochastic = function (_Indicator20) {
	(0, _inherits3.default)(Stochastic, _Indicator20);

	function Stochastic(input) {
		(0, _classCallCheck3.default)(this, Stochastic);

		var _this22 = (0, _possibleConstructorReturn3.default)(this, (Stochastic.__proto__ || (0, _getPrototypeOf2.default)(Stochastic)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var closes = input.close;
		var period = input.period;
		var kSignalPeriod = input.kSignalPeriod;
		var dSignalPeriod = input.dSignalPeriod;
		var format = _this22.format;
		if (!(lows.length === highs.length && highs.length === closes.length)) {
			throw 'Inputs(low,high, close) not of equal size';
		}
		_this22.result = [];
		//%K = (Current Close - Lowest Low)/(Highest High - Lowest Low) * 100
		//%D = 3-day SMA of %K
		//
		//Lowest Low = lowest low for the look-back period
		//Highest High = highest high for the look-back period
		//%K is multiplied by 100 to move the decimal point two places
		_this22.generator = _regenerator2.default.mark(function _callee15() {
			var index, pastHighPeriods, pastLowPeriods, kSma, dSma, rsv, k, d, j, tick, periodLow;
			return _regenerator2.default.wrap(function _callee15$(_context21) {
				while (1) {
					switch (_context21.prev = _context21.next) {
						case 0:
							index = 1;
							pastHighPeriods = new FixedSizeLinkedList(period, true, false);
							pastLowPeriods = new FixedSizeLinkedList(period, false, true);
							kSma = new SMA({
								period: kSignalPeriod,
								values: [],
								format: function format(v) {
									return v;
								}
							});
							dSma = new SMA({
								period: dSignalPeriod,
								values: [],
								format: function format(v) {
									return v;
								}
							});
							k = void 0, d = void 0;
							_context21.next = 7;
							return;

						case 7:
							tick = _context21.sent;

						case 8:
							if (!true) {
								_context21.next = 25;
								break;
							}

							pastHighPeriods.push(tick.high);
							pastLowPeriods.push(tick.low);

							if (!(index < period)) {
								_context21.next = 17;
								break;
							}

							index++;
							_context21.next = 15;
							return;

						case 15:
							tick = _context21.sent;
							return _context21.abrupt('continue', 8);

						case 17:
							periodLow = pastLowPeriods.periodLow;
							let gap = pastHighPeriods.periodHigh - periodLow;
							if (gap === 0) {
								rsv = 100;
							} else {
								rsv = (tick.close - periodLow) / gap * 100;
							}
							k = kSma.nextValue(rsv);
							k = k === undefined ? 50 : k;
							d = dSma.nextValue(k);
							_context21.next = 22;
							return {
								k: format(k),
								d: d ? format(d) : undefined,
								j: d ? 3 * format(k) - 2 * format(d) : undefined
							};

						case 22:
							tick = _context21.sent;
							_context21.next = 8;
							break;

						case 25:
						case 'end':
							return _context21.stop();
					}
				}
			}, _callee15, this);
		})();
		_this22.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this22.generator.next({
				high: highs[index],
				low: lows[index],
				close: closes[index]
			});
			if (result.value !== undefined) {
				_this22.result.push(result.value);
			}
		});
		return _this22;
	}

	(0, _createClass3.default)(Stochastic, [{
		key: 'nextValue',
		value: function nextValue(input) {
			var nextResult = this.generator.next(input);
			if (nextResult.value !== undefined) return nextResult.value;
		}
	}]);
	return Stochastic;
}(Indicator);

Stochastic.calculate = stochastic;
function stochastic(input) {
	Indicator.reverseInputs(input);
	var result = new Stochastic(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var WilliamsR = function (_Indicator21) {
	(0, _inherits3.default)(WilliamsR, _Indicator21);

	function WilliamsR(input) {
		(0, _classCallCheck3.default)(this, WilliamsR);

		var _this23 = (0, _possibleConstructorReturn3.default)(this, (WilliamsR.__proto__ || (0, _getPrototypeOf2.default)(WilliamsR)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var closes = input.close;
		var period = input.period;
		var format = _this23.format;
		if (!(lows.length === highs.length && highs.length === closes.length)) {
			throw 'Inputs(low,high, close) not of equal size';
		}
		_this23.result = [];
		//%R = (Highest High - Close)/(Highest High - Lowest Low) * -100
		//Lowest Low = lowest low for the look-back period
		//Highest High = highest high for the look-back period
		//%R is multiplied by -100 correct the inversion and move the decimal.
		_this23.generator = _regenerator2.default.mark(function _callee16() {
			var index, pastHighPeriods, pastLowPeriods, periodLow, periodHigh, tick, williamsR;
			return _regenerator2.default.wrap(function _callee16$(_context22) {
				while (1) {
					switch (_context22.prev = _context22.next) {
						case 0:
							index = 1;
							pastHighPeriods = new FixedSizeLinkedList(period, true, false);
							pastLowPeriods = new FixedSizeLinkedList(period, false, true);
							periodLow = void 0;
							periodHigh = void 0;
							_context22.next = 7;
							return;

						case 7:
							tick = _context22.sent;
							williamsR = void 0;

						case 9:
							if (!true) {
								_context22.next = 26;
								break;
							}

							pastHighPeriods.push(tick.high);
							pastLowPeriods.push(tick.low);

							if (!(index < period)) {
								_context22.next = 18;
								break;
							}

							index++;
							_context22.next = 16;
							return;

						case 16:
							tick = _context22.sent;
							return _context22.abrupt('continue', 9);

						case 18:
							periodLow = pastLowPeriods.periodLow;
							periodHigh = pastHighPeriods.periodHigh;
							williamsR = format((periodHigh - tick.close) / (periodHigh - periodLow) * -100);
							_context22.next = 23;
							return williamsR;

						case 23:
							tick = _context22.sent;
							_context22.next = 9;
							break;

						case 26:
						case 'end':
							return _context22.stop();
					}
				}
			}, _callee16, this);
		})();
		_this23.generator.next();
		lows.forEach(function (low, index) {
			var result = _this23.generator.next({
				high: highs[index],
				low: lows[index],
				close: closes[index]
			});
			if (result.value !== undefined) {
				_this23.result.push(result.value);
			}
		});
		return _this23;
	}

	(0, _createClass3.default)(WilliamsR, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var nextResult = this.generator.next(price);
			if (nextResult.value != undefined) return this.format(nextResult.value);
		}
	}]);
	return WilliamsR;
}(Indicator);

WilliamsR.calculate = williamsr;
function williamsr(input) {
	Indicator.reverseInputs(input);
	var result = new WilliamsR(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

/**
 * Created by AAravindan on 5/17/16.
 */

var ADL = function (_Indicator22) {
	(0, _inherits3.default)(ADL, _Indicator22);

	function ADL(input) {
		(0, _classCallCheck3.default)(this, ADL);

		var _this24 = (0, _possibleConstructorReturn3.default)(this, (ADL.__proto__ || (0, _getPrototypeOf2.default)(ADL)).call(this, input));

		var highs = input.high;
		var lows = input.low;
		var closes = input.close;
		var volumes = input.volume;
		if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
			throw 'Inputs(low,high, close, volumes) not of equal size';
		}
		_this24.result = [];
		_this24.generator = _regenerator2.default.mark(function _callee17() {
			var result, tick, moneyFlowMultiplier, moneyFlowVolume;
			return _regenerator2.default.wrap(function _callee17$(_context23) {
				while (1) {
					switch (_context23.prev = _context23.next) {
						case 0:
							result = 0;
							_context23.next = 3;
							return;

						case 3:
							tick = _context23.sent;

						case 4:
							if (!true) {
								_context23.next = 13;
								break;
							}

							moneyFlowMultiplier = (tick.close - tick.low - (tick.high - tick.close)) / (tick.high - tick.low);
							moneyFlowVolume = moneyFlowMultiplier * tick.volume;

							result = result + moneyFlowVolume;
							_context23.next = 10;
							return Math.round(result);

						case 10:
							tick = _context23.sent;
							_context23.next = 4;
							break;

						case 13:
						case 'end':
							return _context23.stop();
					}
				}
			}, _callee17, this);
		})();
		_this24.generator.next();
		highs.forEach(function (tickHigh, index) {
			var tickInput = {
				high: tickHigh,
				low: lows[index],
				close: closes[index],
				volume: volumes[index]
			};
			var result = _this24.generator.next(tickInput);
			if (result.value != undefined) {
				_this24.result.push(result.value);
			}
		});
		return _this24;
	}

	(0, _createClass3.default)(ADL, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}]);
	return ADL;
}(Indicator);

ADL.calculate = adl;
function adl(input) {
	Indicator.reverseInputs(input);
	var result = new ADL(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var OBV = function (_Indicator23) {
	(0, _inherits3.default)(OBV, _Indicator23);

	function OBV(input) {
		(0, _classCallCheck3.default)(this, OBV);

		var _this25 = (0, _possibleConstructorReturn3.default)(this, (OBV.__proto__ || (0, _getPrototypeOf2.default)(OBV)).call(this, input));

		var closes = input.close;
		var volumes = input.volume;
		_this25.result = [];
		_this25.generator = _regenerator2.default.mark(function _callee18() {
			var result, tick, lastClose;
			return _regenerator2.default.wrap(function _callee18$(_context24) {
				while (1) {
					switch (_context24.prev = _context24.next) {
						case 0:
							result = 0;
							_context24.next = 3;
							return;

						case 3:
							tick = _context24.sent;

							if (!(tick.close && typeof tick.close === 'number')) {
								_context24.next = 9;
								break;
							}

							lastClose = tick.close;
							_context24.next = 8;
							return;

						case 8:
							tick = _context24.sent;

						case 9:
							if (!true) {
								_context24.next = 17;
								break;
							}

							if (lastClose < tick.close) {
								result = result + tick.volume;
							} else if (tick.close < lastClose) {
								result = result - tick.volume;
							}
							lastClose = tick.close;
							_context24.next = 14;
							return result;

						case 14:
							tick = _context24.sent;
							_context24.next = 9;
							break;

						case 17:
						case 'end':
							return _context24.stop();
					}
				}
			}, _callee18, this);
		})();
		_this25.generator.next();
		closes.forEach(function (close, index) {
			var tickInput = {
				close: closes[index],
				volume: volumes[index]
			};
			var result = _this25.generator.next(tickInput);
			if (result.value != undefined) {
				_this25.result.push(result.value);
			}
		});
		return _this25;
	}

	(0, _createClass3.default)(OBV, [{
		key: 'nextValue',
		value: function nextValue(price) {
			return this.generator.next(price).value;
		}
	}]);
	return OBV;
}(Indicator);

OBV.calculate = obv;
function obv(input) {
	Indicator.reverseInputs(input);
	var result = new OBV(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

/**
 * Created by AAravindan on 5/9/16.
 */

var TRIX = function (_Indicator24) {
	(0, _inherits3.default)(TRIX, _Indicator24);

	function TRIX(input) {
		(0, _classCallCheck3.default)(this, TRIX);

		var _this26 = (0, _possibleConstructorReturn3.default)(this, (TRIX.__proto__ || (0, _getPrototypeOf2.default)(TRIX)).call(this, input));

		var priceArray = input.values;
		var period = input.period;
		var format = _this26.format;
		var ema$$1 = new EMA({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		var emaOfema = new EMA({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		var emaOfemaOfema = new EMA({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		var trixROC = new ROC({
			period: 1, values: [], format: function format(v) {
				return v;
			}
		});
		_this26.result = [];
		_this26.generator = _regenerator2.default.mark(function _callee19() {
			var tick, initialema, smoothedResult, doubleSmoothedResult, result;
			return _regenerator2.default.wrap(function _callee19$(_context25) {
				while (1) {
					switch (_context25.prev = _context25.next) {
						case 0:
							_context25.next = 2;
							return;

						case 2:
							tick = _context25.sent;

						case 3:
							if (!true) {
								_context25.next = 13;
								break;
							}

							initialema = ema$$1.nextValue(tick);
							smoothedResult = initialema ? emaOfema.nextValue(initialema) : undefined;
							doubleSmoothedResult = smoothedResult ? emaOfemaOfema.nextValue(smoothedResult) : undefined;
							result = doubleSmoothedResult ? trixROC.nextValue(doubleSmoothedResult) : undefined;
							_context25.next = 10;
							return result ? format(result) : undefined;

						case 10:
							tick = _context25.sent;
							_context25.next = 3;
							break;

						case 13:
						case 'end':
							return _context25.stop();
					}
				}
			}, _callee19, this);
		})();
		_this26.generator.next();
		priceArray.forEach(function (tick) {
			var result = _this26.generator.next(tick);
			if (result.value !== undefined) {
				_this26.result.push(result.value);
			}
		});
		return _this26;
	}

	(0, _createClass3.default)(TRIX, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var nextResult = this.generator.next(price);
			if (nextResult.value !== undefined) return nextResult.value;
		}
	}]);
	return TRIX;
}(Indicator);

TRIX.calculate = trix;
function trix(input) {
	Indicator.reverseInputs(input);
	var result = new TRIX(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var ForceIndex = function (_Indicator25) {
	(0, _inherits3.default)(ForceIndex, _Indicator25);

	function ForceIndex(input) {
		(0, _classCallCheck3.default)(this, ForceIndex);

		var _this27 = (0, _possibleConstructorReturn3.default)(this, (ForceIndex.__proto__ || (0, _getPrototypeOf2.default)(ForceIndex)).call(this, input));

		var closes = input.close;
		var volumes = input.volume;
		var period = input.period || 1;
		if (!(volumes.length === closes.length)) {
			throw 'Inputs(volume, close) not of equal size';
		}
		var emaForceIndex = new EMA({ values: [], period: period });
		_this27.result = [];
		_this27.generator = _regenerator2.default.mark(function _callee20() {
			var previousTick, tick, forceIndex;
			return _regenerator2.default.wrap(function _callee20$(_context26) {
				while (1) {
					switch (_context26.prev = _context26.next) {
						case 0:
							_context26.next = 2;
							return;

						case 2:
							previousTick = _context26.sent;
							_context26.next = 5;
							return;

						case 5:
							tick = _context26.sent;
							forceIndex = void 0;

						case 7:
							if (!true) {
								_context26.next = 15;
								break;
							}

							forceIndex = (tick.close - previousTick.close) * tick.volume;
							previousTick = tick;
							_context26.next = 12;
							return emaForceIndex.nextValue(forceIndex);

						case 12:
							tick = _context26.sent;
							_context26.next = 7;
							break;

						case 15:
						case 'end':
							return _context26.stop();
					}
				}
			}, _callee20, this);
		})();
		_this27.generator.next();
		volumes.forEach(function (tick, index) {
			var result = _this27.generator.next({
				close: closes[index],
				volume: volumes[index]
			});
			if (result.value != undefined) {
				_this27.result.push(result.value);
			}
		});
		return _this27;
	}

	(0, _createClass3.default)(ForceIndex, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined) {
				return result;
			}
		}
	}]);
	return ForceIndex;
}(Indicator);

ForceIndex.calculate = forceindex;
function forceindex(input) {
	Indicator.reverseInputs(input);
	var result = new ForceIndex(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var CCI = function (_Indicator26) {
	(0, _inherits3.default)(CCI, _Indicator26);

	function CCI(input) {
		(0, _classCallCheck3.default)(this, CCI);

		var _this28 = (0, _possibleConstructorReturn3.default)(this, (CCI.__proto__ || (0, _getPrototypeOf2.default)(CCI)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var closes = input.close;
		var period = input.period;
		var format = _this28.format;
		var constant = .015;
		var currentTpSet = new FixedSizeLinkedList(period);

		var tpSMACalculator = new SMA({
			period: period, values: [], format: function format(v) {
				return v;
			}
		});
		if (!(lows.length === highs.length && highs.length === closes.length)) {
			throw 'Inputs(low,high, close) not of equal size';
		}
		_this28.result = [];
		_this28.generator = _regenerator2.default.mark(function _callee21() {
			var tick, tp, smaTp, meanDeviation, _cci, sum, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, x;

			return _regenerator2.default.wrap(function _callee21$(_context27) {
				while (1) {
					switch (_context27.prev = _context27.next) {
						case 0:
							_context27.next = 2;
							return;

						case 2:
							tick = _context27.sent;

						case 3:
							if (!true) {
								_context27.next = 37;
								break;
							}

							tp = (tick.high + tick.low + tick.close) / 3;

							currentTpSet.push(tp);
							smaTp = tpSMACalculator.nextValue(tp);
							meanDeviation = null;
							_cci = void 0;
							sum = 0;

							if (!(smaTp != undefined)) {
								_context27.next = 32;
								break;
							}

							//First, subtract the most recent 20-period average of the typical price from each period's typical price. 
							//Second, take the absolute values of these numbers.
							//Third,sum the absolute values. 
							_iteratorNormalCompletion2 = true;
							_didIteratorError2 = false;
							_iteratorError2 = undefined;
							_context27.prev = 14;
							for (_iterator2 = (0, _getIterator3.default)(currentTpSet.iterator()); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								x = _step2.value;

								sum = sum + Math.abs(x - smaTp);
							}
							//Fourth, divide by the total number of periods (20). 
							_context27.next = 22;
							break;

						case 18:
							_context27.prev = 18;
							_context27.t0 = _context27['catch'](14);
							_didIteratorError2 = true;
							_iteratorError2 = _context27.t0;

						case 22:
							_context27.prev = 22;
							_context27.prev = 23;

							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}

						case 25:
							_context27.prev = 25;

							if (!_didIteratorError2) {
								_context27.next = 28;
								break;
							}

							throw _iteratorError2;

						case 28:
							return _context27.finish(25);

						case 29:
							return _context27.finish(22);

						case 30:
							meanDeviation = sum / 20;
							_cci = (tp - smaTp) / (constant * meanDeviation);

						case 32:
							_context27.next = 34;
							return _cci;

						case 34:
							tick = _context27.sent;
							_context27.next = 3;
							break;

						case 37:
						case 'end':
							return _context27.stop();
					}
				}
			}, _callee21, this, [[14, 18, 22, 30], [23, , 25, 29]]);
		})();
		_this28.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this28.generator.next({
				high: highs[index],
				low: lows[index],
				close: closes[index]
			});
			if (result.value != undefined) {
				_this28.result.push(result.value);
			}
		});
		return _this28;
	}

	(0, _createClass3.default)(CCI, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined) {
				return result;
			}
		}
	}]);
	return CCI;
}(Indicator);

CCI.calculate = cci;
function cci(input) {
	Indicator.reverseInputs(input);
	var result = new CCI(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var VWAP = function (_Indicator27) {
	(0, _inherits3.default)(VWAP, _Indicator27);

	function VWAP(input) {
		(0, _classCallCheck3.default)(this, VWAP);

		var _this29 = (0, _possibleConstructorReturn3.default)(this, (VWAP.__proto__ || (0, _getPrototypeOf2.default)(VWAP)).call(this, input));

		var lows = input.low;
		var highs = input.high;
		var closes = input.close;
		var volumes = input.volume;
		var period = input.period;
		var format = _this29.format;
		if (!(lows.length === highs.length && highs.length === closes.length)) {
			throw 'Inputs(low,high, close) not of equal size';
		}
		_this29.result = [];
		_this29.generator = _regenerator2.default.mark(function _callee22() {
			var tick, cumulativeTotal, cumulativeVolume, vwap, typicalPrice, total;
			return _regenerator2.default.wrap(function _callee22$(_context28) {
				while (1) {
					switch (_context28.prev = _context28.next) {
						case 0:
							_context28.next = 2;
							return;

						case 2:
							tick = _context28.sent;
							cumulativeTotal = 0;
							cumulativeVolume = 0;
							vwap = void 0;

						case 6:
							if (!true) {
								_context28.next = 16;
								break;
							}

							typicalPrice = (tick.high + tick.low + tick.close) / 3;
							total = tick.volume * typicalPrice;

							cumulativeTotal = cumulativeTotal + total;
							cumulativeVolume = cumulativeVolume + tick.volume;
							_context28.next = 13;
							return cumulativeTotal / cumulativeVolume;

						case 13:
							tick = _context28.sent;
							_context28.next = 6;
							break;

						case 16:
						case 'end':
							return _context28.stop();
					}
				}
			}, _callee22, this);
		})();
		_this29.generator.next();
		lows.forEach(function (tick, index) {
			var result = _this29.generator.next({
				high: highs[index],
				low: lows[index],
				close: closes[index],
				volume: volumes[index]
			});
			if (result.value != undefined) {
				_this29.result.push(result.value);
			}
		});
		return _this29;
	}

	(0, _createClass3.default)(VWAP, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			if (result != undefined) {
				return result;
			}
		}
	}]);
	return VWAP;
}(Indicator);

VWAP.calculate = vwap;
function vwap(input) {
	Indicator.reverseInputs(input);
	var result = new VWAP(input).result;
	if (input.reversedInput) {
		result.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var CandleList = function CandleList() {
	(0, _classCallCheck3.default)(this, CandleList);

	this.open = [];
	this.high = [];
	this.low = [];
	this.close = [];
	this.volume = [];
	this.timestamp = [];
};

/**
 * Created by AAravindan on 5/4/16.
 */

var Renko = function (_Indicator28) {
	(0, _inherits3.default)(Renko, _Indicator28);

	function Renko(input) {
		(0, _classCallCheck3.default)(this, Renko);

		var _this30 = (0, _possibleConstructorReturn3.default)(this, (Renko.__proto__ || (0, _getPrototypeOf2.default)(Renko)).call(this, input));

		var format = _this30.format;
		var useATR = input.useATR;
		var brickSize = input.brickSize || 0;
		if (useATR) {
			var atrResult = atr((0, _assign2.default)({}, input));
			brickSize = atrResult[atrResult.length - 1];
		}
		_this30.result = new CandleList();

		if (brickSize === 0) {
			console.error('Not enough data to calculate brickSize for renko when using ATR');
			return (0, _possibleConstructorReturn3.default)(_this30);
		}
		var lastOpen = 0;
		var lastHigh = 0;
		var lastLow = Infinity;
		var lastClose = 0;
		var lastVolume = 0;
		var lastTimestamp = 0;
		_this30.generator = _regenerator2.default.mark(function _callee23() {
			var candleData, absoluteMovementFromClose, absoluteMovementFromOpen, reference, calculated;
			return _regenerator2.default.wrap(function _callee23$(_context29) {
				while (1) {
					switch (_context29.prev = _context29.next) {
						case 0:
							_context29.next = 2;
							return;

						case 2:
							candleData = _context29.sent;

						case 3:
							if (!true) {
								_context29.next = 39;
								break;
							}

							if (!(lastOpen === 0)) {
								_context29.next = 15;
								break;
							}

							lastOpen = candleData.close;
							lastHigh = candleData.high;
							lastLow = candleData.low;
							lastClose = candleData.close;
							lastVolume = candleData.volume;
							lastTimestamp = candleData.timestamp;
							_context29.next = 13;
							return;

						case 13:
							candleData = _context29.sent;
							return _context29.abrupt('continue', 3);

						case 15:
							absoluteMovementFromClose = Math.abs(candleData.close - lastClose);
							absoluteMovementFromOpen = Math.abs(candleData.close - lastOpen);

							if (!(absoluteMovementFromClose >= brickSize && absoluteMovementFromOpen >= brickSize)) {
								_context29.next = 30;
								break;
							}

							reference = absoluteMovementFromClose > absoluteMovementFromOpen ? lastOpen : lastClose;
							calculated = {
								open: reference,
								high: lastHigh > candleData.high ? lastHigh : candleData.high,
								low: lastLow < candleData.Low ? lastLow : candleData.low,
								close: reference > candleData.close ? reference - brickSize : reference + brickSize,
								volume: lastVolume + candleData.volume,
								timestamp: candleData.timestamp
							};

							lastOpen = calculated.open;
							lastHigh = calculated.close;
							lastLow = calculated.close;
							lastClose = calculated.close;
							lastVolume = 0;
							_context29.next = 27;
							return calculated;

						case 27:
							candleData = _context29.sent;
							_context29.next = 37;
							break;

						case 30:
							lastHigh = lastHigh > candleData.high ? lastHigh : candleData.high;
							lastLow = lastLow < candleData.Low ? lastLow : candleData.low;
							lastVolume = lastVolume + candleData.volume;
							lastTimestamp = candleData.timestamp;
							_context29.next = 36;
							return;

						case 36:
							candleData = _context29.sent;

						case 37:
							_context29.next = 3;
							break;

						case 39:
						case 'end':
							return _context29.stop();
					}
				}
			}, _callee23, this);
		})();
		_this30.generator.next();
		input.low.forEach(function (tick, index) {
			var result = _this30.generator.next({
				open: input.open[index],
				high: input.high[index],
				low: input.low[index],
				close: input.close[index],
				volume: input.volume[index],
				timestamp: input.timestamp[index]
			});
			if (result.value) {
				_this30.result.open.push(result.value.open);
				_this30.result.high.push(result.value.high);
				_this30.result.low.push(result.value.low);
				_this30.result.close.push(result.value.close);
				_this30.result.volume.push(result.value.volume);
				_this30.result.timestamp.push(result.value.timestamp);
			}
		});
		return _this30;
	}

	(0, _createClass3.default)(Renko, [{
		key: 'nextValue',
		value: function nextValue(price) {
			console.error('Cannot calculate next value on Renko, Every value has to be recomputed for every change, use calcualte method');
			return null;
		}
	}]);
	return Renko;
}(Indicator);

Renko.calculate = renko;
function renko(input) {
	Indicator.reverseInputs(input);
	var result = new Renko(input).result;
	if (input.reversedInput) {
		result.open.reverse();
		result.high.reverse();
		result.low.reverse();
		result.close.reverse();
		result.volume.reverse();
		result.timestamp.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

/**
 * Created by AAravindan on 5/4/16.
 */

var HeikinAshi = function (_Indicator29) {
	(0, _inherits3.default)(HeikinAshi, _Indicator29);

	function HeikinAshi(input) {
		(0, _classCallCheck3.default)(this, HeikinAshi);

		var _this31 = (0, _possibleConstructorReturn3.default)(this, (HeikinAshi.__proto__ || (0, _getPrototypeOf2.default)(HeikinAshi)).call(this, input));

		var format = _this31.format;
		_this31.result = new CandleList();
		var lastOpen = null;
		var lastHigh = 0;
		var lastLow = Infinity;
		var lastClose = 0;
		var lastVolume = 0;
		var lastTimestamp = 0;
		_this31.generator = _regenerator2.default.mark(function _callee24() {
			var candleData, calculated, newClose, newOpen, newHigh, newLow;
			return _regenerator2.default.wrap(function _callee24$(_context30) {
				while (1) {
					switch (_context30.prev = _context30.next) {
						case 0:
							_context30.next = 2;
							return;

						case 2:
							candleData = _context30.sent;
							calculated = null;

						case 4:
							if (!true) {
								_context30.next = 11;
								break;
							}

							if (lastOpen === null) {
								lastOpen = (candleData.close + candleData.open) / 2;
								lastHigh = candleData.high;
								lastLow = candleData.low;
								lastClose = (candleData.close + candleData.open + candleData.high + candleData.low) / 4;
								lastVolume = candleData.volume || 0;
								lastTimestamp = candleData.timestamp || 0;
								calculated = {
									open: lastOpen,
									high: lastHigh,
									low: lastLow,
									close: lastClose,
									volume: candleData.volume || 0,
									timestamp: candleData.timestamp || 0
								};
							} else {
								newClose = (candleData.close + candleData.open + candleData.high + candleData.low) / 4;
								newOpen = (lastOpen + lastClose) / 2;
								newHigh = Math.max(newOpen, newClose, candleData.high);
								newLow = Math.min(candleData.low, newOpen, newClose);

								calculated = {
									close: newClose,
									open: newOpen,
									high: newHigh,
									low: newLow,
									volume: candleData.volume || 0,
									timestamp: candleData.timestamp || 0
								};
								lastClose = newClose;
								lastOpen = newOpen;
								lastHigh = newHigh;
								lastLow = newLow;
							}
							_context30.next = 8;
							return calculated;

						case 8:
							candleData = _context30.sent;
							_context30.next = 4;
							break;

						case 11:
						case 'end':
							return _context30.stop();
					}
				}
			}, _callee24, this);
		})();
		_this31.generator.next();
		input.low.forEach(function (tick, index) {
			var result = _this31.generator.next({
				open: input.open[index],
				high: input.high[index],
				low: input.low[index],
				close: input.close[index],
				volume: input.volume ? input.volume[index] : input.volume,
				timestamp: input.timestamp ? input.timestamp[index] : input.timestamp
			});
			if (result.value) {
				_this31.result.open.push(result.value.open);
				_this31.result.high.push(result.value.high);
				_this31.result.low.push(result.value.low);
				_this31.result.close.push(result.value.close);
				_this31.result.volume.push(result.value.volume);
				_this31.result.timestamp.push(result.value.timestamp);
			}
		});
		return _this31;
	}

	(0, _createClass3.default)(HeikinAshi, [{
		key: 'nextValue',
		value: function nextValue(price) {
			var result = this.generator.next(price).value;
			return result;
		}
	}]);
	return HeikinAshi;
}(Indicator);

HeikinAshi.calculate = heikinashi;
function heikinashi(input) {
	Indicator.reverseInputs(input);
	var result = new HeikinAshi(input).result;
	if (input.reversedInput) {
		result.open.reverse();
		result.high.reverse();
		result.low.reverse();
		result.close.reverse();
		result.volume.reverse();
		result.timestamp.reverse();
	}
	Indicator.reverseInputs(input);
	return result;
}

var CandlestickFinder = function () {
	function CandlestickFinder() {
		// if (new.target === Abstract) {
		//     throw new TypeError("Abstract class");
		// }

		(0, _classCallCheck3.default)(this, CandlestickFinder);
	}

	(0, _createClass3.default)(CandlestickFinder, [{
		key: 'approximateEqual',
		value: function approximateEqual(a, b) {
			var left = parseFloat(Math.abs(a - b).toPrecision(4)) * 1;
			var right = parseFloat((a * 0.001).toPrecision(4)) * 1;
			return left <= right;
		}
	}, {
		key: 'logic',
		value: function logic(data) {
			throw "this has to be implemented";
		}
	}, {
		key: 'getAllPatternIndex',
		value: function getAllPatternIndex(data) {
			var _this32 = this;

			if (data.close.length < this.requiredCount) {
				console.warn('Data count less than data required for the strategy ', this.name);
				return [];
			}
			if (data.reversedInput) {
				data.open.reverse();
				data.high.reverse();
				data.low.reverse();
				data.close.reverse();
			}
			var strategyFn = this.logic;
			return this._generateDataForCandleStick(data).map(function (current, index) {
				return strategyFn.call(_this32, current) ? index : undefined;
			}).filter(function (hasIndex) {
				return hasIndex;
			});
		}
	}, {
		key: 'hasPattern',
		value: function hasPattern(data) {
			if (data.close.length < this.requiredCount) {
				console.warn('Data count less than data required for the strategy ', this.name);
				return false;
			}
			if (data.reversedInput) {
				data.open.reverse();
				data.high.reverse();
				data.low.reverse();
				data.close.reverse();
			}
			var strategyFn = this.logic;
			return strategyFn.call(this, this._getLastDataForCandleStick(data));
		}
	}, {
		key: '_getLastDataForCandleStick',
		value: function _getLastDataForCandleStick(data) {
			var requiredCount = this.requiredCount;
			if (data.close.length === requiredCount) {
				return data;
			} else {
				var returnVal = {
					open: [],
					high: [],
					low: [],
					close: []
				};
				var i = 0;
				var index = data.close.length - requiredCount;
				while (i < requiredCount) {
					returnVal.open.push(data.open[index + i]);
					returnVal.high.push(data.high[index + i]);
					returnVal.low.push(data.low[index + i]);
					returnVal.close.push(data.close[index + i]);
					i++;
				}
				return returnVal;
			}
		}
	}, {
		key: '_generateDataForCandleStick',
		value: function _generateDataForCandleStick(data) {
			var requiredCount = this.requiredCount;
			var generatedData = data.close.map(function (currentData, index) {
				var i = 0;
				var returnVal = {
					open: [],
					high: [],
					low: [],
					close: []
				};
				while (i < requiredCount) {
					returnVal.open.push(data.open[index + i]);
					returnVal.high.push(data.high[index + i]);
					returnVal.low.push(data.low[index + i]);
					returnVal.close.push(data.close[index + i]);
					i++;
				}
				return returnVal;
			}).filter(function (val, index) {
				return index <= data.close.length - requiredCount;
			});
			return generatedData;
		}
	}]);
	return CandlestickFinder;
}();

var MorningStar = function (_CandlestickFinder) {
	(0, _inherits3.default)(MorningStar, _CandlestickFinder);

	function MorningStar() {
		(0, _classCallCheck3.default)(this, MorningStar);

		var _this33 = (0, _possibleConstructorReturn3.default)(this, (MorningStar.__proto__ || (0, _getPrototypeOf2.default)(MorningStar)).call(this));

		_this33.name = 'MorningStar';
		_this33.requiredCount = 3;
		return _this33;
	}

	(0, _createClass3.default)(MorningStar, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var thirddaysOpen = data.open[2];
			var thirddaysClose = data.close[2];
			var thirddaysHigh = data.high[2];
			var thirddaysLow = data.low[2];
			var firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
			var isFirstBearish = firstdaysClose < firstdaysOpen;
			var isSmallBodyExists = firstdaysLow > seconddaysLow && firstdaysLow > seconddaysHigh;
			var isThirdBullish = thirddaysOpen < thirddaysClose;
			var gapExists = seconddaysHigh < firstdaysLow && seconddaysLow < firstdaysLow && thirddaysOpen > seconddaysHigh && seconddaysClose < thirddaysOpen;
			var doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;
			return isFirstBearish && isSmallBodyExists && gapExists && isThirdBullish && doesCloseAboveFirstMidpoint;
		}
	}]);
	return MorningStar;
}(CandlestickFinder);

function morningstar(data) {
	return new MorningStar().hasPattern(data);
}

var BullishEngulfingPattern = function (_CandlestickFinder2) {
	(0, _inherits3.default)(BullishEngulfingPattern, _CandlestickFinder2);

	function BullishEngulfingPattern() {
		(0, _classCallCheck3.default)(this, BullishEngulfingPattern);

		var _this34 = (0, _possibleConstructorReturn3.default)(this, (BullishEngulfingPattern.__proto__ || (0, _getPrototypeOf2.default)(BullishEngulfingPattern)).call(this));

		_this34.name = 'BullishEngulfingPattern';
		_this34.requiredCount = 2;
		return _this34;
	}

	(0, _createClass3.default)(BullishEngulfingPattern, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var isBullishEngulfing = firstdaysClose < firstdaysOpen && firstdaysOpen > seconddaysOpen && firstdaysClose > seconddaysOpen && firstdaysOpen < seconddaysClose;
			return isBullishEngulfing;
		}
	}]);
	return BullishEngulfingPattern;
}(CandlestickFinder);

function bullishengulfingpattern(data) {
	return new BullishEngulfingPattern().hasPattern(data);
}

var BullishHarami = function (_CandlestickFinder3) {
	(0, _inherits3.default)(BullishHarami, _CandlestickFinder3);

	function BullishHarami() {
		(0, _classCallCheck3.default)(this, BullishHarami);

		var _this35 = (0, _possibleConstructorReturn3.default)(this, (BullishHarami.__proto__ || (0, _getPrototypeOf2.default)(BullishHarami)).call(this));

		_this35.requiredCount = 2;
		_this35.name = "BullishHarami";
		return _this35;
	}

	(0, _createClass3.default)(BullishHarami, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var isBullishHaramiPattern = firstdaysOpen < seconddaysOpen && firstdaysClose > seconddaysOpen && firstdaysClose > seconddaysClose && firstdaysOpen < seconddaysLow && firstdaysHigh > seconddaysHigh;
			return isBullishHaramiPattern;
		}
	}]);
	return BullishHarami;
}(CandlestickFinder);

function bullishharami(data) {
	return new BullishHarami().hasPattern(data);
}

var BullishHaramiCross = function (_CandlestickFinder4) {
	(0, _inherits3.default)(BullishHaramiCross, _CandlestickFinder4);

	function BullishHaramiCross() {
		(0, _classCallCheck3.default)(this, BullishHaramiCross);

		var _this36 = (0, _possibleConstructorReturn3.default)(this, (BullishHaramiCross.__proto__ || (0, _getPrototypeOf2.default)(BullishHaramiCross)).call(this));

		_this36.requiredCount = 2;
		_this36.name = 'BullishHaramiCross';
		return _this36;
	}

	(0, _createClass3.default)(BullishHaramiCross, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var isBullishHaramiCrossPattern = firstdaysOpen < seconddaysOpen && firstdaysClose > seconddaysOpen && firstdaysClose > seconddaysClose && firstdaysOpen < seconddaysLow && firstdaysHigh > seconddaysHigh;
			var isSecondDayDoji = this.approximateEqual(seconddaysOpen, seconddaysClose);
			return isBullishHaramiCrossPattern && isSecondDayDoji;
		}
	}]);
	return BullishHaramiCross;
}(CandlestickFinder);

function bullishharamicross(data) {
	return new BullishHaramiCross().hasPattern(data);
}

var Doji = function (_CandlestickFinder5) {
	(0, _inherits3.default)(Doji, _CandlestickFinder5);

	function Doji() {
		(0, _classCallCheck3.default)(this, Doji);

		var _this37 = (0, _possibleConstructorReturn3.default)(this, (Doji.__proto__ || (0, _getPrototypeOf2.default)(Doji)).call(this));

		_this37.name = 'Doji';
		_this37.requiredCount = 1;
		return _this37;
	}

	(0, _createClass3.default)(Doji, [{
		key: 'logic',
		value: function logic(data) {
			var daysOpen = data.open[0];
			var daysClose = data.close[0];
			return this.approximateEqual(daysOpen, daysClose);
		}
	}]);
	return Doji;
}(CandlestickFinder);

function doji(data) {
	return new Doji().hasPattern(data);
}

var MorningDojiStar = function (_CandlestickFinder6) {
	(0, _inherits3.default)(MorningDojiStar, _CandlestickFinder6);

	function MorningDojiStar() {
		(0, _classCallCheck3.default)(this, MorningDojiStar);

		var _this38 = (0, _possibleConstructorReturn3.default)(this, (MorningDojiStar.__proto__ || (0, _getPrototypeOf2.default)(MorningDojiStar)).call(this));

		_this38.name = 'MorningDojiStar';
		_this38.requiredCount = 3;
		return _this38;
	}

	(0, _createClass3.default)(MorningDojiStar, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var thirddaysOpen = data.open[2];
			var thirddaysClose = data.close[2];
			var thirddaysHigh = data.high[2];
			var thirddaysLow = data.low[2];
			var firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
			var isFirstBearish = firstdaysClose < firstdaysOpen;
			var dojiExists = new Doji().hasPattern({
				"open": [seconddaysOpen],
				"close": [seconddaysClose],
				"high": [seconddaysHigh],
				"low": [seconddaysLow]
			});
			var isThirdBullish = thirddaysOpen < thirddaysClose;
			var gapExists = seconddaysHigh < firstdaysLow && seconddaysLow < firstdaysLow && thirddaysOpen > seconddaysHigh && seconddaysClose < thirddaysOpen;
			var doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;
			return isFirstBearish && dojiExists && isThirdBullish && gapExists && doesCloseAboveFirstMidpoint;
		}
	}]);
	return MorningDojiStar;
}(CandlestickFinder);

function morningdojistar(data) {
	return new MorningDojiStar().hasPattern(data);
}

var DownsideTasukiGap = function (_CandlestickFinder7) {
	(0, _inherits3.default)(DownsideTasukiGap, _CandlestickFinder7);

	function DownsideTasukiGap() {
		(0, _classCallCheck3.default)(this, DownsideTasukiGap);

		var _this39 = (0, _possibleConstructorReturn3.default)(this, (DownsideTasukiGap.__proto__ || (0, _getPrototypeOf2.default)(DownsideTasukiGap)).call(this));

		_this39.requiredCount = 3;
		_this39.name = 'DownsideTasukiGap';
		return _this39;
	}

	(0, _createClass3.default)(DownsideTasukiGap, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var thirddaysOpen = data.open[2];
			var thirddaysClose = data.close[2];
			var thirddaysHigh = data.high[2];
			var thirddaysLow = data.low[2];
			var isFirstBearish = firstdaysClose < firstdaysOpen;
			var isSecondBearish = seconddaysClose < seconddaysOpen;
			var isThirdBullish = thirddaysClose > thirddaysOpen;
			var isFirstGapExists = seconddaysHigh < firstdaysLow;
			var isDownsideTasukiGap = seconddaysOpen > thirddaysOpen && seconddaysClose < thirddaysOpen && thirddaysClose > seconddaysOpen && thirddaysClose < firstdaysClose;
			return isFirstBearish && isSecondBearish && isThirdBullish && isFirstGapExists && isDownsideTasukiGap;
		}
	}]);
	return DownsideTasukiGap;
}(CandlestickFinder);

function downsidetasukigap(data) {
	return new DownsideTasukiGap().hasPattern(data);
}

var BullishMarubozu = function (_CandlestickFinder8) {
	(0, _inherits3.default)(BullishMarubozu, _CandlestickFinder8);

	function BullishMarubozu() {
		(0, _classCallCheck3.default)(this, BullishMarubozu);

		var _this40 = (0, _possibleConstructorReturn3.default)(this, (BullishMarubozu.__proto__ || (0, _getPrototypeOf2.default)(BullishMarubozu)).call(this));

		_this40.name = 'BullishMarubozu';
		_this40.requiredCount = 1;
		return _this40;
	}

	(0, _createClass3.default)(BullishMarubozu, [{
		key: 'logic',
		value: function logic(data) {
			var daysOpen = data.open[0];
			var daysClose = data.close[0];
			var daysHigh = data.high[0];
			var daysLow = data.low[0];
			var isBullishMarbozu = this.approximateEqual(daysClose, daysHigh) && this.approximateEqual(daysLow, daysOpen) && daysOpen < daysClose && daysOpen < daysHigh;
			return isBullishMarbozu;
		}
	}]);
	return BullishMarubozu;
}(CandlestickFinder);

function bullishmarubozu(data) {
	return new BullishMarubozu().hasPattern(data);
}

var PiercingLine = function (_CandlestickFinder9) {
	(0, _inherits3.default)(PiercingLine, _CandlestickFinder9);

	function PiercingLine() {
		(0, _classCallCheck3.default)(this, PiercingLine);

		var _this41 = (0, _possibleConstructorReturn3.default)(this, (PiercingLine.__proto__ || (0, _getPrototypeOf2.default)(PiercingLine)).call(this));

		_this41.requiredCount = 2;
		_this41.name = 'PiercingLine';
		return _this41;
	}

	(0, _createClass3.default)(PiercingLine, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
			var isDowntrend = seconddaysLow < firstdaysLow;
			var isFirstBearish = firstdaysClose < firstdaysOpen;
			var isSecondBullish = seconddaysClose > seconddaysOpen;
			var isPiercingLinePattern = firstdaysLow > seconddaysOpen && seconddaysClose > firstdaysMidpoint;
			return isDowntrend && isFirstBearish && isPiercingLinePattern && isSecondBullish;
		}
	}]);
	return PiercingLine;
}(CandlestickFinder);

function piercingline(data) {
	return new PiercingLine().hasPattern(data);
}

var ThreeWhiteSoldiers = function (_CandlestickFinder10) {
	(0, _inherits3.default)(ThreeWhiteSoldiers, _CandlestickFinder10);

	function ThreeWhiteSoldiers() {
		(0, _classCallCheck3.default)(this, ThreeWhiteSoldiers);

		var _this42 = (0, _possibleConstructorReturn3.default)(this, (ThreeWhiteSoldiers.__proto__ || (0, _getPrototypeOf2.default)(ThreeWhiteSoldiers)).call(this));

		_this42.name = 'ThreeWhiteSoldiers';
		_this42.requiredCount = 3;
		return _this42;
	}

	(0, _createClass3.default)(ThreeWhiteSoldiers, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var thirddaysOpen = data.open[2];
			var thirddaysClose = data.close[2];
			var thirddaysHigh = data.high[2];
			var thirddaysLow = data.low[2];
			var isUpTrend = seconddaysHigh > firstdaysHigh && thirddaysHigh > seconddaysHigh;
			var isAllBullish = firstdaysOpen < firstdaysClose && seconddaysOpen < seconddaysClose && thirddaysOpen < thirddaysClose;
			var doesOpenWithinPreviousBody = firstdaysClose > seconddaysOpen && seconddaysOpen < firstdaysHigh && seconddaysHigh > thirddaysOpen && thirddaysOpen < seconddaysClose;
			return isUpTrend && isAllBullish && doesOpenWithinPreviousBody;
		}
	}]);
	return ThreeWhiteSoldiers;
}(CandlestickFinder);

function threewhitesoldiers(data) {
	return new ThreeWhiteSoldiers().hasPattern(data);
}

var bullishPatterns = [new BullishEngulfingPattern(), new DownsideTasukiGap(), new BullishHarami(), new BullishHaramiCross(), new MorningDojiStar(), new MorningStar(), new BullishMarubozu(), new PiercingLine(), new ThreeWhiteSoldiers()];

var BullishPatterns = function (_CandlestickFinder11) {
	(0, _inherits3.default)(BullishPatterns, _CandlestickFinder11);

	function BullishPatterns() {
		(0, _classCallCheck3.default)(this, BullishPatterns);

		var _this43 = (0, _possibleConstructorReturn3.default)(this, (BullishPatterns.__proto__ || (0, _getPrototypeOf2.default)(BullishPatterns)).call(this));

		_this43.name = 'Bullish Candlesticks';
		return _this43;
	}

	(0, _createClass3.default)(BullishPatterns, [{
		key: 'hasPattern',
		value: function hasPattern(data) {
			return bullishPatterns.reduce(function (state, pattern) {
				var result = pattern.hasPattern(data);
				if (result) {
					console.log('Matched pattern ', pattern.name);
				}
				return state || result;
			}, false);
		}
	}]);
	return BullishPatterns;
}(CandlestickFinder);

function bullish(data) {
	return new BullishPatterns().hasPattern(data);
}

var BearishEngulfingPattern = function (_CandlestickFinder12) {
	(0, _inherits3.default)(BearishEngulfingPattern, _CandlestickFinder12);

	function BearishEngulfingPattern() {
		(0, _classCallCheck3.default)(this, BearishEngulfingPattern);

		var _this44 = (0, _possibleConstructorReturn3.default)(this, (BearishEngulfingPattern.__proto__ || (0, _getPrototypeOf2.default)(BearishEngulfingPattern)).call(this));

		_this44.name = 'BearishEngulfingPattern';
		_this44.requiredCount = 2;
		return _this44;
	}

	(0, _createClass3.default)(BearishEngulfingPattern, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var isBearishEngulfing = firstdaysClose > firstdaysOpen && firstdaysOpen < seconddaysOpen && firstdaysClose < seconddaysOpen && firstdaysOpen > seconddaysClose;
			return isBearishEngulfing;
		}
	}]);
	return BearishEngulfingPattern;
}(CandlestickFinder);

function bearishengulfingpattern(data) {
	return new BearishEngulfingPattern().hasPattern(data);
}

var BearishHarami = function (_CandlestickFinder13) {
	(0, _inherits3.default)(BearishHarami, _CandlestickFinder13);

	function BearishHarami() {
		(0, _classCallCheck3.default)(this, BearishHarami);

		var _this45 = (0, _possibleConstructorReturn3.default)(this, (BearishHarami.__proto__ || (0, _getPrototypeOf2.default)(BearishHarami)).call(this));

		_this45.requiredCount = 2;
		_this45.name = 'BearishHarami';
		return _this45;
	}

	(0, _createClass3.default)(BearishHarami, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var isBearishHaramiPattern = firstdaysOpen > seconddaysOpen && firstdaysClose < seconddaysOpen && firstdaysClose < seconddaysClose && firstdaysOpen > seconddaysLow && firstdaysHigh > seconddaysHigh;
			return isBearishHaramiPattern;
		}
	}]);
	return BearishHarami;
}(CandlestickFinder);

function bearishharami(data) {
	return new BearishHarami().hasPattern(data);
}

var BearishHaramiCross = function (_CandlestickFinder14) {
	(0, _inherits3.default)(BearishHaramiCross, _CandlestickFinder14);

	function BearishHaramiCross() {
		(0, _classCallCheck3.default)(this, BearishHaramiCross);

		var _this46 = (0, _possibleConstructorReturn3.default)(this, (BearishHaramiCross.__proto__ || (0, _getPrototypeOf2.default)(BearishHaramiCross)).call(this));

		_this46.requiredCount = 2;
		_this46.name = 'BearishHaramiCross';
		return _this46;
	}

	(0, _createClass3.default)(BearishHaramiCross, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var isBearishHaramiCrossPattern = firstdaysOpen > seconddaysOpen && firstdaysClose < seconddaysOpen && firstdaysClose < seconddaysClose && firstdaysOpen > seconddaysLow && firstdaysHigh > seconddaysHigh;
			var isSecondDayDoji = this.approximateEqual(seconddaysOpen, seconddaysClose);
			return isBearishHaramiCrossPattern && isSecondDayDoji;
		}
	}]);
	return BearishHaramiCross;
}(CandlestickFinder);

function bearishharamicross(data) {
	return new BearishHaramiCross().hasPattern(data);
}

var EveningDojiStar = function (_CandlestickFinder15) {
	(0, _inherits3.default)(EveningDojiStar, _CandlestickFinder15);

	function EveningDojiStar() {
		(0, _classCallCheck3.default)(this, EveningDojiStar);

		var _this47 = (0, _possibleConstructorReturn3.default)(this, (EveningDojiStar.__proto__ || (0, _getPrototypeOf2.default)(EveningDojiStar)).call(this));

		_this47.name = 'EveningDojiStar';
		_this47.requiredCount = 3;
		return _this47;
	}

	(0, _createClass3.default)(EveningDojiStar, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var thirddaysOpen = data.open[2];
			var thirddaysClose = data.close[2];
			var thirddaysHigh = data.high[2];
			var thirddaysLow = data.low[2];
			var firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
			var isFirstBullish = firstdaysClose > firstdaysOpen;
			var dojiExists = new Doji().hasPattern({
				"open": [seconddaysOpen],
				"close": [seconddaysClose],
				"high": [seconddaysHigh],
				"low": [seconddaysLow]
			});
			var isThirdBearish = thirddaysOpen > thirddaysClose;
			var gapExists = seconddaysHigh > firstdaysHigh && seconddaysLow > firstdaysHigh && thirddaysOpen < seconddaysLow && seconddaysClose > thirddaysOpen;
			var doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint;
			return isFirstBullish && dojiExists && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint;
		}
	}]);
	return EveningDojiStar;
}(CandlestickFinder);

function eveningdojistar(data) {
	return new EveningDojiStar().hasPattern(data);
}

var EveningStar = function (_CandlestickFinder16) {
	(0, _inherits3.default)(EveningStar, _CandlestickFinder16);

	function EveningStar() {
		(0, _classCallCheck3.default)(this, EveningStar);

		var _this48 = (0, _possibleConstructorReturn3.default)(this, (EveningStar.__proto__ || (0, _getPrototypeOf2.default)(EveningStar)).call(this));

		_this48.name = 'EveningStar';
		_this48.requiredCount = 3;
		return _this48;
	}

	(0, _createClass3.default)(EveningStar, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var thirddaysOpen = data.open[2];
			var thirddaysClose = data.close[2];
			var thirddaysHigh = data.high[2];
			var thirddaysLow = data.low[2];
			var firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
			var isFirstBullish = firstdaysClose > firstdaysOpen;
			var isSmallBodyExists = firstdaysHigh < seconddaysLow && firstdaysHigh < seconddaysHigh;
			var isThirdBearish = thirddaysOpen > thirddaysClose;
			var gapExists = seconddaysHigh > firstdaysHigh && seconddaysLow > firstdaysHigh && thirddaysOpen < seconddaysLow && seconddaysClose > thirddaysOpen;
			var doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint;
			return isFirstBullish && isSmallBodyExists && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint;
		}
	}]);
	return EveningStar;
}(CandlestickFinder);

function eveningstar(data) {
	return new EveningStar().hasPattern(data);
}

var BearishMarubozu = function (_CandlestickFinder17) {
	(0, _inherits3.default)(BearishMarubozu, _CandlestickFinder17);

	function BearishMarubozu() {
		(0, _classCallCheck3.default)(this, BearishMarubozu);

		var _this49 = (0, _possibleConstructorReturn3.default)(this, (BearishMarubozu.__proto__ || (0, _getPrototypeOf2.default)(BearishMarubozu)).call(this));

		_this49.name = 'BearishMarubozu';
		_this49.requiredCount = 1;
		return _this49;
	}

	(0, _createClass3.default)(BearishMarubozu, [{
		key: 'logic',
		value: function logic(data) {
			var daysOpen = data.open[0];
			var daysClose = data.close[0];
			var daysHigh = data.high[0];
			var daysLow = data.low[0];
			var isBearishMarbozu = this.approximateEqual(daysOpen, daysHigh) && this.approximateEqual(daysLow, daysClose) && daysOpen > daysClose && daysOpen > daysLow;
			return isBearishMarbozu;
		}
	}]);
	return BearishMarubozu;
}(CandlestickFinder);

function bearishmarubozu(data) {
	return new BearishMarubozu().hasPattern(data);
}

var ThreeBlackCrows = function (_CandlestickFinder18) {
	(0, _inherits3.default)(ThreeBlackCrows, _CandlestickFinder18);

	function ThreeBlackCrows() {
		(0, _classCallCheck3.default)(this, ThreeBlackCrows);

		var _this50 = (0, _possibleConstructorReturn3.default)(this, (ThreeBlackCrows.__proto__ || (0, _getPrototypeOf2.default)(ThreeBlackCrows)).call(this));

		_this50.name = 'ThreeBlackCrows';
		_this50.requiredCount = 3;
		return _this50;
	}

	(0, _createClass3.default)(ThreeBlackCrows, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var thirddaysOpen = data.open[2];
			var thirddaysClose = data.close[2];
			var thirddaysHigh = data.high[2];
			var thirddaysLow = data.low[2];
			var isDownTrend = firstdaysLow > seconddaysLow && seconddaysLow > thirddaysLow;
			var isAllBearish = firstdaysOpen > firstdaysClose && seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose;
			var doesOpenWithinPreviousBody = firstdaysOpen > seconddaysOpen && seconddaysOpen > firstdaysClose && seconddaysOpen > thirddaysOpen && thirddaysOpen > seconddaysClose;
			return isDownTrend && isAllBearish && doesOpenWithinPreviousBody;
		}
	}]);
	return ThreeBlackCrows;
}(CandlestickFinder);

function threeblackcrows(data) {
	return new ThreeBlackCrows().hasPattern(data);
}

var bearishPatterns = [new BearishEngulfingPattern(), new BearishHarami(), new BearishHaramiCross(), new EveningDojiStar(), new EveningStar(), new BearishMarubozu(), new ThreeBlackCrows()];

var BearishPatterns = function (_CandlestickFinder19) {
	(0, _inherits3.default)(BearishPatterns, _CandlestickFinder19);

	function BearishPatterns() {
		(0, _classCallCheck3.default)(this, BearishPatterns);

		var _this51 = (0, _possibleConstructorReturn3.default)(this, (BearishPatterns.__proto__ || (0, _getPrototypeOf2.default)(BearishPatterns)).call(this));

		_this51.name = 'Bearish Candlesticks';
		return _this51;
	}

	(0, _createClass3.default)(BearishPatterns, [{
		key: 'hasPattern',
		value: function hasPattern(data) {
			return bearishPatterns.reduce(function (state, pattern) {
				return state || pattern.hasPattern(data);
			}, false);
		}
	}]);
	return BearishPatterns;
}(CandlestickFinder);

function bearish(data) {
	return new BearishPatterns().hasPattern(data);
}

var AbandonedBaby = function (_CandlestickFinder20) {
	(0, _inherits3.default)(AbandonedBaby, _CandlestickFinder20);

	function AbandonedBaby() {
		(0, _classCallCheck3.default)(this, AbandonedBaby);

		var _this52 = (0, _possibleConstructorReturn3.default)(this, (AbandonedBaby.__proto__ || (0, _getPrototypeOf2.default)(AbandonedBaby)).call(this));

		_this52.name = 'AbandonedBaby';
		_this52.requiredCount = 3;
		return _this52;
	}

	(0, _createClass3.default)(AbandonedBaby, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var thirddaysOpen = data.open[2];
			var thirddaysClose = data.close[2];
			var thirddaysHigh = data.high[2];
			var thirddaysLow = data.low[2];
			var isFirstBearish = firstdaysClose < firstdaysOpen;
			var dojiExists = new Doji().hasPattern({
				"open": [seconddaysOpen],
				"close": [seconddaysClose],
				"high": [seconddaysHigh],
				"low": [seconddaysLow]
			});
			var gapExists = seconddaysHigh < firstdaysLow && thirddaysLow > seconddaysHigh && thirddaysClose > thirddaysOpen;
			var isThirdBullish = thirddaysHigh < firstdaysOpen;
			return isFirstBearish && dojiExists && gapExists && isThirdBullish;
		}
	}]);
	return AbandonedBaby;
}(CandlestickFinder);

function abandonedbaby(data) {
	return new AbandonedBaby().hasPattern(data);
}

var DarkCloudCover = function (_CandlestickFinder21) {
	(0, _inherits3.default)(DarkCloudCover, _CandlestickFinder21);

	function DarkCloudCover() {
		(0, _classCallCheck3.default)(this, DarkCloudCover);

		var _this53 = (0, _possibleConstructorReturn3.default)(this, (DarkCloudCover.__proto__ || (0, _getPrototypeOf2.default)(DarkCloudCover)).call(this));

		_this53.name = 'DarkCloudCover';
		_this53.requiredCount = 2;
		return _this53;
	}

	(0, _createClass3.default)(DarkCloudCover, [{
		key: 'logic',
		value: function logic(data) {
			var firstdaysOpen = data.open[0];
			var firstdaysClose = data.close[0];
			var firstdaysHigh = data.high[0];
			var firstdaysLow = data.low[0];
			var seconddaysOpen = data.open[1];
			var seconddaysClose = data.close[1];
			var seconddaysHigh = data.high[1];
			var seconddaysLow = data.low[1];
			var firstdayMidpoint = (firstdaysClose + firstdaysOpen) / 2;
			var isFirstBullish = firstdaysClose > firstdaysOpen;
			var isSecondBearish = seconddaysClose < seconddaysOpen;
			var isDarkCloudPattern = seconddaysOpen > firstdaysHigh && seconddaysClose < firstdayMidpoint && seconddaysClose > firstdaysOpen;
			return isFirstBullish && isSecondBearish && isDarkCloudPattern;
		}
	}]);
	return DarkCloudCover;
}(CandlestickFinder);

function darkcloudcover(data) {
	return new DarkCloudCover().hasPattern(data);
}

var DragonFlyDoji = function (_CandlestickFinder22) {
	(0, _inherits3.default)(DragonFlyDoji, _CandlestickFinder22);

	function DragonFlyDoji() {
		(0, _classCallCheck3.default)(this, DragonFlyDoji);

		var _this54 = (0, _possibleConstructorReturn3.default)(this, (DragonFlyDoji.__proto__ || (0, _getPrototypeOf2.default)(DragonFlyDoji)).call(this));

		_this54.requiredCount = 1;
		_this54.name = 'DragonFlyDoji';
		return _this54;
	}

	(0, _createClass3.default)(DragonFlyDoji, [{
		key: 'logic',
		value: function logic(data) {
			var daysOpen = data.open[0];
			var daysClose = data.close[0];
			var daysHigh = data.high[0];
			var isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
			var isHighEqualsOpen = this.approximateEqual(daysOpen, daysHigh);
			return isOpenEqualsClose && isHighEqualsOpen;
		}
	}]);
	return DragonFlyDoji;
}(CandlestickFinder);

function dragonflydoji(data) {
	return new DragonFlyDoji().hasPattern(data);
}

var GraveStoneDoji = function (_CandlestickFinder23) {
	(0, _inherits3.default)(GraveStoneDoji, _CandlestickFinder23);

	function GraveStoneDoji() {
		(0, _classCallCheck3.default)(this, GraveStoneDoji);

		var _this55 = (0, _possibleConstructorReturn3.default)(this, (GraveStoneDoji.__proto__ || (0, _getPrototypeOf2.default)(GraveStoneDoji)).call(this));

		_this55.requiredCount = 1;
		_this55.name = 'GraveStoneDoji';
		return _this55;
	}

	(0, _createClass3.default)(GraveStoneDoji, [{
		key: 'logic',
		value: function logic(data) {
			var daysOpen = data.open[0];
			var daysClose = data.close[0];
			var daysLow = data.low[0];
			var isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
			var isLowEqualsOpen = this.approximateEqual(daysOpen, daysLow);
			return isOpenEqualsClose && isLowEqualsOpen;
		}
	}]);
	return GraveStoneDoji;
}(CandlestickFinder);

function gravestonedoji(data) {
	return new GraveStoneDoji().hasPattern(data);
}

var BullishSpinningTop = function (_CandlestickFinder24) {
	(0, _inherits3.default)(BullishSpinningTop, _CandlestickFinder24);

	function BullishSpinningTop() {
		(0, _classCallCheck3.default)(this, BullishSpinningTop);

		var _this56 = (0, _possibleConstructorReturn3.default)(this, (BullishSpinningTop.__proto__ || (0, _getPrototypeOf2.default)(BullishSpinningTop)).call(this));

		_this56.name = 'BullishSpinningTop';
		_this56.requiredCount = 1;
		return _this56;
	}

	(0, _createClass3.default)(BullishSpinningTop, [{
		key: 'logic',
		value: function logic(data) {
			var daysOpen = data.open[0];
			var daysClose = data.close[0];
			var daysHigh = data.high[0];
			var daysLow = data.low[0];
			var bodyLength = Math.abs(daysClose - daysOpen);
			var upperShadowLength = Math.abs(daysHigh - daysClose);
			var lowerShadowLength = Math.abs(daysOpen - daysLow);
			var isBullishSpinningTop = bodyLength < upperShadowLength && bodyLength < lowerShadowLength;
			return isBullishSpinningTop;
		}
	}]);
	return BullishSpinningTop;
}(CandlestickFinder);

function bullishspinningtop(data) {
	return new BullishSpinningTop().hasPattern(data);
}

var BearishSpinningTop = function (_CandlestickFinder25) {
	(0, _inherits3.default)(BearishSpinningTop, _CandlestickFinder25);

	function BearishSpinningTop() {
		(0, _classCallCheck3.default)(this, BearishSpinningTop);

		var _this57 = (0, _possibleConstructorReturn3.default)(this, (BearishSpinningTop.__proto__ || (0, _getPrototypeOf2.default)(BearishSpinningTop)).call(this));

		_this57.name = 'BearishSpinningTop';
		_this57.requiredCount = 1;
		return _this57;
	}

	(0, _createClass3.default)(BearishSpinningTop, [{
		key: 'logic',
		value: function logic(data) {
			var daysOpen = data.open[0];
			var daysClose = data.close[0];
			var daysHigh = data.high[0];
			var daysLow = data.low[0];
			var bodyLength = Math.abs(daysClose - daysOpen);
			var upperShadowLength = Math.abs(daysHigh - daysOpen);
			var lowerShadowLength = Math.abs(daysHigh - daysLow);
			var isBearishSpinningTop = bodyLength < upperShadowLength && bodyLength < lowerShadowLength;
			return isBearishSpinningTop;
		}
	}]);
	return BearishSpinningTop;
}(CandlestickFinder);

function bearishspinningtop(data) {
	return new BearishSpinningTop().hasPattern(data);
}

/**
 * Calcaultes the fibonacci retracements for given start and end points
 *
 * If calculating for up trend start should be low and end should be high and vice versa
 *
 * returns an array of retracements level containing [0 , 23.6, 38.2, 50, 61.8, 78.6, 100, 127.2, 161.8, 261.8, 423.6]
 *
 * @export
 * @param {number} start
 * @param {number} end
 * @returns {number[]}
 */
/**
 * Calcaultes the fibonacci retracements for given start and end points
 *
 * If calculating for up trend start should be low and end should be high and vice versa
 *
 * returns an array of retracements level containing [0 , 23.6, 38.2, 50, 61.8, 78.6, 100, 127.2, 161.8, 261.8, 423.6]
 *
 * @export
 * @param {number} start
 * @param {number} end
 * @returns {number[]}
 */function fibonacciretracement(start, end) {
	var levels = [0, 23.6, 38.2, 50, 61.8, 78.6, 100, 127.2, 161.8, 261.8, 423.6];
	var retracements = void 0;
	if (start < end) {
		retracements = levels.map(function (level) {
			var calculated = end - Math.abs(start - end) * level / 100;
			return calculated > 0 ? calculated : 0;
		});
	} else {
		retracements = levels.map(function (level) {
			var calculated = end + Math.abs(start - end) * level / 100;
			return calculated > 0 ? calculated : 0;
		});
	}
	return retracements;
}

function getAvailableIndicators() {
	var AvailableIndicators = [];
	AvailableIndicators.push('sma');
	AvailableIndicators.push('ema');
	AvailableIndicators.push('wma');
	AvailableIndicators.push('wema');
	AvailableIndicators.push('macd');
	AvailableIndicators.push('rsi');
	AvailableIndicators.push('bollingerbands');
	AvailableIndicators.push('adx');
	AvailableIndicators.push('atr');
	AvailableIndicators.push('truerange');
	AvailableIndicators.push('roc');
	AvailableIndicators.push('kst');
	AvailableIndicators.push('psar');
	AvailableIndicators.push('stochastic');
	AvailableIndicators.push('williamsr');
	AvailableIndicators.push('adl');
	AvailableIndicators.push('obv');
	AvailableIndicators.push('trix');

	AvailableIndicators.push('cci');
	AvailableIndicators.push('forceindex');
	AvailableIndicators.push('vwap');
	AvailableIndicators.push('renko');
	AvailableIndicators.push('heikinashi');

	AvailableIndicators.push('averagegain');
	AvailableIndicators.push('averageloss');
	AvailableIndicators.push('sd');
	AvailableIndicators.push('bullish');
	AvailableIndicators.push('bearish');
	AvailableIndicators.push('abandonedbaby');
	AvailableIndicators.push('doji');
	AvailableIndicators.push('bearishengulfingpattern');
	AvailableIndicators.push('bullishengulfingpattern');
	AvailableIndicators.push('darkcloudcover');
	AvailableIndicators.push('downsidetasukigap');
	AvailableIndicators.push('dragonflydoji');
	AvailableIndicators.push('gravestonedoji');
	AvailableIndicators.push('bullishharami');
	AvailableIndicators.push('bearishharami');
	AvailableIndicators.push('bullishharamicross');
	AvailableIndicators.push('bearishharamicross');
	AvailableIndicators.push('eveningdojistar');
	AvailableIndicators.push('eveningstar');
	AvailableIndicators.push('morningdojistar');
	AvailableIndicators.push('morningstar');
	AvailableIndicators.push('bullishmarubozu');
	AvailableIndicators.push('bearishmarubozu');
	AvailableIndicators.push('piercingline');
	AvailableIndicators.push('bullishspinningtop');
	AvailableIndicators.push('bearishspinningtop');
	AvailableIndicators.push('threeblackcrows');
	AvailableIndicators.push('threewhitesoldiers');
	return AvailableIndicators;
}

exports.getAvailableIndicators = getAvailableIndicators;
exports.sma = sma;
exports.SMA = SMA;
exports.ema = ema;
exports.EMA = EMA;
exports.wma = wma;
exports.WMA = WMA;
exports.wema = wema;
exports.WEMA = WEMA;
exports.macd = macd;
exports.MACD = MACD;
exports.rsi = rsi;
exports.RSI = RSI;
exports.bollingerbands = bollingerbands;
exports.BollingerBands = BollingerBands;
exports.adx = adx;
exports.ADX = ADX;
exports.atr = atr;
exports.ATR = ATR;
exports.truerange = truerange;
exports.TrueRange = TrueRange;
exports.roc = roc;
exports.ROC = ROC;
exports.kst = kst;
exports.KST = KST;
exports.psar = psar;
exports.PSAR = PSAR;
exports.stochastic = stochastic;
exports.Stochastic = Stochastic;
exports.williamsr = williamsr;
exports.WilliamsR = WilliamsR;
exports.adl = adl;
exports.ADL = ADL;
exports.obv = obv;
exports.OBV = OBV;
exports.trix = trix;
exports.TRIX = TRIX;
exports.forceindex = forceindex;
exports.ForceIndex = ForceIndex;
exports.cci = cci;
exports.CCI = CCI;
exports.vwap = vwap;
exports.VWAP = VWAP;
exports.averagegain = averagegain;
exports.AverageGain = AverageGain;
exports.averageloss = averageloss;
exports.AverageLoss = AverageLoss;
exports.sd = sd;
exports.SD = SD;
exports.renko = renko;
exports.HeikinAshi = HeikinAshi;
exports.heikinashi = heikinashi;
exports.bullish = bullish;
exports.bearish = bearish;
exports.abandonedbaby = abandonedbaby;
exports.doji = doji;
exports.bearishengulfingpattern = bearishengulfingpattern;
exports.bullishengulfingpattern = bullishengulfingpattern;
exports.darkcloudcover = darkcloudcover;
exports.downsidetasukigap = downsidetasukigap;
exports.dragonflydoji = dragonflydoji;
exports.gravestonedoji = gravestonedoji;
exports.bullishharami = bullishharami;
exports.bearishharami = bearishharami;
exports.bullishharamicross = bullishharamicross;
exports.bearishharamicross = bearishharamicross;
exports.eveningdojistar = eveningdojistar;
exports.eveningstar = eveningstar;
exports.morningdojistar = morningdojistar;
exports.morningstar = morningstar;
exports.bullishmarubozu = bullishmarubozu;
exports.bearishmarubozu = bearishmarubozu;
exports.piercingline = piercingline;
exports.bullishspinningtop = bullishspinningtop;
exports.bearishspinningtop = bearishspinningtop;
exports.threeblackcrows = threeblackcrows;
exports.threewhitesoldiers = threewhitesoldiers;
exports.fibonacciretracement = fibonacciretracement;
exports.setConfig = setConfig;
exports.getConfig = getConfig;
//# sourceMappingURL=index.js.map
