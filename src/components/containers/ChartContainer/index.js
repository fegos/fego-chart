/**
 * ChartContainer组件
 * 
 * @author eric
 */
"use strict";

import React, { Component } from 'react';
import PropTypes from 'prop-types'
import ReactNative, { View, ART, PanResponder, Platform, UIManager, Dimensions } from 'react-native'
const { Surface, Group, Shape } = ART;
import EventCapture from '../../EventCapture'
import { calculateXScale } from '../../../scale'
import { getCurrentItem, CalculateUtil } from '../../../util'

const maxScale = 5;
const minScale = 0.2;
const ScaleAlignment = {
	center: 0,
	left: 1,
	right: 2,
	loc: 3,
}

const ref_container_view = 'ref_container_view';
const window = Dimensions.get("window");
const screenWidth = window.width;
const screenHeight = window.height;

export default class ChartContainer extends Component {
	static defaultProps = {
		horizontal: false,
		statusBarHeight: 0,
		dataOffset: 0,
		eventCaptures: [],
		plotConfig: {
			spacing: 2,
			barWidth: 6,
		},
	}

	static propsType = {

		// 图标类型 eg:timeline|kline
		chartType: PropTypes.string.isRequired,

		// 是否为横屏
		horizontal: PropTypes.bool,

		// 导航栏高度
		statusBarHeight: PropTypes.number,

		// 数据偏移量
		dataOffset: PropTypes.number,

		/**
		 * TimeLine
		 */

		// 昨日收盘价
		preClosedPrice: PropTypes.string,

		// 分时图的数据总量
		totalCount: PropTypes.number,

		// 横坐标轴
		xDateTicks: PropTypes.array,

		/**
		 * KLine
		 */

		// 加载更多偏移阈值
		threshold: PropTypes.number,

		// 指标
		indicators: PropTypes.object,

		/**
		 * common
		 */

		// 图表原始数据
		data: PropTypes.array.isRequired,

		// 图表布局  eg: {x, y, width, height, padding:{left, right, top, bottom}}
		frame: PropTypes.object,

		// 支持的手势
		eventCaptures: PropTypes.array,

		// 显示的数据区间
		domain: PropTypes.object,

		// 图表配置 
		plotConfig: PropTypes.object,

		// 图标状态 eg: {currScale, currBarWidth, currStep, xGridGap}
		plotState: PropTypes.object,

		// 是否还有更多历史数据
		hasMore: PropTypes.bool,

		// 加载更多
		onLoadMore: PropTypes.func,

		// 双击事件
		onDoublePress: PropTypes.func,

		// 长按事件
		onLongPress: PropTypes.func,

		// 滑动事件
		onPan: PropTypes.func,

		// 更新Domain
		updateDomain: PropTypes.func,

		// 更新plotState,主要是barWidth、step、scale的变化
		updatePlotState: PropTypes.func,
	}

	constructor(props) {
		super(props);
		this._frame = this.props.frame;
		this._currentMovedItem = 0;

		this.state = {
			domain: this.props.domain,
			plotState: this.props.plotState,

			indicatorData: {},
			xScale: null,
			xTicks: [],
			events: {},
			offset: 0,
			loadStatus: 'preload'
		}
	}

	componentWillMount() {
		this._updateIndicatorData(this.props);
		this._resetDomain(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (JSON.stringify(nextProps.plotState) !== JSON.stringify(this.props.plotState)) {
			// this.state.plotState = nextProps.plotState;
			// this._updateDomain(this.state.domain, nextProps);
		}

		if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
			this._updateIndicatorData(nextProps);
			if (JSON.stringify(nextProps.domain) === JSON.stringify(this.props.domain)) {
				this._updateDomainWithNewData(nextProps);
			}
		}

		if (JSON.stringify(nextProps.domain) !== JSON.stringify(this.props.domain)) {
			this._resetDomain(nextProps);
		}
	}

