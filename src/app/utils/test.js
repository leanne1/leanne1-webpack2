function component () {
	const element = document.createElement('p');

	element.innerHTML = ['Hello','webpack'].map(function(item){
		return item + ' bar ';
	});

	return element;
}

export default function () {
	document.body.appendChild(component());
}