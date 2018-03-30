---
layout: default
id: coordinate
title: Coordinate
---

## mobile

### 使用示例

~~~

<Coordinate position={'bottom'} isTimestamp={false} dateFormat={dateFormat} />
<Coordinate position={'left'} />
								
~~~

### Props

| 属性 | 说明 | 类型 | isRequired| 默认值 |
|:-- | :-- | :-- |:-- |:-- |
| position | 坐标位置（top \| bottom \| left \| right） | string |是| 无 |
| isTimeStamp | 传入日期是否为时间戳 | bool | 否 | true |
| dateFormat | 日期格式 | string |否| MM-DD HH:mm |
| timezome | 时区 | string |否| Asia/Shanghai |
| fontSize | 字体大小（暂时无效）| number |否| 9 |
| font | 字体| string |否| 9px Heiti SC |
| color | 字体颜色 | string |否| #8F8F8F |
| riseColor | 上涨颜色 | string |否| #F05B48 |
| fallColor | 下跌颜色 | string |否| #10BC90 |
| centerTickOffset | 五日图横坐标偏移量 | number |否| 10 |

