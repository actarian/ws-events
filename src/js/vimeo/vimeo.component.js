
/*
<div style="padding:56.25% 0 0 0;position:relative;">
	<iframe src="https://player.vimeo.com/video/63252461?autoplay=1&color=ff9933&title=0&byline=0&portrait=0&background=0&loop=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>
<script src="https://player.vimeo.com/api/player.js"></script>

// http://vimeo.com/api/v2/video/497693771.json

// https://i.vimeocdn.com/video/1029929333_1920x1080.webp
*/

import { Component, getContext } from 'rxcomp';

export default class VimeoComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.setAttribute('id', `vimeo-${this.rxcompId}`);

		let media = this.vimeo;

		const controls = node.hasAttribute('controls') ? 1 : 0,
			background = controls ? 0 : 1,
			loop = node.hasAttribute('loop') ? 1 : 0,
			autoplay = node.hasAttribute('autoplay') ? 1 : 0,
			live = node.hasAttribute('live') ? 1 : 0,
			color = node.hasAttribute('color') ? node.getAttribute('color') : 'f67c53';

		const src = `https://player.vimeo.com/video/${media}?autoplay=${autoplay}&color=${color}&title=0&byline=0&portrait=0&controls=${controls}&background=${background}&loop=${loop}`;

		const html = /* html */`
			<iframe
				src="${src}"
				style="position:absolute;top:0;left:0;width:100%;height:100%;"
				frameborder="0"
				allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
		`;

		node.innerHTML = html;
	}

}

VimeoComponent.meta = {
	selector: '[vimeo]',
	outputs: ['ready', 'canPlay', 'complete'],
	inputs: ['vimeo'],
};
