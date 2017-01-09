import styles from '../styles/index.less';
import react from 'react';

function component () {
	const element = document.createElement('p');

	element.innerHTML = ['Hello','webpack'].map(function(item){
		return item + ' ';
	});

	return element;
}

document.body.appendChild(component());