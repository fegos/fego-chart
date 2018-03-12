import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LineSeries from '../LineSeries'
import { calcOffset } from '../../common/helper'

class AreaSeries extends Component {
	static defaultProps = {
	}

	constructor(props){
		super(props)
		this.state = {}
	}

	componentWillReceiveProps(nextProps,nextContext){
	}

	draw(){
	}

	render(){
		return null;
	}
}

AreaSeries.contextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object,
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func
}

export default AreaSeries;