	getChildContext() {
		let { chartType, data, preClosedPrice, xDateTicks, plotConfig, hasMore, horizontal } = this.props;
		let { indicatorData, events, xTicks, xScale, offset, loadStatus, plotState, domain } = this.state;
		let { currBarWidth, currStep } = plotState;
		let { spacing } = plotConfig

		let activePlotConfig = {
			step: currStep,
			barWidth: currBarWidth,
			spacing: spacing
		}
		return {
			data: data,
			chartType: chartType,
			xDateTicks: xDateTicks,
			preClosedPrice: Number.parseFloat(preClosedPrice),
			indicatorData: indicatorData,
			plotConfig: activePlotConfig,
			domain: domain,
			events: events,
			xTicks: xTicks,
			xScale: xScale,
			offset: offset,
			loadStatus: loadStatus,
			hasMore: hasMore,
			pressHandler: this._onPressHandler,
			horizontal: horizontal
		}
	}


	/**
	 * 数据处理
	 * 
	 * @memberof ChartContainer
	 */

	/**
	 * 更新指标信息
	 */
	_updateIndicatorData = (props) => {
		let { data, indicators } = props;
		if (data &&
			data.length &&
			indicators) {
			let plotData = {};
			plotData.fullData = data
			//计算indicators
			if (indicators) {
				if (!plotData.calcedData) plotData.calcedData = {}
				CalculateUtil.indicatorsHelper(indicators, plotData)
			}
			this.setState({
				indicatorData: plotData.calcedData
			})
		}
	}

	/**
	 * 重置domain
	 */
	_resetDomain = (props) => {
		let { domain: outerDomain } = props;
		if (outerDomain) {
			this._updateDomain(outerDomain, props);
		} else {
			this._initDomain(props);
		}
	}

	/**
	 * 初始化domain
	 */
	_initDomain = (props) => {
		let { data, chartType, totalCount } = props;

		if (!this._frame || !data || !chartType) {
			return;
		}

		if (!data.length) {
			return;
		}

		if (this._frame.width) {
			if (chartType === 'timeline' || chartType === 'fiveday') {
				let domain = { start: 0, end: totalCount - 1 };
				this._updateDomain(domain, props);
			} else {
				let start = 0;
				let end = 0;
				let dataCount = data.length;
				let screenDataCount = this._getScreenDataCount(props, 1);
				let visibleDataCount = this._getVisibleDataCount(props, 1);
				if (!visibleDataCount) {
					return;
				}

				end = dataCount - 1;
				start = end - screenDataCount + 1;

				let domain = { start: start, end: end };
				this._updateDomain(domain, props);
			}
		}
	}

	/**
	 * Data变更引起的domain更新
	 */
	_updateDomainWithNewData = (nextProps) => {
		let { data, chartType, totalCount } = nextProps;
		let { domain } = this.state;
		if (!this._frame || !data || !chartType) {
			return;
		}
		if (!data.length) {
			return;
		}
		if (!domain) {
			this._initDomain(nextProps);
			return;
		}
		if (chartType === 'timeline' || chartType === 'fiveday') {
			let newDomain = { start: 0, end: totalCount - 1 };
			this._updateDomain(newDomain, nextProps);
		} else {

			let start = 0;
			let end = 0;
			let dataCount = data.length;
			let screenDataCount = this._getScreenDataCount(nextProps, 1);
			let visibleDataCount = this._getVisibleDataCount(nextProps, 1);

			if (screenDataCount < visibleDataCount) {
				start = 0;
				end = dataCount - 1;
			} else {
				start = domain.start;
				end = domain.end;
				let preScreenDataCount = end - start + 1;

				if (preScreenDataCount < screenDataCount) {
					if (start + screenDataCount > dataCount) {
						end = dataCount - 1;
						start = end - screenDataCount + 1;
					} else {
						if (start === 0 && preScreenDataCount === 0) {
							end = dataCount - 1;
						} else {
							end = start + screenDataCount - 1;
						}
						start = end - screenDataCount + 1;
					}
				} else if (preScreenDataCount > screenDataCount) {
					end = start + screenDataCount - 1;
				} else {
					if (this.props.data.length < data.length &&
						end === this.props.data.length - 1) {
						end = data.length - 1;
						start = end - screenDataCount + 1;
					}
				}
			}
			let newDomain = {
				start: start,
				end: end
			}
			this._updateDomain(newDomain, nextProps);
		}
	}

