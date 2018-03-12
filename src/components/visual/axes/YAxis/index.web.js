//X轴组件
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BaseAxis from '../BaseAxis'

class YAxis extends Component {

	static defaultProps = {
		tickNums:4
	}

	constructor(props){
		super(props)
	}

	render(){
		let { axisAt, showTicks, showGridLine, ...moreProps } = this.props;
		let { yScale } = this.context;
		return (
			<BaseAxis axisAt={axisAt} type='YAxis' showTicks={showTicks} scale={yScale} showGridLine={showGridLine} {...moreProps} />
		)
	}
}

YAxis.propTypes = {
}

YAxis.contextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object,
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func
}

export default YAxis

