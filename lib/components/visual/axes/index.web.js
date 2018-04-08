'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _XAxis = require('./XAxis');

var _XAxis2 = _interopRequireDefault(_XAxis);

var _YAxis = require('./YAxis');

var _YAxis2 = _interopRequireDefault(_YAxis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Axes模块，导出X轴和Y周组件
exports.default = {
  Coordinate: _XAxis2.default,
  GridLine: _YAxis2.default
};