	/**
	 * 更新domain
	 */
	_updateDomain = (newDomain, props) => {
		let { data, chartType, xDateTicks, updateDomain, domain: outerDomain } = props;
		let { plotState } = this.state;
		let { currBarWidth, xGridGap } = plotState;
		let { start, end } = newDomain;
		let chartWidth = this._getChartWidth();
		let screenDataCount = end - start + 1;
		let dataCount = data.length;
		let indexDomain;
		let frame = { x: 0, chartWidth: chartWidth };
		let xTicks = [];
		if (chartType === 'timeline') {
			indexDomain = [0, screenDataCount - 1];
			let ticksCount = xDateTicks.length;
			let gap = (screenDataCount - 1) / (ticksCount - 1);
			for (let idx = 0; idx < ticksCount; idx++) {
				xTicks.push(gap * idx);
			}
		} else if (chartType === 'fiveday') {
			indexDomain = [0, screenDataCount - 1];
			let ticksCount = xDateTicks.length;
			let gap = (screenDataCount - 1) / 10;
			for (let idx = 1; idx < 10; idx += 2) {
				xTicks.push(gap * idx);
			}
		} else {
			indexDomain = [0, this._getVisibleDataCount(props, 1) - 1];
			frame = { x: currBarWidth / 2, chartWidth: chartWidth - currBarWidth / 2 }
			for (let idx = 0; idx < screenDataCount - 1; idx++) {
				if ((dataCount - 1 - start - idx) % xGridGap === 0) {
					xTicks.push(idx);
				}
			}
		}
		let xScale = calculateXScale(indexDomain, frame, 'index');
		if (outerDomain) {
			if (start !== outerDomain.start || end !== outerDomain.end) {
				updateDomain && updateDomain(chartType, newDomain);
			}
		} else {
			updateDomain && updateDomain(chartType, newDomain);
		}

		this.setState({
			domain: newDomain,
			xTicks: xTicks,
			xScale: xScale
		})
	}

	/**
	 * 获取可显示的最大数据量
	 */
	_getVisibleDataCount = (props, scale) => {
		let { plotConfig } = props;
		let { plotState } = this.state;
		let { spacing } = plotConfig;
		let { currBarWidth } = plotState;
		let chartWidth = this._getChartWidth();
		let visibleCount = Math.round((chartWidth - currBarWidth * scale) / (spacing + currBarWidth * scale) + 1);
		return visibleCount;
	}

	/**
	 * 获取屏幕中显示的数据量
	 */
	_getScreenDataCount = (props, scale) => {
		let { data } = props;
		let dataCount = data.length;
		if (dataCount) {
			let visibleCount = this._getVisibleDataCount(props, scale);
			if (dataCount < visibleCount) {
				return dataCount;
			} else {
				return visibleCount;
			}
		} else {
			return 0;
		}
	}

	/**
	 * 获取当前数据
	 */
	_getCurrentItemData = (data, domain, xScale, locationX) => {
		let actualData = data.slice(domain.start, domain.end + 1);
		let currentItemIdx = getCurrentItem(xScale, null, [locationX], actualData, 'index')
		let currentItem = actualData[currentItemIdx]
		return currentItem
	}


	/**
	 *  布局模块
	 * 
	 * @memberof ChartContainer
	 */

