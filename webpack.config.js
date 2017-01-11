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
	context: path.resolve(__dirname, 'src'),
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
	]
};

if (isDev) {
	module.exports = merge(common, {
		entry: [
			'react-hot-loader/patch',
			'webpack-dev-server/client?http://localhost:8080',
			'webpack/hot/only-dev-server',
			'./app/index.js'
		],
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'demo'),
			publicPath: '/',
		},
		devtool: 'cheap-module-eval-source-map',
		performance : {
			hints : false,
		},
		devServer: {
			hot: true,
			contentBase: path.resolve(__dirname, 'demo'),
			publicPath: '/',
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),
			new ExtractTextPlugin({
				filename: 'bundle.css',
				allChunks: true
			}),
		],
	});
}

if (isProd) {
	module.exports = merge(common, {
		entry: {
			app: './app/index.js',
			vendor: vendorLibs,
		},
		output: {
			filename: '[chunkhash].[name].js',
			path: path.resolve(__dirname, 'dist'),
		},
		devtool: 'source-map',
		plugins: [
			new CleanWebpackPlugin(['dist']),
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: true,
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: ['vendor', 'manifest'],
			}),
			new ExtractTextPlugin({
				filename: '[chunkhash].bundle.css',
				allChunks: true
			}),
		],
	});
}
