const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const isDev = TARGET === 'start';
const isProd = TARGET === 'build';

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

const jsLoaders = [
	{
		loader: 'babel-loader',
	}
];

// TODO: Make sure to add all vendor libs here
const vendorLibs = ['react', 'react-dom'];


const common = {
	context: __dirname + '/src',
	entry: {
		app: './app/index.js',
		vendor: vendorLibs,
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
				use: jsLoaders,
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

if (isDev) {
	module.exports = merge(common, {
		devtool: 'cheap-module-eval-source-map',
		performance : {
			hints : false,
		},
		devServer: {
			contentBase: __dirname + '/src',
		},
	});
}

if (isProd) {
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
