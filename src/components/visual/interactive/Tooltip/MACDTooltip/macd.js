/**
 * MACDTooltip
 */
import React, { Component } from 'react'
import BaseTooltip from '../BaseTooltip'

export default class macdTooltip extends Component {
	constructor(props) {
		super(props)
	}
	formatIndicators = (indicators) => {
		let indicatorArr = Array.isArray(indicators) ? indicators : [indicators], valueKeys = [], tempIndicators = [];
		tempIndicators = JSON.parse(JSON.stringify(indicatorArr))
		indicatorArr.map((indicator, idx) => {
			let strokeArr = Object.keys(indicator.stroke);
			strokeArr.map(stroke => {
				switch (stroke) {
					case 'MACD':
						valueKeys.push('histogram')
						break;
					case 'DIFF':
						valueKeys.push('MACD')
						break;
					case 'DEA':
						valueKeys.push('signal')
						break;
					default:
						delete tempIndicators[idx].stroke[stroke]
						break;
				}
			})
		})
		return [valueKeys, tempIndicators]
	}
	render() {
		let res = this.formatIndicators(this.props.indicators);
		let valueKeys = res[0]
		let indicators = res[1]
		return (
			<BaseTooltip title='MACD' type='group' valueKeys={valueKeys} {...this.props} indicators={indicators} />
		)
	}
}