	_updateFrame = (e) => {
		let { frame, data, domain, chartType, horizontal, statusBarHeight } = this.props;
		// 当没有通过props指定frame时更新。
		if (!frame) {
			let containerView = ReactNative.findNodeHandle(this.refs[ref_container_view]);
			UIManager.measureInWindow(containerView, (x, y, s_width, s_height) => {
				let { padding, paddingHorizontal, paddingVertical, paddingLeft, paddingRight, paddingTop, paddingBottom } = this.props.style;
				let left = paddingLeft ? paddingLeft : paddingHorizontal ? paddingHorizontal : padding ? padding : 0;
				let right = paddingRight ? paddingRight : paddingHorizontal ? paddingHorizontal : padding ? padding : 0;
				let top = paddingTop ? paddingTop : paddingVertical ? paddingVertical : padding ? padding : 0;
				let bottom = paddingBottom ? paddingBottom : paddingVertical ? paddingVertical : padding ? padding : 0;
				if (horizontal) {
					if (Platform.OS === 'ios') {
						this._frame = {
							x: y,
							y: screenWidth - s_width - x,
							width: s_height,
							height: s_width,
							padding: {
								top: top,
								left: left,
								bottom: bottom,
								right: right
							}
						}
					} else {
						this._frame = {
							x: y + statusBarHeight,
							y: screenWidth - x,
							width: s_width,
							height: s_height,
							padding: {
								top: top,
								left: left,
								bottom: bottom,
								right: right
							}
						}
					}
				} else {
					this._frame = {
						x: x,
						y: y,
						width: s_width,
						height: s_height,
						padding: {
							top: top,
							left: left,
							bottom: bottom,
							right: right
						}
					}
				}

				this._resetDomain(this.props);
			});
		}
	}

	/**
	 * 获取实际图表绘制区域宽度
	 */
	_getChartWidth = () => {
		if (this._frame) {
			let { width, padding } = this._frame;
			let { left, right } = padding;
			let chartWidth = width - left - right;
			return chartWidth;
		}
		return 0;
	}


	/**
	 * 手势处理
	 * 
	 * @memberof ChartContainer
	 */

	_updateDomainWithPan = (dx, dy) => {
		let { data, chartType, plotConfig, horizontal } = this.props;
		let { plotState, domain } = this.state;
		let { start, end } = domain;
		let { currStep } = plotState;
		let dataCount = data.length;
		if (horizontal) {
			dx = dy;
		}
		if (end === dataCount - 1 && dx < 0) {
			return false;
		}

		if (start === 0 && dx > 0) {
			let actualDX = dx - currStep * this._currentMovedItem;
			this.setState({
				offset: actualDX
			})
			return;
		}

		let shouldUpdate = false;
		let movedItem = Math.floor(dx / currStep);
		let changeItemCount = movedItem - this._currentMovedItem;
		if (Math.abs(changeItemCount) >= 1) {
			this._currentMovedItem = movedItem;
			let screenDataCount = end - start + 1;
			if (start - changeItemCount < 0) {
				if (start !== 0) {
					start = 0;
					end = start + screenDataCount - 1;
					shouldUpdate = true;
				} else {
					shouldUpdate = false;
				}
			} else {
				let rightIndex = start + screenDataCount;
				if (rightIndex - changeItemCount > dataCount) {
					if (rightIndex !== dataCount) {
						start = dataCount - screenDataCount;
						end = start + screenDataCount - 1;
						shouldUpdate = true;
					} else {
						shouldUpdate = false;
					}
				} else {
					start -= changeItemCount;
					end = start + screenDataCount - 1;
					shouldUpdate = true;
				}
			}
			if (shouldUpdate) {
				let newDomain = {
					start: start,
					end: end
				}
				this._updateDomain(newDomain, this.props);
			}
		}
	}

