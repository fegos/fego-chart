/**
 * X轴标注
 * @author: Xu Dachi
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ART, StyleSheet } from 'react-native'
const { Surface, Path, Shape, Group, Text } = ART;

export default class XAxisCoordinates extends Component {
	static defaultProps = {
	}	

	constructor(props){
		super(props)
		this.state = {
			path: null
		}
	}

	componentDidMount(){
		const path = Path()
		path
		.moveTo(200,280)
		.lineTo(220,280)
		.lineTo(220,300)
		.lineTo(200,300)
		.close();
		this.setState({
			path
		})
	}

	componentWillReceiveProps(nextProps){
		let { events, xScale, currentItem, plotData } = nextProps
		let { longPressEvent } = events
		if(longPressEvent){
			this.drawXAxisCoordinates([currentItem.x,longPressEvent.y])
		} else {
			this.setState({
				path: null
			})
		}
	}

	drawXAxisCoordinates = (loc) => {
		let { frame } = this.props;
		let { width, height } = frame;
	}

	render(){
		let { path } = this.state;
		let text = "Ok"

		return (
			<Shape d={path} stroke="#000000" fill="#892665" strokeWidth={1} >
				<Text fill="gray" font="bold 12px Heiti SC" x={200} y={280}>{text}</Text>
			</Shape>
		)
	}
}
