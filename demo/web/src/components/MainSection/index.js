import React, { Component } from 'react'
import style from './style.css'
import 'whatwg-fetch'
import { Layout, Menu, Breadcrumb, Icon, Button, Slider, InputNumber, Row, Col } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
import { Components } from '../../chart-engine/src'
// import { Components } from 'fego-chart'
let { ChartContainer, Series, Axes, Coordinates, Tooltip, Chart, Background } = Components;
let { XAxis, YAxis } = Axes;
let { LineSeries, CandleStickSeries, Technicalindicators } = Series;
let { TestTooltip, MovingAverageTooltip, RSITooltip, MACDTooltip } = Tooltip;
let { MACD } = Technicalindicators
let { CrossHairCursor } = Coordinates;

class MainSection extends Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			data: [],
			showKLine: true,
			showMACD: true,
			chartBackgroundFilled: false,
			showGridLine: true,
			firstMAPeriod: 5,
			secondMAPeriod: 10,
			thirdMAPeriod: 30
		}
	}

	componentDidMount() {
		//获取数据
		fetch('/api/kLineQuote', {
			credentials: 'include'
		})
			.then((resp) => resp.json())
			.then((res) => {
				this.setState({
					data: res.data.result
				})
			})
			.catch((err) => {
				console.log(err)
			})
	}

	toggleSeries = () => {
		this.setState({
			showKLine: !this.state.showKLine
		})
	}

	toggleSubSeries = () => {
		this.setState({
			showMACD: !this.state.showMACD
		})
	}

	toggleChartBackground = () => {
		this.setState({
			chartBackgroundFilled: !this.state.chartBackgroundFilled
		})
	}

	toggleGridLine = () => {
		this.setState({
			showGridLine: !this.state.showGridLine
		})
	}

	onChangeFstMAPeriod = (e) => {
		this.setState({
			firstMAPeriod: e
		})
	}

	onChangeSecMAPeriod = (e) => {
		this.setState({
			secondMAPeriod: e
		})
	}

	onChangeTrdMAPeriod = (e) => {
		this.setState({
			thirdMAPeriod: e
		})
	}

	_renderControlPanel = () => {
		let {
			firstMAPeriod,
			secondMAPeriod,
			thirdMAPeriod
		} = this.state;

		return (
			<div className={style.controlPanel}>
				<Row>
					<Col span={10} style={{ marginBottom: 10 }}>
						<Button type="primary" onClick={this.toggleSeries}>切换主图线型</Button>
					</Col>
				</Row>
				<Row>
					<Col span={10} style={{ marginBottom: 10 }}>
						<Button type="primary" onClick={this.toggleSubSeries}>切换副图线型</Button>
					</Col>
				</Row>
				<Row>
					<Col span={10} style={{ marginBottom: 10 }}>
						<Button type="primary" onClick={this.toggleChartBackground}>更换背景</Button>
					</Col>
				</Row>
				<Row>
					<Col span={10} style={{ marginBottom: 10 }}>
						<Button type="primary" onClick={this.toggleGridLine}>显示网格</Button><br />
					</Col>
				</Row>
				<Row>
					<Col span={6}>MA1周期</Col>
					<Col span={8}>
						<Slider min={1} max={9} onChange={this.onChangeFstMAPeriod} value={firstMAPeriod} />
					</Col>
					<Col span={8} offset={2}>
						<InputNumber min={1} max={9} value={firstMAPeriod} onChange={this.onChangeFstMAPeriod} />
					</Col>
				</Row>
				<Row>
					<Col span={6}>MA2周期</Col>
					<Col span={8}>
						<Slider min={10} max={20} onChange={this.onChangeSecMAPeriod} value={secondMAPeriod} />
					</Col>
					<Col span={8} offset={2}>
						<InputNumber min={10} max={20} value={secondMAPeriod} onChange={this.onChangeSecMAPeriod} />
					</Col>
				</Row>
				<Row>
					<Col span={6}>MA3周期</Col>
					<Col span={8}>
						<Slider min={25} max={35} onChange={this.onChangeTrdMAPeriod} value={thirdMAPeriod} />
					</Col>
					<Col span={8} offset={2}>
						<InputNumber min={25} max={35} value={thirdMAPeriod} onChange={this.onChangTrdcMAPeriod} />
					</Col>
				</Row>
			</div>
		)
	}

	render() {
		let {
			showKLine,
			showMACD,
			chartBackgroundFilled,
			firstMAPeriod,
			secondMAPeriod,
			thirdMAPeriod,
			showGridLine
		} = this.state;

		let indicators = {
			MA: [{
				params: { period: firstMAPeriod },
				selector: (data) => { return +data[1] },
				stroke: 'red',
				dataKey: 'MA' + firstMAPeriod
			}, {
				params: { period: secondMAPeriod },
				selector: (data) => { return +data[1] },
				stroke: 'blue',
				dataKey: 'MA' + secondMAPeriod
			}, {
				params: { period: thirdMAPeriod },
				selector: (data) => { return +data[1] },
				stroke: 'limegreen',
				dataKey: 'MA' + thirdMAPeriod
			}],
			MACD: [{
				params: {
					fastPeriod: 5,
					slowPeriod: 8,
					signalPeriod: 3
				},
				selector: (data) => { return + data[1] },
				stroke: {
					macd: "#FF0000",
					signal: "#00F300",
					divergence: "#4682B4"
				},
				dataKey: 'MACD'
			}]
		}

		let subYExtents = showMACD ? [indicators.MACD[0].dataKey] : [d => +d[2]]

		return (
			<section className={style.main}>
				{this._renderControlPanel()}
				<ChartContainer
					frame={{
						width: 800,
						height: 600,
						padding: {
							left: 50,
							right: 50,
							top: 50,
							bottom: 50
						}
					}}
					data={this.state.data}
					xExtents={[0, 50]}
					indicators={indicators}
				>
					<Chart
						frame={{
							height: 350,
							origin: [0, 0],
							top: true
						}}
						yExtents={[
							d => +d[2], d => [+d[1], +d[2], +d[3], +d[4]],
							indicators.MA[0].dataKey, indicators.MA[1].dataKey,
							indicators.MA[2].dataKey
						]}
					>
						<Background filled={chartBackgroundFilled} bordered={true} />
						<XAxis axisAt="bottom" />
						<YAxis axisAt="right" showTicks={true} showGridLine={showGridLine} />
						<LineSeries dataKey={indicators.MA[0].dataKey} stroke={indicators.MA[0].stroke} />
						<LineSeries dataKey={indicators.MA[1].dataKey} stroke={indicators.MA[1].stroke} />
						<LineSeries dataKey={indicators.MA[2].dataKey} stroke={indicators.MA[2].stroke} />
						{showKLine ?
							<CandleStickSeries /> :
							<LineSeries yAccessor={d => +d[2]} stroke="skyblue" />
						}
						<MovingAverageTooltip indicators={indicators.MA} />
						<RSITooltip />
					</Chart>
					<Chart
						frame={{
							height: 150,
							origin: [0, 400]
						}}
						yExtents={subYExtents}
					>
						<Background filled={chartBackgroundFilled} bordered={true} />
						<XAxis axisAt="bottom" showTicks={true} />
						<YAxis axisAt="right" showTicks={true} showGridLine={showGridLine} />
						{showMACD ?
							<MACD dataKey={indicators.MACD[0].dataKey} appearance={{
								stroke: {
									macd: "#FF0000",
									signal: "#00F300",
								},
								fill: {
									divergence: "#4682B4"
								}
							}} /> :
							<LineSeries yAccessor={d => +d[2]} stroke='skyblue' />
						}
						{showMACD ? <MACDTooltip indicators={indicators.MACD[0]} /> : null}
					</Chart>
					<CrossHairCursor stroke={chartBackgroundFilled ? '#FFF' : '#000'} />
				</ChartContainer>
			</section>
		)
	}
}

export default MainSection
