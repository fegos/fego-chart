/**
 * 行情渲染引擎打包配置文件，可输出不同格式的打包文件
 * 
 * 
 */

const path = require('path')
const webpack = require('webpack')
const env = process.env.NODE_ENV;

let config = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename:'bundle.js',
		library: 'nsipChart',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			include: [
				path.resolve(__dirname, 'src'),
			],
			loader: 'babel-loader',
			query: {
			},
		},{
			test: /\.less$/,
			exclude: /node_modules/,
			use: [
				'style-loader',
				'css-loader',
				'less-loader'
			]
		}],
	},
	resolve: {
		extensions: [".web.js", ".js", ".json"]
	},
	externals: {},
	plugins: []
}

if (env === 'production') {
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				warnings: false,
			},
			output: {
				comments: false,
			},
			sourceMap: false,
		})
	);
}

module.exports = config