const TARGET = process.env.npm_lifecycle_event;
const isTdd = TARGET === 'test:tdd';

module.exports = function (config) {
	config.set({
		browsers: ['PhantomJS'],
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
			'karma-chai',
			'karma-mocha',
			'karma-sourcemap-loader',
			'karma-webpack',
			'karma-mocha-reporter'
		],
		preprocessors: {
			'test/tests.bundle.js': ['webpack', 'sourcemap']
		},
		reporters: ['mocha'],
		singleRun: !isTdd,
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
