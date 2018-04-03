/**
 * 测试绘图
 */

import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions, ART } from 'react-native';
import components from '../../../../../src/components';

const {
  ChartContainer,
  Chart,
  LineSeries,
  AreaSeries,
  Coordinate,
  GridLine,
  Tooltip,
  Background,
  CandleStickSeries,
  RSI,
  MA,
  BOLL,
  MACD,
  KDJ,
  CrossHair,
  LoadMoreView,
} = components;

const {
  MATooltip, BOLLTooltip, RSITooltip, MACDTooltip, KDJTooltip,
} = Tooltip;

const { Group } = ART;

const { width, height } = Dimensions.get('window');

export default class ChartView extends Component {
  constructor(props) {
    super(props);

    this._mainInd = ['MA', 'BOLL'];
    this._techInd = ['MACD', 'RSI', 'KDJ'];
    this._initialPlotState = {
      curScale: 1,
      curStep: 8,
      curBarWidth: 6,
    };
    this._plotConfig = {
      barWidth: 6,
      spacing: 2,
      maxScale: 5,
      minScale: 0.2,
    };
    this._plotStateMap = {};
    this.state = {
      timelineData: [],
      klineData: [],
      chartType: 'timeline',
      plotState: this._initialPlotState,
      domain: null,
      hasMore: true,
      xGridGap: 15,
      // dataOffset: 0,
      currentMainInd: 0,
      currentTechInd: 0,
    };
  }


  /**
   * life cycle
   */
  componentWillMount() {
    this._queryTimeLineData();
    this._queryKLineData();
  }


