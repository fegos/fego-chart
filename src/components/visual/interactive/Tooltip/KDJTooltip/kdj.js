/**
 * KDJTooltip
 */
import React, { Component } from 'react'
import BaseTooltip from '../BaseTooltip'
export default class KDJTooltip extends Component {
	constructor(props) {
		super(props)
	}
	formatIndicators = (indicators) => {
		let indicatorArr = Array.isArray(indicators) ? indicators : [indicators], valueKeys = [], tempIndicators = [];
		tempIndicators = JSON.parse(JSON.stringify(indicatorArr))
		indicatorArr.map((indicator, idx) => {
			let strokeArr = Object.keys(indicator.stroke);
			delete tempIndicators[idx].params.high
			delete tempIndicators[idx].params.low
			delete tempIndicators[idx].params.close
			strokeArr.map(stroke => {
				valueKeys.push(stroke.toLowerCase())
			})
		})
		return [valueKeys, tempIndicators]
	}
	render() {
		let res = this.formatIndicators(this.props.indicators);
		let valueKeys = res[0]
		let indicators = res[1]
		return (
			<BaseTooltip title='KDJ' type='group' valueKeys={valueKeys} {...this.props} indicators={indicators} />
		)
	}
}