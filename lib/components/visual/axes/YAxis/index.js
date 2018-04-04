'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // Y轴组件


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseAxis = require('../BaseAxis');

var _BaseAxis2 = _interopRequireDefault(_BaseAxis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  return _react2.default.createElement(_BaseAxis2.default, _extends({ type: 'YAxis' }, undefined.props));
};