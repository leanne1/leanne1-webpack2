import styles from '../styles/index.less';
import React from 'react';
import { render } from  'react-dom';
import test from './utils/test';
import Test from './components/Test';

test();
render(<Test />, document.querySelector('#app'));
