/**
 * 指标计算公式
 *
 * 指标计算函数:
 * indicatorFunc(params,values){
 * params为指标计算需要用到的参数
 * values为指标计算需要用到的原始数据，需要通过selector(fullData)计算出
 * }
 */
import { RSI, SMA, BollingerBands, MACD, Stochastic } from './indicators';

export default {
  /**
   * 获取SMA指标数据
   * return array
   */
  getData_MA(params, values) {
    const inputSMA = {
      values,
      period: params.period || 8,
    };
    if (values) {
      return SMA.calculate(inputSMA);
    }
    return [];
  },
  /**
   * 获取BOLL指标数据
   * return array
   * {lower: number, middle: number, upper: number}
   */
  getData_BOLL(params, values) {
    const inputBB = {
      period: params.period || 24,
      values,
      stdDev: params.stdDev || 1,
    };
    if (values) {
      return BollingerBands.calculate(inputBB);
    }
    return [];
  },
  /**
   * 获取RSI指标数据
   * return array
   */
  getData_RSI(params, values) {
    const inputRSI = {
      values,
      period: params.period || 14,
    };
    if (values) {
      return RSI.calculate(inputRSI);
    }
    return [];
  },
  /**
   * MACD指标数据
   * return array
   * {MACD: number, histogram: number, signal: number}
   */
  getData_MACD(
    params,
    values,
  ) {
    const macdInput = {
      values,
      fastPeriod: params.fastPeriod || 12,
      slowPeriod: params.slowPeriod || 26,
      signalPeriod: params.signalPeriod || 9,
      SimpleMAOscillator: params.SimpleMAOscillator || false,
      SimpleMASignal: params.SimpleMASignal || false,
    };
    if (values) {
      return MACD.calculate(macdInput);
    }
    return [];
  },
  /**
   * 获取KDJ指标数据
   * {d: 75.75, k: 89.2}
   */
  getData_KDJ(params, values) {
    const close = values.map(d => d[0]);
    const high = values.map(d => d[1]);
    const low = values.map(d => d[2]);
    const input = {
      high,
      low,
      close,
      period: params.period,
      kSignalPeriod: params.kSignalPeriod,
      dSignalPeriod: params.dSignalPeriod,
    };
    if (high && low && close) {
      return Stochastic.calculate(input);
    }
    return [];
  },

  // ChartContainer使用，对传入的indicators进行处理,计算指标数据
  indicatorsHelper(indicators, plotData) {
    // 循环处理每一类指标
    Object.keys(indicators).forEach((indicator) => {
      const currIndicators = indicators[indicator];
      switch (indicator) {
        case 'MA':
          currIndicators.forEach((currIndicator) => {
            this.calcIndicator(this.getData_MA, currIndicator, plotData);
          });
          break;
        case 'BOLL':
          currIndicators.forEach((currIndicator) => {
            this.calcIndicator(this.getData_BOLL, currIndicator, plotData);
          });
          break;
        case 'MACD':
          currIndicators.forEach((currIndicator) => {
            this.calcIndicator(this.getData_MACD, currIndicator, plotData);
          });
          break;
        case 'RSI':
          currIndicators.forEach((currIndicator) => {
            this.calcIndicator(this.getData_RSI, currIndicator, plotData);
          });
          break;
        case 'KDJ':
          currIndicators.forEach((currIndicator) => {
            this.calcIndicator(this.getData_KDJ, currIndicator, plotData);
          });
          break;
        default:
          break;
      }
    });
  },

  calcIndicator(method, indicator, plotData) {
    const { params, selector, dataKey } = indicator;
    // 使用selector获取计算指标用到的原始数据
    const originData = plotData.fullData.map(d => selector(d));
    let calcedData = method(params, originData);
    calcedData = Array(plotData.fullData.length - calcedData.length).fill('-').concat(calcedData);
    plotData.calcedData[dataKey] = calcedData;
  },

  enumerateIndicator(data) {
    let results = [];
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      if (typeof record !== 'object' && record !== '-') {
        results = data;
        break;
      }
      for (const key in record) {
        if (record[key] && record[key] !== '-') {
          results.push(record[key]);
        }
      }
    }
    return results;
  },
};
