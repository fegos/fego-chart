//X轴组件
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BaseAxis from '../BaseAxis'

class XAxis extends Component {

	static defaultProps = {
	}

	constructor(props){
		super(props)
	}

	render(){
		let { showTicks, axisAt, showGridLine, ...moreProps } = this.props;
		let { xScale } = this.context;
		return (
			<BaseAxis
			axisAt={axisAt}
			type='XAxis'
			showTicks={showTicks}
			scale={xScale}
			showGridLine={showGridLine}
			{...moreProps}
			/>
		)
	}
}

XAxis.propTypes = {
}

XAxis.contextTypes = {
	context: PropTypes.object,
	plotData: PropTypes.object,
	containerFrame: PropTypes.object,
	chartFrame: PropTypes.object,
	events: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func
}

export default XAxis
