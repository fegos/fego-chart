'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Coordinate = require('./Coordinate');

var _Coordinate2 = _interopRequireDefault(_Coordinate);

var _GridLine = require('./GridLine');

var _GridLine2 = _interopRequireDefault(_GridLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Axes模块，导出X轴和Y周组件
exports.default = {
  Coordinate: _Coordinate2.default,
  GridLine: _GridLine2.default
};