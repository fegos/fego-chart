/**
 * 图表scale相关函数
 * 一期用d3-scale
 */

import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';

function calculateScale(domain, range, scale) {
  const scaleObject = scale()
    .domain(domain)
    .range(range);
  return scaleObject;
}

function calculateXScale(data, frame, type) {
  const domain = extent(data);
  const range = [frame.x || 0, frame.chartWidth];
  let scaler = scaleTime;
  if (type === 'index') {
    scaler = scaleLinear;
  }
  const scaleObject = calculateScale(domain, range, scaler);
  return scaleObject;
}

function calculateYScale(data, frame) {
  const domain = extent(data);
  const range = [frame.chartHeight, 0];
  const scaleObject = calculateScale(domain, range, scaleLinear);
  return scaleObject;
}

export {
  calculateXScale,
  calculateYScale,
};
