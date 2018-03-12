/**
 * RSITooltip
 */
import React, { Component } from 'react'
import BaseTooltip from '../BaseTooltip'
export default class RSITooltip extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<BaseTooltip title='RSI' {...this.props} />
		)
	}
}