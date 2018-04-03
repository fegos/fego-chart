import containers from './containers';
import visual from './visual';


const {
  ChartContainer,
  Chart,
} = containers;

const {
  axes,
  Background,
  indicators,
  interactive,
  series,
} = visual;

const {
  Coordinate,
  GridLine,
} = axes;

const {
  RSI,
  MA,
  BOLL,
  MACD,
  KDJ,
} = indicators;

const {
  CrossHair,
  LoadMoreView,
  Tooltip,
} = interactive;

const {
  AreaSeries,
  CandleStickSeries,
  LineSeries,
} = series;


export default {
  ChartContainer,
  Chart,
  axes,
  indicators,
  interactive,
  series,
  Background,
  Coordinate,
  GridLine,
  AreaSeries,
  LineSeries,
  CandleStickSeries,
  RSI,
  MA,
  MACD,
  KDJ,
  BOLL,
  CrossHair,
  LoadMoreView,
  Tooltip,
};
