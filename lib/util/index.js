'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalculateUtil = undefined;
exports.getClosetItemIndex = getClosetItemIndex;
exports.getCurrentItem = getCurrentItem;
exports.getMousePosition = getMousePosition;
exports.getTimestamp = getTimestamp;

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _CalculateUtil = require('./CalculateUtil');

var _CalculateUtil2 = _interopRequireDefault(_CalculateUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 数据、图表映射相关的一些辅助函数
exports.CalculateUtil = _CalculateUtil2.default;
function getClosetItemIndex(array, value, accessor) {
  var lo = 0;
  var hi = array.length - 1;
  while (hi - lo > 1) {
    var mid = Math.round((lo + hi) / 2);
    if (accessor(array[mid]) <= value) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  if (accessor(array[lo]).valueOf() === value.valueOf()) hi = lo;
  if (accessor(array[hi]).valueOf() === value.valueOf()) lo = hi;
  if (accessor(array[lo]) < value && accessor(array[hi]) < value) lo = hi;
  if (accessor(array[lo]) > value && accessor(array[hi]) > value) hi = lo;
  return { left: lo, right: hi };
}

function getClosetItem(array, value, accessor) {
  var _getClosetItemIndex = getClosetItemIndex(array, value, accessor),
      left = _getClosetItemIndex.left,
      right = _getClosetItemIndex.right;

  if (left === right) {
    return array[left];
  }
  var closest = Math.abs(accessor(array[left]) - value) < Math.abs(accessor(array[right]) - value) ? array[left] : array[right];
  closest.closestItemIndex = Math.abs(accessor(array[left]) - value) < Math.abs(accessor(array[right]) - value) ? left : right;
  return closest;
}

// 根据鼠标X坐标判断是哪一条数据
function getCurrentItem(xScale, xAccessor, mouseXY, plotData, scaleType) {
  if (!xAccessor) xAccessor = function xAccessor(d) {
    return d[0];
  };

  var xValue = xScale.invert(mouseXY[0]);
  if (scaleType === 'index') return Math.round(xValue);
  var item = getClosetItem(plotData, xValue, xAccessor);
  return item;
}

function getMousePosition(e, canvas, containerFrame) {
  var rect = canvas.getBoundingClientRect();
  var x = e.clientX - rect.left - containerFrame.padding.left;
  var y = e.clientY - rect.top - containerFrame.padding.top;
  return [Math.round(x), Math.round(y)];
}

function getTimestamp(dataStr, timezone) {
  var year = '1970';
  var month = '01';
  var day = '01';
  var hour = '00';
  var min = '00';
  if (dataStr.length >= 4) {
    year = dataStr.substring(0, 4);
    if (dataStr.length >= 6) {
      month = dataStr.substring(4, 6);
      if (dataStr.length >= 8) {
        day = dataStr.substring(6, 8);
        if (dataStr.length >= 10) {
          hour = dataStr.substring(8, 10);
          if (dataStr.length >= 12) {
            min = dataStr.substring(10, 12);
          }
        }
      }
    }
  }

  var dateString = year + '-' + month + '-' + day + ' ' + hour + ':' + min;
  var lastDate = _momentTimezone2.default.tz(dateString, timezone);
  var lastTimestamp = Number.parseFloat(lastDate.format('x'));
  return lastTimestamp;
}