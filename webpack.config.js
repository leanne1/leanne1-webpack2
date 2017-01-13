const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const TARGET = process.env.npm_lifecycle_event;
const isDev = TARGET === 'start';
const isProd = TARGET === 'build';

/**
 * Define loaders
 */
const commonLessLoaders = [
	{
		loader: 'css-loader?sourceMap',
		options: { modules: true, importLoaders: 1 }
	},
	{
		loader: 'postcss-loader'
	},
	{
		loader: 'less-loader?sourceMap',
	}
];

const commonJsLoaders = [
	{
		loader: 'babel-loader',
	},
];

const commonImgLoaders = [
	{
		loader: 'url-loader?limit=8192&name=img/img-[hash:6].[ext]', // Move images to /img
	},
];

const devJsLoaders = [
	{
		loader: 'eslint-loader',
	}
];

/**
 * Define JS vendor bundle
 */
// TODO: Make sure to add all vendor libs / polyfills here
const vendorLibs = [
	'babel-es6-polyfill',
	'react',
	'react-dom',
	'whatwg-fetch'
];

/**
 * Config common to all envs
 */
const common = {
	context: path.resolve(__dirname, 'src'),
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: commonJsLoaders,
			},
			{
				test: /\.less$/,
				exclude: /(node_modules|bower_components)/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: commonLessLoaders,
				}),
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				exclude: /(node_modules|bower_components)/,
				loader: commonImgLoaders,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './assets/index.html',
		}),
	]
};

/**
 * Dev env
 */
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
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules|bower_components)/,
					use: devJsLoaders,
				},
			],
		},
		devtool: 'cheap-module-source-map',
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

/**
 * Prod env
 */
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
			new ImageminPlugin({
				test: path.resolve(__dirname, 'src/assets/img/'),
				jpegtran: { progressive: true }
			}),
		],
	});
}
