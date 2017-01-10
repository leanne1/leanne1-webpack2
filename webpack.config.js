const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

const lessLoaders = [
	{
		loader: 'css-loader?sourceMap',
		options: { modules: true, importLoaders: 1 }
	},
	{
		loader: 'postcss-loader'
	},
	{
		loader: 'less-loader',
		options: { sourceMap: true }
	}
];

const common = {
	context: __dirname + '/src',
	entry: {
		app: './app/index.js',
		vendor: ['react', 'react-dom'], // TODO: Add all vendor libs here
	},
	output: {
		filename: '[chunkhash].[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
					}
				],
			},
			{
				test: /\.less$/,
				exclude: /(node_modules|bower_components)/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: lessLoaders,
				}),
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './assets/index.html',
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['vendor', 'manifest'],
		}),
		new ExtractTextPlugin({
			filename: '[chunkhash].bundle.css',
			allChunks: true
		}),
	],
};

if (TARGET === 'start') {
	module.exports = merge(common, {
		performance : {
			hints : false,
		},
		devServer: {
			contentBase: __dirname + '/src',
		},
	});
}

if (TARGET === 'build') {
	module.exports = merge(common, {
		devtool: 'source-map',
		plugins: [
			new CleanWebpackPlugin(['dist']),
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: true,
			}),
		],
	});
}