  /**
   * 网络请求
   */
  _queryTimeLineData = () => {
    fetch('http://10.235.19.239:5002/lineQuote')
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          timelineData: responseJson.data,
        });
      }).catch(() => {
      });
  }

  _queryKLineData = () => {
    fetch('http://10.235.19.239:5002/kLineQuote')
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          klineData: responseJson.data.result,
        });
      }).catch(() => {
      });
  }


  _onLoadMore = () => {
    const promise = new Promise((resolve, reject) => {
      const { klineData, domain } = this.state;
      const preData = klineData;

      fetch('http://10.235.19.239:5002/kLineQuote')
        .then(response => response.json())
        .then((responseJson) => {
          const { data } = responseJson;
          resolve(data.result);
          const newDataLength = data.result.length;
          if (newDataLength && domain) {
            let { start, end } = domain;
            start += newDataLength;
            end += newDataLength;
            const newDomain = {
              start,
              end,
            };
            this.setState({
              klineData: data.result.concat(preData),
              domain: newDomain,
              hasMore: true,
            });
          } else {
            this.setState({
              hasMore: false,
            });
          }
        }).catch((err) => {
          reject(err);
        });
    });
    return promise;
  }


  /**
   * action code
   */
  _changeToKline = () => {
    this.setState({
      chartType: 'kline',
    });
  }

  _changeToTimeline = () => {
    this.setState({
      chartType: 'timeline',
    });
  }

  _updatePlotState = (plotState) => {
    const { chartType } = this.state;
    const { curScale } = plotState;
    const xGridGap = this._getXGridGap(curScale);
    this._plotStateMap[chartType] = plotState;
    this.setState({
      plotState,
      xGridGap,
    });
  }

  _updateDomain = (chartType, newDomain) => {
    this.setState({
      domain: newDomain,
    });
  }

  _getXGridGap = (curScale) => {
    let gapNum = 0;
    if (this.state.chartType === 'kline') {
      if (curScale >= 0.2 && curScale <= 0.4) {
        gapNum = 48;
      } else if (curScale <= 0.7) {
        gapNum = 36;
      } else {
        gapNum = 24;
      }
    }
    return gapNum;
  }

  _onPress = (e, key) => {
    if (key === 'main') {
      this._onMainViewPress(e);
    } else if (key === 'tech') {
      this._onTechViewPress(e);
    }
  }

  _onMainViewPress = () => {
    const { currentMainInd } = this.state;
    let newCurrentMainInd = currentMainInd + 1;
    newCurrentMainInd %= 2;
    this.setState({
      currentMainInd: newCurrentMainInd,
    });
  }

  _onTechViewPress = () => {
    const { currentTechInd } = this.state;
    let newCurrentTechInd = currentTechInd + 1;
    newCurrentTechInd %= 3;
    this.setState({
      currentTechInd: newCurrentTechInd,
    });
  }

  /**
   * 双击事件
   */
  _onDoublePress = () => {
    const { onDoubleTap } = this.props;
    if (onDoubleTap) {
      onDoubleTap();
    }
  }

  /**
   * 长按事件
   */
  _onLongPress = (currentItem) => {
    const { preClosedPrice } = this.state.timelineData;
    this.props.onLongPress && this.props.onLongPress(currentItem, preClosedPrice);
  }

  _getCurrentSettingInfo = () => {
    if (!this._indicators) {
      this._indicators = {};
      this._indicators.MA = [{
        params: { period: 5 },
        selector: data => +data[2],
        stroke: '#EF4E7B',
        dataKey: 'MA5',
      }, {
        params: { period: 10 },
        selector: data => +data[2],
        stroke: '#EFBF6B',
        dataKey: 'MA10',
      }, {
        params: { period: 30 },
        selector: data => +data[2],
        stroke: '#32A5EB',
        dataKey: 'MA30',
      }];
      this._indicators.BOLL = [{
        params: { period: 20, stdDev: 2 },
        selector: data => +data[2],
        stroke: {
          MID: '#EF4E7B',
          UPPER: '#EFBF6B',
          LOWER: '#32A5EB',
        },
        dataKey: 'BOLL',
      }];
      this._indicators.MACD = [{
        params: {
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9,
        },
        selector: data => +data[2],
        stroke: {
          DIFF: '#EF4E7B',
          DEA: '#EFBF6B',
          MACD: '#32A5EB',
          Raise: '#F06448',
          Fall: '#10BC90',
        },
        dataKey: 'MACD',
      }];
      this._indicators.RSI = [{
        params: { period: 6 },
        selector: data => +data[2],
        stroke: '#EF4E7B',
        dataKey: 'RSI1',
      },
      {
        params: { period: 12 },
        selector: data => +data[2],
        stroke: '#EFBF6B',
        dataKey: 'RSI2',
      },
      {
        params: { period: 24 },
        selector: data => +data[2],
        stroke: '#32A5EB',
        dataKey: 'RSI3',
      }];
      this._indicators.KDJ = [{
        params: {
          high: [],
          low: [],
          close: [],
          period: 9,
          kSignalPeriod: 3,
          dSignalPeriod: 3,
        },
        selector: data => [+data[2], +data[3], +data[4]],
        stroke: {
          K: '#EF4E7B',
          D: '#EFBF6B',
          J: '#32A5EB',
        },
        dataKey: 'KDJ',
      }];
    }

    return this._indicators;
  }

  _getCurrentIndicators = () => {
    const { currentMainInd, currentTechInd } = this.state;
    const indicators = this._getCurrentSettingInfo();
    const currentInds = {};
    switch (currentMainInd) {
      case 0:
        currentInds.MA = indicators.MA;
        break;

      case 1:
        currentInds.BOLL = indicators.BOLL;
        break;

      default:
        break;
    }

    switch (currentTechInd) {
      case 0:
        currentInds.MACD = indicators.MACD;
        break;

      case 1:
        currentInds.RSI = indicators.RSI;
        break;

      case 2:
        currentInds.KDJ = indicators.KDJ;
        break;

      default:
        break;
    }

    return currentInds;
  }


  render() {
    const {
      timelineData, klineData, chartType, domain, plotState, hasMore, currentMainInd, currentTechInd, xGridGap,
    } = this.state;
    const indicators = this._getCurrentSettingInfo();
    const timelineBtnColor = chartType === 'timeline' ? 'blue' : 'transparent';
    const timelineBtnTitleColor = chartType === 'timeline' ? 'white' : 'blue';

    const klineBtnColor = chartType === 'timeline' ? 'transparent' : 'blue';
    const klineBtnTitleColor = chartType === 'timeline' ? 'blue' : 'white';

    let techView = null;
    let mainView = null;
    let techInd = null;
    let mainInd = null;
    if (indicators) {
      switch (currentMainInd) {
        case 0:
          mainInd = indicators.MA.map(item => item.dataKey);
          mainView = (
            <Group>
              <MA dataKey={indicators.MA[0].dataKey} stroke={indicators.MA[0].stroke} />
              <MA dataKey={indicators.MA[1].dataKey} stroke={indicators.MA[1].stroke} />
              <MA dataKey={indicators.MA[2].dataKey} stroke={indicators.MA[2].stroke} />
              <MATooltip indicators={indicators.MA} />
            </Group>
          );
          break;

        case 1:
          mainInd = ['BOLL'];
          mainView = (
            <Group>
              <BOLL dataKey={indicators.BOLL[0].dataKey} stroke={indicators.BOLL[0].stroke} />
              <BOLLTooltip indicators={indicators.BOLL} />
            </Group>
          );
          break;

        default:
          break;
      }

      switch (currentTechInd) {
        case 0:
          techInd = ['MACD'];
          techView = (
            <Group>
              <MACD dataKey={indicators.MACD[0].dataKey} stroke={indicators.MACD[0].stroke} barWidth={3} />
              <MACDTooltip indicators={indicators.MACD} yPos={5} />
            </Group>
          );
          break;

        case 1:
          techInd = ['RSI1', 'RSI2', 'RSI3'];
          techView = (
            <Group>
              <RSI dataKey={indicators.RSI[0].dataKey} stroke={indicators.RSI[0].stroke} />
              <RSI dataKey={indicators.RSI[1].dataKey} stroke={indicators.RSI[1].stroke} />
              <RSI dataKey={indicators.RSI[2].dataKey} stroke={indicators.RSI[2].stroke} />
              <RSITooltip indicators={indicators.RSI} yPos={5} />
            </Group>
          );
          break;

        case 2:
          techInd = ['KDJ'];
          techView = (
            <Group>
              <KDJ dataKey={indicators.KDJ[0].dataKey} stroke={indicators.KDJ[0].stroke} />
              <KDJTooltip indicators={indicators.KDJ} yPos={5} />
            </Group>
          );
          break;

        default:
          break;
      }
    }
    const chartView = this.state.chartType === 'timeline' ? (
      <ChartContainer
        style={{
          flex: 1, paddingHorizontal: 10, paddingTop: StyleSheet.hairlineWidth, backgroundColor: 'white',
        }}
        data={timelineData.result}
        horizontal={this.props.isHorizontal}
        statusBarHeight={80}
        preClosedPrice={timelineData.preClosedPrice}
        totalTimelineDataCount={1321}
        xDateTicks={['06:00', '17:00', '04:00']}
        chartType="timeline"
        eventCaptures={['longPress', 'doublePress']}
        plotState={plotState}
        plotConfig={this._plotConfig}
        onLoadMore={() => this._onLoadMore()}
        onLongPress={this._onLongPress}
        onDoublePress={this._onDoublePress}
      >
        <Chart
          style={{ height: 300 }}
          insetBottom={30}
          yExtents={[d => [+d[1]]]}
          yAxisMargin={20}
          yGridNum={2}
        >
          <Background lineColor="gray" lineWidth={StyleSheet.hairlineWidth} />
          <GridLine row={1} colume={1} lineColor="gray" lineWidth={StyleSheet.hairlineWidth} dash={[1.5, 1.5]} />
          <LineSeries yExtents={d => [+d[2]]} lineColor="#EC912E" />
          <AreaSeries dataKey="timeline" yExtents={d => [+d[1]]} raiseColor="#F05B48" fallColor="#10BC90" lightRiseColor="#F05B4800" lightFallColor="#10BC9000" lineWidth={1} />
          <Coordinate position="bottom" />
          <Coordinate position="left" preClosedPrice={+timelineData.preClosedPrice} />
          <Coordinate position="right" preClosedPrice={+timelineData.preClosedPrice} />
          <CrossHair showVerLabel showHorLabel showHorSubLabel isTimestamp preClosedPrice={+timelineData.preClosedPrice} dateFormat="MM-DD HH:mm" />
        </Chart>
      </ChartContainer>
    ) :
      (
        <ChartContainer
          style={{
            flex: 1, paddingHorizontal: 10, paddingBottom: 30, paddingTop: StyleSheet.hairlineWidth, backgroundColor: 'white',
          }}
          data={klineData}
          horizontal={this.props.isHorizontal}
          statusBarHeight={80}
          chartType="kline"
          indicators={indicators}
          threshold={60}
          domain={domain}
          plotState={plotState}
          xGridGap={xGridGap}
          plotConfig={this._plotConfig}
          hasMore={hasMore}
          onLoadMore={() => this._onLoadMore()}
          updateDomain={(curChartType, newDomain) => this._updateDomain(curChartType, newDomain)}
          updatePlotState={newPlotState => this._updatePlotState(newPlotState)}
          eventCaptures={['pan', 'press', 'longPress', 'doublePress', 'pinch']}
          onLongPress={this._onLongPress}
          onPress={this._onPress}
          onPan={this._onPan}
          onDoublePress={this._onDoublePress}
        >
          <Chart
            style={{ height: 230 }}
            chartKey="main"
            insetBottom={30}
            yExtents={[d => [+d[3], d[4]]]}
            indicators={mainInd}
            yAxisMargin={25}
            yGridNum={2}
          >
            <LoadMoreView />
            <Background lineColor="gray" lineWidth={StyleSheet.hairlineWidth} />
            <GridLine row={1} lineColor="gray" lineWidth={StyleSheet.hairlineWidth} />
            <CandleStickSeries raiseColor="#F06448" fallColor="#10BC90" />
            <Coordinate position="bottom" isTimestamp={false} dateFormat="MM-DD" />
            <Coordinate position="left" />
            {mainView}
            <CrossHair showVerLabel showHorLabel isTimestamp={false} dateFormat="MM-DD" />
          </Chart>
          <Chart
            style={{ height: 70 }}
            chartKey="tech"
            yGridNum={2}
            indicators={techInd}
          >
            <Background lineColor="gray" lineWidth={StyleSheet.hairlineWidth} />
            <GridLine row={1} lineColor="gray" dash={[1.5, 1.5]} lineWidth={StyleSheet.hairlineWidth} />
            {techView}
            <Coordinate position="left" isTimestamp />
            <CrossHair showHorLabel isTimestamp />
          </Chart>
        </ChartContainer>
      );

    return (
      <View style={{
        paddingTop: 80, width, height, backgroundColor: 'white',
      }}
      >
        <View style={{
          height: 80, width, alignItems: 'center', justifyContent: 'center',
        }}
        >
          <Text style={{ fontSize: 30 }}>跨平台渲染引擎移动端Demo</Text>
        </View>
        <View style={{
          height: 50, width, alignItems: 'center', justifyContent: 'center',
        }}
        >
          <View style={{
            width: 130, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          }}
          >
            <TouchableHighlight
              style={{
                width: 50, height: 25, borderRadius: 5, borderColor: 'blue', borderWidth: 1, backgroundColor: timelineBtnColor, alignItems: 'center', justifyContent: 'center',
              }}
              onPress={this._changeToTimeline}
            >
              <Text style={{ color: timelineBtnTitleColor }}>分时</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{
                marginLeft: 30, width: 50, height: 25, borderRadius: 5, borderColor: 'blue', borderWidth: 1, backgroundColor: klineBtnColor, alignItems: 'center', justifyContent: 'center',
              }}
              onPress={this._changeToKline}
            >
              <Text style={{ color: klineBtnTitleColor }}>K线</Text>
            </TouchableHighlight>
          </View>
        </View>
        {chartView}
      </View >
    );
  }
}
