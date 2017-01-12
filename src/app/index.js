import React from 'react';
import ReactDOM from 'react-dom';
/* eslint-disable import/no-extraneous-dependencies */
import { AppContainer } from 'react-hot-loader';
/* eslint-enable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import styles from '../styles/index.less';
/* eslint-enable no-unused-vars */
import App from './components/App';
import test from './utils/test';

test();
const render = (Component) => {
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById('app'),
	);
};

render(App);

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept('./components/App', () => {
		/* eslint-disable global-require */
		const NewApp = require('./components/App').default;
		/* eslint-disable global-require */
		render(NewApp);
	});
}
