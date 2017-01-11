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
		frameworks: ['chai', 'mocha'],
		plugins: [
			'karma-webpack',
			'karma-phantomjs-launcher',
			'karma-chai',
			'karma-mocha',
			'karma-sourcemap-loader',
			'karma-mocha-reporter',
			'karma-coverage',
			'istanbul-instrumenter-loader',
		],
		preprocessors: {
			'test/tests.bundle.js': ['webpack', 'sourcemap']
		},
		reporters: ['mocha', 'coverage'],
		singleRun: !isTdd,
		coverageReporter: {
			reporters: [
				{ type: 'text' },
				{ type: 'html' }
			],
			dir: 'test/coverage/'
		},
		webpack: {
			// entry: 'test/tests.bundle.js',
			devtool: 'inline-source-map',
			module: {
				loaders: [
					{ test: /\.jsx?$/, loader: 'babel-loader' }
				]
			}
		},
		webpackMiddleware: {
			noInfo: true,
		}
	});
};