	_updateDomainWithPinch = (e, scale, alignment, loc, updateActiveSpan) => {
		let { plotConfig, data, chartType, updatePlotState } = this.props;
		let { plotState, domain } = this.state;
		let { currStep, currScale, currBarWidth } = plotState;
		let { maxScale, minScale, barWidth, spacing } = plotConfig;
		let { start, end } = domain;
		if ((currScale * scale > maxScale && scale > 1) ||
			(currScale * scale < minScale && scale < 1)) {
			return false;
		}

		let chartWidth = this._getChartWidth();
		let dataCount = data.length;
		let threshold = 1;
		let preScreenDataCount = end - start + 1;
		if (start === 0 || start + preScreenDataCount === dataCount) {
			threshold = 1;
		} else if (alignment === ScaleAlignment.center || alignment === ScaleAlignment.loc) {
			threshold = 2;
		}
		if (Math.abs(1 - scale) * chartWidth < threshold * (spacing + currBarWidth * scale)) {
			return false;
		}

		let screenDataCount = this._getScreenDataCount(this.props, scale);
		if (alignment === ScaleAlignment.left) {
			if (start + screenDataCount > dataCount) {
				if (preScreenDataCount < screenDataCount) {
					screenDataCount = dataCount - start;
					end = dataCount - 1;
					let currentBarWidth = (chartWidth - barWidth) / (screenDataCount - 1) - spacing;
					currScale = currentBarWidth / barWidth;
				} else {
					if (start <= 0) {
						return false;
					} else {
						return this._updateDomainWithPinch(e, scale, ScaleAlignment.right, loc, updateActiveSpan);
					}
				}
			} else {
				currScale *= scale;
				end = start + screenDataCount - 1;
			}
		} else if (alignment === ScaleAlignment.right) {
			let rightIndex = start + preScreenDataCount - 1;
			let leftIndex = rightIndex - screenDataCount + 1;
			if (leftIndex < 0) {
				if (start > 0) {
					start = 0;
					screenDataCount = rightIndex + 1;
					end = start + screenDataCount - 1;
					let currentBarWidth = (chartWidth - currBarWidth) / (screenDataCount - 1) - spacing
					currScale = currentBarWidth / barWidth;
				} else {
					if (rightIndex >= dataCount) {
						return false;
					} else {
						return this._updateDomainWithPinch(e, scale, ScaleAlignment.left, loc, updateActiveSpan);
					}
				}
			} else {
				currScale *= scale;
				start = rightIndex - screenDataCount + 1;
				end = start + screenDataCount - 1;
			}
		} else if (alignment === ScaleAlignment.center || alignment === ScaleAlignment.loc) {
			let rightIndex = start + preScreenDataCount - 1;
			if (start == 0 && scale < 1) {
				return this._updateDomainWithPinch(e, scale, ScaleAlignment.left, loc, updateActiveSpan);
			}
			if (rightIndex == dataCount - 1 && scale < 1) {
				return this._updateDomainWithPinch(e, scale, ScaleAlignment.right, loc, updateActiveSpan);
			}
			let locRatio = 0.5;
			if (ScaleAlignment.loc === alignment) {
				locRatio = loc / chartWidth;
			}
			let changeCount = screenDataCount - preScreenDataCount;
			let leftChangeCount = Math.round(changeCount * locRatio);
			let rightChangeCount = changeCount - leftChangeCount;
			if (start - leftChangeCount < 0) {
				rightChangeCount = changeCount - start;
				start = 0;
				if (rightIndex + rightChangeCount + 1 >= dataCount) {
					let currentBarWidth = (chartWidth - currBarWidth) / (screenDataCount - 1) - spacing;
					currScale = currentBarWidth / barWidth;
				} else {
					currScale *= scale;
				}
				end = start + screenDataCount - 1;
			} else {
				if (rightIndex + rightChangeCount + 1 >= dataCount) {
					leftChangeCount = changeCount - (dataCount - 1 - rightIndex);
					rightIndex = dataCount - 1;
					if (start - leftChangeCount < 0) {
						start = 0;
						screenDataCount = dataCount;
						let currentBarWidth = (chartWidth - currBarWidth) / (screenDataCount - 1) - spacing;
						currScale = currentBarWidth / barWidth;
					} else {
						start -= leftChangeCount;
						currScale *= scale;
					}
					end = start + screenDataCount - 1;
				} else {
					start -= leftChangeCount;
					end = start + screenDataCount - 1;
					currScale *= scale;
				}
			}
		}

		let curVisibleCount = Math.round((chartWidth - barWidth * currScale) / (spacing + barWidth * currScale) + 1);
		currStep = (chartWidth - barWidth * currScale) / (curVisibleCount - 1);
		currBarWidth = currStep - spacing;
		currScale = currBarWidth / barWidth;

		let newPlotState = {
			currBarWidth: currBarWidth,
			currStep: currStep,
			currScale: currScale,
		}
		updatePlotState && updatePlotState(newPlotState);
		this.state.plotState = newPlotState
		let newDomain = {
			start: start,
			end: end
		}
		this._updateDomain(newDomain, this.props);
		updateActiveSpan && updateActiveSpan(e);
	}


