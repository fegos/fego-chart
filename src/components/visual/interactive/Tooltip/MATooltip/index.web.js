/**
 * MATooltip
 */
import React, { Component } from 'react'
import BaseTooltip from '../BaseTooltip'
export default class MATooltip extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<BaseTooltip title='MA' {...this.props} />
		)
	}
}