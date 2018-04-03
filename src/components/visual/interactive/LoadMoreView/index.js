/**
 * OnLoadMore视觉组件
 * @author 徐达迟
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART } from 'react-native';


const {
  Shape, Group, Text,
} = ART;


export default class LoadMoreView extends Component {
  static defaultProps = {
    width: 100,
    visible: true,
    backgroundColor: 'rgba(255,255,255,0)',
    fontColor: '#FFF',
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    fontSize: 13,
    preloadText: '加载更多',
    loadingText: '加载中...',
  }

  static propTypes = {
    // 组件宽度
    width: PropTypes.number,
    // 是否可见
    visible: PropTypes.bool,
    // 背景颜色
    backgroundColor: PropTypes.string,
    // 展示颜色
    fontColor: PropTypes.string,
    // 字体集
    fontFamily: PropTypes.string,
    // 字体粗细
    fontWeight: PropTypes.string,
    // 字体大小
    fontSize: PropTypes.number,
    // 预加载文案
    preloadText: PropTypes.string,
    // 加载中文案
    loadingText: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this._drawInfo = {
      loadViewPath: null,
      loadViewIcon: null,
      loadViewText: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.context) !== JSON.stringify(nextContext)) {
      return true;
    }
    return false;
  }

  drawLoadMoreView = () => {
    if (this.context) {
      const {
        width, visible, preloadText, loadingText,
        fontFamily, fontWeight, fontSize, fontColor,
      } = this.props;
      const {
        frame, offset, loadStatus, hasMore,
      } = this.context;
      const { height: chartHeight } = frame;
      let loadViewPath = null;
      let loadViewText = null;
      let loadViewIcon = null;

      // 如果没有更多历史数据或者visible属性为false，则不显示任何元素
      if (!hasMore || !visible) {
        this._drawInfo = {
          loadViewPath,
          loadViewText,
          loadViewIcon,
        };
      } else {
        // 绘制背景
        loadViewPath = ART.Path();
        const left = offset - width;
        const right = offset;
        loadViewPath.moveTo(left, 0);
        loadViewPath.lineTo(right, 0);
        loadViewPath.lineTo(right, chartHeight);
        loadViewPath.lineTo(left, chartHeight);
        loadViewPath.close();

        const font = { fontFamily, fontWeight, fontSize };
        // 绘制Icon
        loadViewIcon = {
          x: offset - width * 0.5,
          y: chartHeight * 0.3,
          fill: fontColor,
          font,
          text: String.fromCharCode(0xE638),
        };
        let loadText;
        if (loadStatus === 'preload') {
          loadText = preloadText;
        } else if (loadStatus === 'loading') {
          loadText = loadingText;
        }
        // 绘制文案
        loadViewText = {
          x: offset - width * 0.5,
          y: chartHeight * 0.5,
          fill: fontColor,
          font,
          text: loadText,
        };

        this._drawInfo = {
          loadViewPath,
          loadViewText,
          loadViewIcon,
        };
      }
    }
  }

  render() {
    const { backgroundColor, fontColor } = this.props;
    this.drawLoadMoreView();
    const { loadViewPath, loadViewIcon, loadViewText } = this._drawInfo;

    return (
      <Group>
        {loadViewPath ?
          <Shape d={loadViewPath} fill={backgroundColor} />
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
    );
  }
}

LoadMoreView.contextTypes = {
  frame: PropTypes.object,
  offset: PropTypes.number,
  hasMore: PropTypes.bool,
  loadStatus: PropTypes.string,
};
