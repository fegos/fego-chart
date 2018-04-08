'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RSI = require('./RSI');

var _RSI2 = _interopRequireDefault(_RSI);

var _MA = require('./MA');

var _MA2 = _interopRequireDefault(_MA);

var _BOLL = require('./BOLL');

var _BOLL2 = _interopRequireDefault(_BOLL);

var _MACD = require('./MACD');

var _MACD2 = _interopRequireDefault(_MACD);

var _KDJ = require('./KDJ');

var _KDJ2 = _interopRequireDefault(_KDJ);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  RSI: _RSI2.default,
  MA: _MA2.default,
  BOLL: _BOLL2.default,
  MACD: _MACD2.default,
  KDJ: _KDJ2.default
};