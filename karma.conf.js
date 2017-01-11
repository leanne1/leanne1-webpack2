var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'inline-source-map';

const TARGET = process.env.npm_lifecycle_event;
const isTdd = TARGET === 'test:tdd';
console.log('################### TARGET', TARGET);
console.log('################### isTdd', isTdd);

module.exports = function (config) {
	config.set({
		browsers: [ 'PhantomJS' ],
		files: [
			'node_modules/phantomjs-function-bind-polyfill/index.js',
			'node_modules/phantomjs-polyfill/bind-polyfill.js',
			'node_modules/phantomjs-polyfill-includes/includes-polyfill.js',
			'node_modules/babel-es6-polyfill/browser-polyfill.js',
			'node_modules/whatwg-fetch/fetch.js',
			'test/tests.bundle.js'
		],
		frameworks: [ 'chai', 'mocha' ],
		plugins: [
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-chai',
			'karma-mocha',
			'karma-sourcemap-loader',
			'karma-webpack',
		],
		// run the bundle through the webpack and sourcemap plugins
		preprocessors: {
			'test/tests.bundle.js': [ 'webpack', 'sourcemap' ]
		},
		reporters: [ 'dots' ],
		singleRun: !isTdd,
		// webpack config object
		// webpack: webpackConfig,



		webpack: {
			devtool: 'inline-source-map',
			module: {
				loaders: [
					{ test: /\.jsx?$/, loader: 'babel-loader' }
				],
				// postLoaders: [ {
				// 	test: /\.js$/,
				// 	exclude: /(test|node_modules|bower_components)\//,
				// 	loader: 'istanbul-instrumenter'
				// } ]
			}
		},

		webpackMiddleware: {
			noInfo: true,
		}
	});
};
