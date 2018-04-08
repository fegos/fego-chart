'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateYScale = exports.calculateXScale = undefined;

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

/**
 * 图表scale相关函数
 * 一期用d3-scale
 */

function calculateScale(domain, range, scale) {
  var scaleObject = scale().domain(domain).range(range);
  return scaleObject;
}

function calculateXScale(data, frame, type) {
  var domain = (0, _d3Array.extent)(data);
  var range = [frame.x || 0, frame.chartWidth];
  var scaler = _d3Scale.scaleTime;
  if (type === 'index') {
    scaler = _d3Scale.scaleLinear;
  }
  var scaleObject = calculateScale(domain, range, scaler);
  return scaleObject;
}

function calculateYScale(data, frame) {
  var domain = (0, _d3Array.extent)(data);
  var range = [frame.chartHeight, 0];
  var scaleObject = calculateScale(domain, range, _d3Scale.scaleLinear);
  return scaleObject;
}

exports.calculateXScale = calculateXScale;
exports.calculateYScale = calculateYScale;