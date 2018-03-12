/**
 * OnLoadMore视觉组件
 * @author 徐达迟
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'
import moment from 'moment'
const { Path, Shape, Group, Text } = ART;

const statusMap = {
	preload: '加载更多',
	loading: '加载中...'
}

export default class LoadMoreView extends Component {
	static defaultProps = {
		width: 100,
		visible: true,
		backgroundColor: 'rgba(255,255,255,0)',
		fontColor: '#FFF'
	}

	constructor(props) {
		super(props)
		this._drawInfo = {
			loadViewPath: null,
			loadViewIcon: null,
			loadViewText: null
		}
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		let { width: preWidth, visible: preVisible } = this.props;
		let { frame: preFrame, offset: preOffset, loadStatus: preLoadStatus, hasMore: preHasMore } = this.context
		let { height: preChartHeight } = preFrame;

		let { width, visible } = nextProps;
		let { frame, offset, loadStatus, hasMore } = nextContext;
		let { height: chartHeight } = frame;

		if (width !== preWidth ||
			visible !== preVisible ||
			offset !== preOffset ||
			loadStatus !== preLoadStatus ||
			hasMore !== preHasMore ||
			chartHeight !== preChartHeight) {
			return true;
		}

		return false;
	}

	drawLoadMoreView = () => {
		if (this.context) {
			let chartContext = this.context;
			let { width, visible } = this.props;
			let { frame, offset, loadStatus, hasMore } = chartContext
			let { height: chartHeight } = frame;
			let loadViewPath, loadViewText, loadViewIcon

			//如果没有更多历史数据或者visible属性为false，则不显示任何元素
			if (!hasMore || !visible) {
				this._drawInfo = {
					loadViewPath,
					loadViewText,
					loadViewIcon
				}
			} else {
				//绘制背景
				loadViewPath = ART.Path()
				let xBeg, xEnd
				xBeg = offset - width
				xEnd = offset
				loadViewPath.moveTo(xBeg, 0)
				loadViewPath.lineTo(xEnd, 0)
				loadViewPath.lineTo(xEnd, chartHeight)
				loadViewPath.lineTo(xBeg, chartHeight)
				loadViewPath.close()

				//绘制Icon
				loadViewIcon = {
					x: offset - width * 0.5,
					y: chartHeight * 0.3,
					fill: '#FFF',
					font: '13px "Helvetica Neue"',
					text: String.fromCharCode(0xE638)
				}

				//绘制文案
				loadViewText = {
					x: offset - width * 0.5,
					y: chartHeight * 0.5,
					fill: '#FFF',
					font: '13px "Helvetica Neue"',
					text: statusMap[loadStatus]
				}

				this._drawInfo = {
					loadViewPath,
					loadViewText,
					loadViewIcon
				}
			}
		}
	}

	render() {
		let { backgroundColor, fontColor } = this.props;
		this.drawLoadMoreView();
		let { loadViewPath, loadViewIcon, loadViewText } = this._drawInfo;

		return (
			<Group>
				{loadViewPath ?
					<Shape d={loadViewPath} fill={backgroundColor}></Shape>
					: null
				}
				{loadViewText ?
					<Text
						font={loadViewText.font}
						fill={fontColor}
						x={loadViewText.x}
						y={loadViewText.y}
						alignment="center"
					>
						{loadViewText.text}
					</Text>
					: null
				}
				{loadViewIcon ?
					<Text
						font={loadViewIcon.font}
						fill={fontColor}
						x={loadViewIcon.x}
						y={loadViewIcon.y}
						alignment="center"
					>
						{loadViewIcon.text}
					</Text>
					: null
				}
			</Group>
		)
	}
}

LoadMoreView.contextTypes = {
	data: PropTypes.array,
	domain: PropTypes.object,
	frame: PropTypes.object,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	currentItem: PropTypes.object,
	loadStatus: PropTypes.string,
	offset: PropTypes.number,
	hasMore: PropTypes.bool
}