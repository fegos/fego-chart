// 数据、图表映射相关的一些辅助函数
import moment from 'moment-timezone';

import CalculateUtil from './CalculateUtil';


export { CalculateUtil };

export function getClosetItemIndex(array, value, accessor) {
  let lo = 0;
  let hi = array.length - 1;
  while (hi - lo > 1) {
    const mid = Math.round((lo + hi) / 2);
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
  const { left, right } = getClosetItemIndex(array, value, accessor);
  if (left === right) {
    return array[left];
  }
  const closest = (Math.abs(accessor(array[left]) - value) < Math.abs(accessor(array[right]) - value))
    ? array[left] : array[right];
  closest.closestItemIndex = (Math.abs(accessor(array[left]) - value) < Math.abs(accessor(array[right]) - value))
    ? left : right;
  return closest;
}

// 根据鼠标X坐标判断是哪一条数据
export function getCurrentItem(xScale, xAccessor, mouseXY, plotData, scaleType) {
  if (!xAccessor) xAccessor = d => d[0];

  const xValue = xScale.invert(mouseXY[0]);
  if (scaleType === 'index') return Math.round(xValue);
  const item = getClosetItem(plotData, xValue, xAccessor);
  return item;
}

export function getMousePosition(e, canvas, containerFrame) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - containerFrame.padding.left;
  const y = e.clientY - rect.top - containerFrame.padding.top;
  return [Math.round(x), Math.round(y)];
}

export function getTimestamp(dataStr, timezone) {
  let year = '1970';
  let month = '01';
  let day = '01';
  let hour = '00';
  let min = '00';
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

  const dateString = `${year}-${month}-${day} ${hour}:${min}`;
  const lastDate = moment.tz(dateString, timezone);
  const lastTimestamp = Number.parseFloat(lastDate.format('x'));
  return lastTimestamp;
}

