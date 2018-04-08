'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * 指标计算公式
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * 指标计算函数:
                                                                                                                                                                                                                                                                               * indicatorFunc(params,values){
                                                                                                                                                                                                                                                                               * params为指标计算需要用到的参数
                                                                                                                                                                                                                                                                               * values为指标计算需要用到的原始数据，需要通过selector(fullData)计算出
                                                                                                                                                                                                                                                                               * }
                                                                                                                                                                                                                                                                               */


var _indicators = require('./indicators');

exports.default = {
  /**
   * 获取SMA指标数据
   * return array
   */
  getData_MA: function getData_MA(params, values) {
    var inputSMA = {
      values: values,
      period: params.period || 8
    };
    if (values) {
      return _indicators.SMA.calculate(inputSMA);
    }
    return [];
  },

  /**
   * 获取BOLL指标数据
   * return array
   * {lower: number, middle: number, upper: number}
   */
  getData_BOLL: function getData_BOLL(params, values) {
    var inputBB = {
      period: params.period || 24,
      values: values,
      stdDev: params.stdDev || 1
    };
    if (values) {
      return _indicators.BollingerBands.calculate(inputBB);
    }
    return [];
  },

  /**
   * 获取RSI指标数据
   * return array
   */
  getData_RSI: function getData_RSI(params, values) {
    var inputRSI = {
      values: values,
      period: params.period || 14
    };
    if (values) {
      return _indicators.RSI.calculate(inputRSI);
    }
    return [];
  },

  /**
   * MACD指标数据
   * return array
   * {MACD: number, histogram: number, signal: number}
   */
  getData_MACD: function getData_MACD(params, values) {
    var macdInput = {
      values: values,
      fastPeriod: params.fastPeriod || 12,
      slowPeriod: params.slowPeriod || 26,
      signalPeriod: params.signalPeriod || 9,
      SimpleMAOscillator: params.SimpleMAOscillator || false,
      SimpleMASignal: params.SimpleMASignal || false
    };
    if (values) {
      return _indicators.MACD.calculate(macdInput);
    }
    return [];
  },

  /**
   * 获取KDJ指标数据
   * {d: 75.75, k: 89.2}
   */
  getData_KDJ: function getData_KDJ(params, values) {
    var close = values.map(function (d) {
      return d[0];
    });
    var high = values.map(function (d) {
      return d[1];
    });
    var low = values.map(function (d) {
      return d[2];
    });
    var input = {
      high: high,
      low: low,
      close: close,
      period: params.period,
      kSignalPeriod: params.kSignalPeriod,
      dSignalPeriod: params.dSignalPeriod
    };
    if (high && low && close) {
      return _indicators.Stochastic.calculate(input);
    }
    return [];
  },


  // ChartContainer使用，对传入的indicators进行处理,计算指标数据
  indicatorsHelper: function indicatorsHelper(indicators, plotData) {
    var _this = this;

    // 循环处理每一类指标
    Object.keys(indicators).forEach(function (indicator) {
      var currIndicators = indicators[indicator];
      switch (indicator) {
        case 'MA':
          currIndicators.forEach(function (currIndicator) {
            _this.calcIndicator(_this.getData_MA, currIndicator, plotData);
          });
          break;
        case 'BOLL':
          currIndicators.forEach(function (currIndicator) {
            _this.calcIndicator(_this.getData_BOLL, currIndicator, plotData);
          });
          break;
        case 'MACD':
          currIndicators.forEach(function (currIndicator) {
            _this.calcIndicator(_this.getData_MACD, currIndicator, plotData);
          });
          break;
        case 'RSI':
          currIndicators.forEach(function (currIndicator) {
            _this.calcIndicator(_this.getData_RSI, currIndicator, plotData);
          });
          break;
        case 'KDJ':
          currIndicators.forEach(function (currIndicator) {
            _this.calcIndicator(_this.getData_KDJ, currIndicator, plotData);
          });
          break;
        default:
          break;
      }
    });
  },
  calcIndicator: function calcIndicator(method, indicator, plotData) {
    var params = indicator.params,
        selector = indicator.selector,
        dataKey = indicator.dataKey;
    // 使用selector获取计算指标用到的原始数据

    var originData = plotData.fullData.map(function (d) {
      return selector(d);
    });
    var calcedData = method(params, originData);
    calcedData = Array(plotData.fullData.length - calcedData.length).fill('-').concat(calcedData);
    plotData.calcedData[dataKey] = calcedData;
  },
  enumerateIndicator: function enumerateIndicator(data) {
    var results = [];
    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      if ((typeof record === 'undefined' ? 'undefined' : _typeof(record)) !== 'object' && record !== '-') {
        results = data;
        break;
      }
      for (var key in record) {
        if (record[key] && record[key] !== '-') {
          results.push(record[key]);
        }
      }
    }
    return results;
  }
};