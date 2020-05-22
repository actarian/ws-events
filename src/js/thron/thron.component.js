import { Component, getContext } from 'rxcomp';

export default class ThronComponent extends Component {

	onInit() {
		const THRON = window.THRONContentExperience || window.THRONPlayer;
		if (!THRON) {
			return;
		}
		const { node, rxcompId } = getContext(this);

		node.setAttribute('id', `thron-${rxcompId}`);

		let media = this.thron;
		if (media.indexOf('pkey=') === -1) {
			const splitted = media.split('/');
			const clientId = splitted[6];
			const xcontentId = splitted[7];
			const pkey = splitted[8];
			media = `https://gruppoconcorde-view.thron.com/api/xcontents/resources/delivery/getContentDetail?clientId=${clientId}&xcontentId=${xcontentId}&pkey=${pkey}`;
			// console.log(media);
		}
		const controls = node.hasAttribute('controls') ? true : false,
			loop = node.hasAttribute('loop') ? true : false,
			autoplay = node.hasAttribute('autoplay') ? true : false;
		const player = this.player = THRON(node.id, {
			media: media,
			loop: loop,
			autoplay: autoplay,
			muted: !controls,
			displayLinked: 'close',
			noSkin: !controls,
			// lockBitrate: 'max',
		});
		this.onReady = this.onReady.bind(this);
		this.onCanPlay = this.onCanPlay.bind(this);
		this.onPlaying = this.onPlaying.bind(this);
		this.onComplete = this.onComplete.bind(this);
		player.on('ready', this.onReady);
		player.on('canPlay', this.onCanPlay);
		player.on('playing', this.onPlaying);
		player.on('complete', this.onComplete);
	}

	onReady() {
		const { node } = getContext(this);
		const controls = node.hasAttribute('controls') ? true : false;
		if (!controls) {
			const player = this.player;
			const mediaContainer = player.mediaContainer();
			const video = mediaContainer.querySelector('video');
			video.setAttribute('playsinline', 'true');
		}
		this.ready.next(this);
	}

	onCanPlay() {
		this.canPlay.next(this);
	}

	onPlaying() {
		const player = this.player;
		player.off('playing', this.onPlaying);
		const { node } = getContext(this);
		const controls = node.hasAttribute('controls') ? true : false;
		if (!controls) {
			const qualities = player.qualityLevels();
			if (qualities.length) {
				const highestQuality = qualities[qualities.length - 1].index;
				const lowestQuality = qualities[0].index;
				player.currentQuality(highestQuality);
			}
		}
	}

	onComplete() {
		this.complete.next(this);
	}

	onDestroy() {
		const player = this.player;
		player.off('ready', this.onReady);
		player.off('canPlay', this.onCanPlay);
		player.off('playing', this.onPlaying);
		player.off('complete', this.onComplete);
	}

	play() {
		const player = this.player;
		const status = player.status();
		if (status && !status.playing) {
			player.play();
		}
	}

	pause() {
		const player = this.player;
		const status = player.status();
		if (status && status.playing) {
			player.pause();
		}
	}
}

ThronComponent.meta = {
	selector: '[thron]',
	outputs: ['ready', 'canPlay', 'complete'],
	inputs: ['thron'],
};
