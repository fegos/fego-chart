import containers from './containers'
import visual from './visual'


let {
	ChartContainer,
	Chart
} = containers

let {
	axes,
	Background,
	indicators,
	interactive,
	series
} = visual

let {
	Coordinate,
	GridLine
} = axes

let {
	RSI,
	MA,
	BOLL,
	MACD,
	KDJ
} = indicators

let {
	CrossHair,
	LoadMoreView,
	Tooltip
} = interactive

let {
	AreaSeries,
	CandleStickSeries,
	LineSeries
} = series


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
	Tooltip
}
