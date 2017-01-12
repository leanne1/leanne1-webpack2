const component = () => {
	const element = document.createElement('p');
	element.innerHTML = ['Hello', 'webpack'].map((item) => `${item}' qux '`);
	return element;
};

export default () => {
	document.body.appendChild(component());
};
