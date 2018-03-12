import React from 'react'
import { shallow, render, mount } from 'enzyme'
import ChartContainer from '../index.web.js'
import sinon from 'sinon'
import fetch from 'isomorphic-fetch'
// import 'whatwg-fetch'

let data, indicators, nextProps;
beforeEach(() => {
	indicators = {
		MA: [{
			params: { period: 5 },
			selector: (data) => { return +data[1] },
			stroke: 'red',
			dataKey: 'MA5'
		}, {
			params: { period: 10 },
			selector: (data) => { return +data[1] },
			stroke: 'blue',
			dataKey: 'MA10'
		}, {
			params: { period: 30 },
			selector: (data) => { return +data[1] },
			stroke: 'limegreen',
			dataKey: 'MA30'
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
	nextProps = {
		frame: {
			width: 800,
			height: 600,
			padding: {
				left: 50,
				right: 50,
				top: 50,
				bottom: 50
			}
		},
		xExtents: [0, 50],
		indicators
	}
})

describe('ChartContainer', () => {
	it('calls componentDidMount', () => {
		sinon.spy(ChartContainer.prototype, 'componentDidMount')
		return fetch('http://localhost:5001/api/kLineQuote', {
			credentials: 'include'
		}).then((resp) => resp.json()).then((res) => {
			data = res.data.result
			const wrapper = mount(<ChartContainer
				frame={{
					width: 800,
					height: 600,
					padding: { left: 50, right: 50, top: 50, bottom: 50 }
				}}
				xExtents={[0, 50]}
				data={data}
				indicators={indicators}
			>
			</ChartContainer>)
			expect(ChartContainer.prototype.componentDidMount.calledOnce).toEqual(true)
		}).catch((err) => {
			console.log(err)
		})
	})
	it('props&state change', () => {
		const wrapper = mount(<ChartContainer
			frame={{
				width: 800,
				height: 600,
				padding: { left: 50, right: 50, top: 50, bottom: 50 }
			}}
			xExtents={[0, 50]}
			data={data}
			indicators={indicators}
		>
		</ChartContainer>)
		nextProps.data = data
		expect(wrapper.instance().props.xExtents).toEqual(nextProps.xExtents)
		expect(wrapper.instance().props.indicators).toEqual(nextProps.indicators)
		expect(wrapper.state('plotData').indexs).toEqual(nextProps.xExtents)
		expect(wrapper.state('plotData').currentData.length).toBe(50)
		expect(wrapper.state('containerFrame')).toEqual(Object.assign({}, nextProps.frame, {
			chartWidth: 700, chartHeight: 500
		}))
		expect(Object.keys(wrapper.state('plotData').calcedData)).toEqual(['MA5', 'MA10', 'MA30', 'MACD'])
		expect(wrapper.state('xScale').domain()).toEqual([0, 49])
		expect(wrapper.state('xScale').range()).toEqual([0, 700])
		// expect(wrapper).toMatchSnapshot()
	})
	it('events change', () => {
		const wrapper = mount(<ChartContainer
			frame={{
				width: 800,
				height: 600,
				padding: { left: 50, right: 50, top: 50, bottom: 50 }
			}}
			xExtents={[0, 50]}
			data={data}
			indicators={indicators}
		>
		</ChartContainer>)
		sinon.spy(wrapper.instance(), 'updateContainer')
		expect(wrapper.state('events').mouseEnter).toBe(false)
		wrapper.instance().handleMouseEnter()
		expect(wrapper.state('events').mouseEnter).toBe(true)
		wrapper.instance().handleMouseDown({ clientX: 689, clientY: 218 })
		expect(wrapper.state('events').mouseDown).toBe(true)
		wrapper.instance().handleMouseDrag({ clientX: 709, clientY: 218 })
		expect(wrapper.state('plotData').indexs).toEqual([3, 53])
		// expect(wrapper.instance().updateContainer.calledOnce).toEqual(true)
		// console.log(wrapper.instance().updateContainer.callCount)
	})
})