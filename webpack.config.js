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
		vendor: ['react'],
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
						options: { presets: ['stage-0', 'es2015', 'react'] },

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
	devtool: 'source-map',
	plugins: [
		// TODO: do we need this?
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"' + process.env.NODE_ENV + '"'
			},
		}),
		new HtmlWebpackPlugin({
			template: './assets/index.html',
		}),
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
};

if (TARGET === 'start') {
	module.exports = merge(common, {
		devServer: {
			contentBase: __dirname + '/src',
		},
	});
}

if (TARGET === 'build') {
	module.exports = merge(common, {
		plugins: [
			new CleanWebpackPlugin(['dist']),
		],
	});
}
