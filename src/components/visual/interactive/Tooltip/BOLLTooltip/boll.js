/**
 * BoolTooltip
 */
import React, { Component } from 'react'
import BaseTooltip from '../BaseTooltip'

export default class BOLLTooltip extends Component {
	constructor(props) {
		super(props)
	}
	formatIndicators = (indicators) => {
		let indicatorArr = Array.isArray(indicators) ? indicators : [indicators], valueKeys = [];
		indicatorArr.map(indicator => {
			let strokeArr = Object.keys(indicator.stroke);
			strokeArr.map(stroke => {
				if (stroke === 'MID') stroke = 'middle'
				valueKeys.push(stroke.toLowerCase())
			})
		})
		return valueKeys
	}
	render() {
		let valueKeys = this.formatIndicators(this.props.indicators)
		return (
			<BaseTooltip title='BOLL' type='group' valueKeys={valueKeys} {...this.props} />
		)
	}
}