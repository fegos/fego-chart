import React, { Component } from 'react'
import PropTypes from 'prop-types'

class EventCapture extends Component {

	constructor(props) {
		super(props)
		this.state = {
			isBindEvent: false
		}
	}

	componentWillReceiveProps(nextProps) {
		let { canvas } = nextProps
		if (this.state.isBindEvent) return
		nextProps.canvas && this.addEventListener(nextProps)
	}

	addEventListener = (nextProps) => {
		let { canvas, eventCaptures } = nextProps
		let eventObj = {}
		//根据eventCaptures设定增加事件监听
		let eventArr = ['onmousemove', 'onmouseenter', 'onmouseleave', 'onmouseup', 'onmousedown','onmousewheel']
		for(let eventItem of eventArr) {
			if(eventCaptures.includes(eventItem) && nextProps[eventItem])
			eventObj[eventItem] = nextProps[eventItem]
		}

		Object.keys(eventObj).map(event => {
			if (Array.isArray(eventObj[event])) {
				eventObj[event].map(handler => {
					canvas.addEventListener(event.slice(2), handler)
				})
			} else {
				canvas.addEventListener(event.slice(2), eventObj[event])
			}
		})
		this.setState({
			isBindEvent: true
		})
	}
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
}

export default EventCapture