'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AreaSeries = require('./AreaSeries');

var _AreaSeries2 = _interopRequireDefault(_AreaSeries);

var _CandleStickSeries = require('./CandleStickSeries');

var _CandleStickSeries2 = _interopRequireDefault(_CandleStickSeries);

var _LineSeries = require('./LineSeries');

var _LineSeries2 = _interopRequireDefault(_LineSeries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  AreaSeries: _AreaSeries2.default,
  CandleStickSeries: _CandleStickSeries2.default,
  LineSeries: _LineSeries2.default
}; /**
    * @author Mattieric
    */