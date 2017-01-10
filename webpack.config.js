const { resolve } = require('path');
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
			filename: 'bundle.js',
			path: resolve(__dirname, 'demo'),
			publicPath: '/',
		},
		// devtool: 'cheap-module-eval-source-map',
		devtool: 'inline-source-map',
		performance : {
			hints : false,
		},
		devServer: {
			hot: true,
			contentBase: resolve(__dirname, 'demo'),
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
			path: resolve(__dirname, 'dist'),
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

// const { resolve } = require('path');
// const webpack = require('webpack');
//
// module.exports = {
// 	entry: [
// 		'react-hot-loader/patch',
// 		// activate HMR for React
//
// 		'webpack-dev-server/client?http://localhost:8080',
// 		// bundle the client for webpack-dev-server
// 		// and connect to the provided endpoint
//
// 		'webpack/hot/only-dev-server',
// 		// bundle the client for hot reloading
// 		// only- means to only hot reload for successful updates
//
//
// 		'./app/index.js'
// 		// the entry point of our app
// 	],
// 	output: {
// 		filename: 'bundle.js',
// 		// the output bundle
//
// 		path: resolve(__dirname, 'dist'),
//
// 		publicPath: '/'
// 		// necessary for HMR to know where to load the hot update chunks
// 	},
//
// 	context: resolve(__dirname, 'src'),
//
// 	devtool: 'inline-source-map',
//
// 	devServer: {
// 		hot: true,
// 		// enable HMR on the server
//
// 		contentBase: resolve(__dirname, 'dist'),
// 		// match the output path
//
// 		publicPath: '/'
// 		// match the output `publicPath`
// 	},
//
// 	module: {
// 		rules: [
// 			{
// 				test: /\.js$/,
// 				use: [
// 					'babel-loader',
// 				],
// 				exclude: /node_modules/
// 			},
// 			{
// 				test: /\.css$/,
// 				use: [
// 					'style-loader',
// 					'css-loader?modules',
// 					'postcss-loader',
// 				],
// 			},
// 		],
// 	},
//
// 	plugins: [
// 		new webpack.HotModuleReplacementPlugin(),
// 		// enable HMR globally
//
// 		new webpack.NamedModulesPlugin(),
// 		// prints more readable module names in the browser console on HMR updates
// 	],
// };