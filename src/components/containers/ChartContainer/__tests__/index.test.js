import React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer';
// import { shallow, render, mount } from 'enzyme'
import ChartContainer from '../index.js'
// import fetch from 'isomorphic-fetch'
// import { Fetch } from 'nsip-rn';
// import 'whatwg-fetch'

let indicators, nextProps;
beforeEach(() => {
	indicators = {
		MA: [{
			params: { period: 5 },
			selector: (data) => { return +data[2] },
			stroke: 'red',
			dataKey: 'MA5'
		}, {
			params: { period: 10 },
			selector: (data) => { return +data[2] },
			stroke: 'blue',
			dataKey: 'MA10'
		}, {
			params: { period: 30 },
			selector: (data) => { return +data[2] },
			stroke: 'yellow',
			dataKey: 'MA30'
		}],

		BOLL: {
			params: { period: 24, stdDev: 1 },
			selector: (data) => { return +data[2] },
			stroke: {
				upper: 'red',
				middle: 'blue',
				lower: 'limegreen'
			},
			dataKey: 'BOLL'
		},

		RSI: [{
			params: { period: 6 },
			selector: (data) => { return +data[2] },
			stroke: 'red',
			dataKey: 'RSI1'
		},
		{
			params: { period: 12 },
			selector: (data) => { return +data[2] },
			stroke: 'red',
			dataKey: 'RSI2'
		},
		{
			params: { period: 24 },
			selector: (data) => { return +data[2] },
			stroke: 'red',
			dataKey: 'RSI3'
		}],

		MACD: [{
			params: {
				fastPeriod: 12,
				slowPeriod: 26,
				signalPeriod: 9,
			},
			selector: (data) => { return +data[2] },
			stroke: 'red',
			dataKey: 'MACD'
		}]
	}
	nextProps = {
		chartType: 'timeline',
		indicators
	}
})

describe('ChartContainer', () => {
	it('redner', () => {
		//获取数据
		let data = [[1504785282807, 57.88], [1504785342807, 56.79], [1504785402807, 58.68]]
		const wrapper = renderer.create(
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<ChartContainer
					style={{ flex: 0.5, }}
					data={data}
					chartType={'timeline'}
				>
				</ChartContainer>
			</View>)
		console.log(data)
		expect(wrapper.toJSON()).toMatchSnapshot();
		// fetch('http://localhost:5001/api/lineQuote', {
		// 	credentials: 'include'
		// }).then((resp) => resp.json()).then((res) => {
		// 	let data = res.data.result
		// 	const wrapper = renderer.create(
		// 		<View style={{ flex: 1, backgroundColor: 'white' }}>
		// 			<ChartContainer
		// 				style={{ flex: 0.5, }}
		// 				data={data}
		// 				chartType={'timeline'}
		// 			>
		// 			</ChartContainer>
		// 		</View>)
		// 	expect(wrapper.toJSON()).toMatchSnapshot();
		// 	// nextProps.data = data
		// 	// wrapper.instance()._updateIndicatorData(data, indicators)
		// 	// wrapper.instance()._resetDomain(data, nextProps.chartType)
		// 	// expect(wrapper.instance().props.indicators).toEqual(nextProps.indicators)
		// 	// console.log(wrapper.state('domain'), wrapper.state('xScale').domain(),
		// 	// 	wrapper.state('xScale').range(), wrapper.state('xTicks'), wrapper.state('events'),
		// 	// 	Objcet.keys(wrapper.state('indicatorData')))
		// 	// expect(wrapper.state('plotData').indexs).toEqual(nextProps.xExtents)
		// 	// expect(wrapper.state('plotData').currentData.length).toBe(50)
		// 	// expect(wrapper.state('containerFrame')).toEqual(Object.assign({}, nextProps.frame, {
		// 	// 	chartWidth: 700, chartHeight: 500
		// 	// }))
		// 	// expect(Object.keys(wrapper.state('plotData').calcedData)).toEqual(['MA5', 'MA10', 'MA30', 'MACD'])
		// 	// expect(wrapper.state('xScale').domain()).toEqual([0, 49])
		// 	// expect(wrapper.state('xScale').range()).toEqual([0, 700])
		// 	// expect(wrapper.state('events').mouseEnter).toBe(false)
		// 	// wrapper.instance().handleMouseEnter()
		// 	// expect(wrapper.state('events').mouseEnter).toBe(true)

		// 	// expect(wrapper).toMatchSnapshot()
		// })
		// 	.catch((err) => {
		// 		console.log(err)
		// 	})
	})
})