	/**
	 * 事件处理模块
	 * 
	 * @memberof ChartContainer
	 */

	/**
	 * 点击事件处理
	 */
	_onPressHandler = (pressEvent, key) => {
		let { onPress } = this.props;
		onPress && onPress(pressEvent, key);
		let { events } = this.state;
		let updateEvents = Object.assign({}, events);
		updateEvents.pressEvent = null;
		this.setState({
			events: updateEvents
		})
	}

	/**
	 * 加载更多
	 */
	_onLoadMore = () => {
		let { onLoadMore, data } = this.props;
		let { domain } = this.state;
		let { start, end } = domain;
		if (onLoadMore) {
			onLoadMore().then(
				(newData) => {
					this._currentMovedItem = 0;
					this.setState({
						loadStatus: 'preload',
						offset: 0
					})
				}
			).catch(
				err => {
					this._currentMovedItem = 0;
					this.setState({
						loadStatus: 'preload',
						offset: 0
					})
				}
				)
		}
	}



	/**
	 * 
	 * 手势事件处理模块
	 * 
	 * @memberof ChartContainer
	 */


	/**
	 * 滑动手势
	 */
	_onPan = (eventState, e, gestureState) => {
		let { onPan } = this.props;
		if (eventState === EventCapture.EventState.end) {
			let { threshold, hasMore } = this.props;
			let { offset, loadStatus } = this.state;
			if (hasMore) {
				if (offset > threshold) {
					this._onLoadMore();
					this.setState({
						loadStatus: 'loading'
					})
				} else {
					this._currentMovedItem = 0;
					this.setState({
						offset: 0
					})
				}
			} else {
				this._currentMovedItem = 0;
				this.setState({
					offset: 0
				})
			}
			onPan && onPan(null, null);
		} else {
			let { dx, dy } = gestureState;
			this._updateDomainWithPan(dx, dy);
			if (onPan) {
				onPan(dx, dy);
			}
		}
	}

	/**
	 * 单击
	 */
	_onPress = (eventState, e, gestureState) => {
		let { events } = this.state;
		let { horizontal } = this.props;
		if (this._frame && events) {
			let { x, y, width, padding } = this._frame;
			let { left, right, top, bottom } = padding;
			let { pageX, pageY } = e.nativeEvent;
			if (horizontal) {
				let tempX = pageX;
				pageX = pageY;
				pageY = screenWidth - tempX;
			}
			let locationX = pageX - x - left;
			let locationY = pageY - y - top;
			let updateEvents = Object.assign({}, events);
			updateEvents.pressEvent = {
				x: locationX,
				y: locationY
			}
			this.setState({
				events: updateEvents
			})
		}
	}

