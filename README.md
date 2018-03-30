# NSIP行情图表引擎库

## 项目说明：
fego-chart: 跨平台行情图表引擎库

## 当前版本以及依赖
+ v0.1.3
+ 依赖
	+ react: v16 alpha-6
	+ rn: 0.44
	+ babel-loader: 7.x

## 行情图表引擎小组：
+ 徐达迟 bjxudachi@corp.netease.com
+ 付鑫 bjfuxin1@corp.netease.com
+ 沈文兴 bjshenwenxing@corp.netease.com
+ 荆博 bjjingbo@corp.netease.com
+ 马腾 tengma@corp.netease.com

## 注意事项

**web端导出文件统一命名为inde.web.js，移动端统一命名为index.js，用来兼容三端程序**
**由于移动端和web端均引用了chart-engine工程，在拉取和推送本工程相关代码的时候，一定要注意，不要将修改回滚了**

## 项目架构
```
dist: 打包版本
docs: 文档网站
lib: commonJS格式构建版本
src: 源文件
	core: 核心设定模块
	chart: 图表模块
	helper: 辅助功能模块
	platform: 平台判断映射相关逻辑
	scale: 数据比例尺
index.js: 入口文件
```