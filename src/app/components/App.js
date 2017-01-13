import React from 'react';

const kittenSrc = require('../../assets/img/kitten.jpg');
const whatsAppSrc = require('../../assets/img/icon/icon_whatsapp.svg');

export default () => (
	<div>
		<span className="icon-whatsapp-sm-multi" />
		Hello World, I&apos;m a React component with HMR
		<img src={kittenSrc} alt="A cute kitten" />
		<img src={whatsAppSrc} alt="WhatsApp" />
	</div>
);
