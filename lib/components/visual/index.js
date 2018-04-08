'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axes = require('./axes');

var _axes2 = _interopRequireDefault(_axes);

var _Background = require('./Background');

var _Background2 = _interopRequireDefault(_Background);

var _indicators = require('./indicators');

var _indicators2 = _interopRequireDefault(_indicators);

var _interactive = require('./interactive');

var _interactive2 = _interopRequireDefault(_interactive);

var _series = require('./series');

var _series2 = _interopRequireDefault(_series);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  axes: _axes2.default,
  Background: _Background2.default,
  indicators: _indicators2.default,
  interactive: _interactive2.default,
  series: _series2.default
}; /**
    *
    * @author Mattieric
    */