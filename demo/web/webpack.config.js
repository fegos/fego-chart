const webpack = require('webpack')
const path = require('path')

module.exports = {
	context: path.join(__dirname, './src'),

	entry: {
		vendor: [
			'react',
			'react-dom',
			'react-redux',
			'react-router',
			'react-router-redux',
			'redux',
		],
		bundle: './index.js'
	},

	output: {
		path: path.join(__dirname, './static'),
		filename: '[name].js',
	},

	module: {
		loaders: [
			{
				test: /\.html$/,
				loader: 'file-loader?name=[name].[ext]'
			},
			{
				test: /\.css$/,
				include: /src/,
				use: [
					'style-loader',
					'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
					'postcss-loader'
				]
			},
			{
				test: /\.css$/,
				exclude: /src/,
				use: [
					'style-loader!',
					'css-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					'react-hot-loader',
					'babel-loader'
				]
			},
		],
	},

	resolve: {
		extensions: ['.web.js', '.js', '.jsx', '.json'],
		mainFields: ["module", "main"]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name:'vendor', 
			filename: 'vendor.js'
		}),

		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
		})
	],

	devServer: {
		contentBase: './src',
		port: 5000,
		hot: true,
		inline: true,
		proxy: {
			'/api/*': {
				target: `http://127.0.0.1:5001`,
				secure: false
			}
		}
	},

	node: {
		fs: "empty",
		net: "empty"
	},

	devtool: 'cheap-eval-source-map'
}