	/**
	 * 长按手势
	 */
	_onLongPress = (eventState, e, gestureState) => {
		let { onLongPress, data, horizontal, dataOffset } = this.props;
		let { events, domain, xScale } = this.state;

		let updateEvents = Object.assign({}, events);
		if (eventState === EventCapture.EventState.end) {
			updateEvents.longPressEvent = null
			if (typeof onLongPress === 'function') {
				onLongPress(null)
			}
		} else {
			if (e && e.nativeEvent && this._frame && xScale) {
				let { x, y, width, padding } = this._frame;
				let { left, right, top, bottom } = padding;
				let { pageX, pageY, locationX: locX } = e.nativeEvent;
				let locationX;
				let locationY;
				if (horizontal) {
					let tempX = pageX;
					pageX = pageY;
					pageY = screenWidth - tempX;
					locationX = pageX - x - left;
				} else {
					if (Platform.OS === 'ios') {
						locationX = locX;
					} else {
						locationX = pageX - x - left;
					}
				}
				locationY = pageY - y - top;
				let rightSide = xScale(data.length - 1);
				let leftSide = xScale(dataOffset);
				let actualWidth = width - left - right;
				if (rightSide > actualWidth) {
					rightSide = actualWidth;
				}
				if (locationX < leftSide) {
					locationX = leftSide;
				}
				if (locationX > rightSide) {
					locationX = rightSide;
				}
				updateEvents.longPressEvent = {
					x: locationX,
					y: locationY
				}

				//将currentItem数据传入onLongPress回调
				if (typeof onLongPress === 'function') {
					let locationX = updateEvents.longPressEvent.x
					let currentItem = this._getCurrentItemData(data, domain, xScale, locationX)
					onLongPress(currentItem)
				}
			}
		}

		this.setState({
			events: updateEvents
		})
	}

	// 双击
	_onDoublePress = (eventState, e, gestureState) => {
		let { onDoublePress } = this.props;
		onDoublePress && onDoublePress();
	}

	// 放缩
	_onPinch = (eventState, e, totalScale, activeScale, updateActiveSpan) => {
		let { events } = this.state;
		let pinchEvent = Object.assign({}, events);
		if (e && e.nativeEvent) {
			let { touches } = e.nativeEvent;
			let loc = this._frame.width / 2;
			if (touches && touches.length === 2) {
				loc = (touches[0].locationX + touches[1].locationX) / 2;
			}
			this._updateDomainWithPinch(e, activeScale, ScaleAlignment.loc, loc, updateActiveSpan);
		}
	}


	/**
	 * 渲染模块
	 * 
	 * @returns 
	 * @memberof ChartContainer
	 */

	render() {
		let { frame, children, eventCaptures } = this.props;
		let style = {
			position: 'relative',
		}
		if (frame) {
			let { padding, width, height } = frame;
			Object.assign(style, { padding: padding, width: width, height: height });
		} else {
			Object.assign(style, { flex: 1 });
		}
		Object.assign(style, this.props.style)

		return (
			<View
				ref={ref_container_view}
				style={style}
				onLayout={(e) => {
					this._updateFrame(e)
				}}>
				<EventCapture
					style={{ flex: 1 }}
					eventCaptures={eventCaptures}
					onPan={this._onPan}
					onPress={this._onPress}
					onPinch={this._onPinch}
					onLongPress={this._onLongPress}
					onDoublePress={this._onDoublePress}
				>
					{children}
				</EventCapture>
			</View>
		)
	}
}

ChartContainer.childContextTypes = {
	data: PropTypes.array,
	chartType: PropTypes.string,
	xDateTicks: PropTypes.array,
	preClosedPrice: PropTypes.number,
	indicatorData: PropTypes.object,
	plotConfig: PropTypes.object,
	domain: PropTypes.object,
	events: PropTypes.object,
	xTicks: PropTypes.array,
	xScale: PropTypes.func,
	offset: PropTypes.number,
	loadStatus: PropTypes.string,
	hasMore: PropTypes.bool,
	pressHandler: PropTypes.func,
	horizontal: PropTypes.bool
}
