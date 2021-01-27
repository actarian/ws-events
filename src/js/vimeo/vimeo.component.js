
/*
<div style="padding:56.25% 0 0 0;position:relative;">
	<iframe src="https://player.vimeo.com/video/63252461?autoplay=1&color=ff9933&title=0&byline=0&portrait=0&background=0&loop=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>
<script src="https://player.vimeo.com/api/player.js"></script>

// http://vimeo.com/api/v2/video/497693771.json

// https://i.vimeocdn.com/video/1029929333_1920x1080.webp
*/

import Player from '@vimeo/player';
import { Component, getContext } from 'rxcomp';
import { fromEventPattern } from 'rxjs';
import { auditTime, filter, takeUntil, tap } from 'rxjs/operators';
import GtmService from '../gtm/gtm.service';
import UserService from '../user/user.service';

export default class VimeoComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		const uid = `vimeo-${this.rxcompId}`;
		node.setAttribute('id', uid);

		let media = this.vimeo.media.src;

		const controls = node.hasAttribute('controls') ? 1 : 0,
			background = controls ? 0 : 1,
			loop = node.hasAttribute('loop') ? 1 : 0,
			autoplay = node.hasAttribute('autoplay') ? 1 : 0,
			live = node.hasAttribute('live') ? 1 : 0,
			color = node.hasAttribute('color') ? node.getAttribute('color') : 'f67c53';

		const player = new Player(uid, {
			id: media,
			autoplay: autoplay,
			color: color,
			controls: controls,
			background: background,
			loop: loop,
			title: 0,
			byline: 0,
			portrait: 0,
		});

		player.ready().then(() => {
			const iframe = node.querySelector('iframe');
			iframe.setAttribute('frameborder', '0');
			iframe.setAttribute('allow', 'autoplay;fullscreen');
			iframe.setAttribute('webkitallowfullscreen', '');
			iframe.setAttribute('mozallowfullscreen', '');
			iframe.setAttribute('allowfullscreen', '');

			this.timeupdate$(player, media).pipe(
				takeUntil(this.unsubscribe$),
			).subscribe();
		}, (error) => {
			console.log('VimeoComponent.player.error', error);
		});

		/*
		player.on('play', function() {
			console.log('played the video!');
		});
		*/

		/*
		const src = `https://player.vimeo.com/video/${media}?autoplay=${autoplay}&color=${color}&title=0&byline=0&portrait=0&controls=${controls}&background=${background}&loop=${loop}`;

		const html = / html /`
			<iframe
				src="${src}"
				style="position:absolute;top:0;left:0;width:100%;height:100%;"
				frameborder="0"
				allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
		`;

		node.innerHTML = html;
		*/
	}

	timeupdate$(player, videoId) {
		function addTimeUpdateHandler(handler) {
			player.on('timeupdate', handler);
		}
		function removeTimeUpdateHandler(handler) {
			player.off('timeupdate', handler);
		}
		const steps = ['play', 'progress - 25%', 'progress - 50%', 'progress - 75%', 'progress - 90%', 'progress - 100%'];
		const values = [0, 0.25, 0.5, 0.75, 0.9, 1];
		const getStepIndex = (percent) => {
			return values.reduce((p, c, i) => {
				return percent >= c ? i : p;
			}, 0);
		}
		const stepValue = 1 / (steps.length - 1);
		let lastStepIndex = -1;
		return fromEventPattern(addTimeUpdateHandler, removeTimeUpdateHandler).pipe(
			auditTime(1000),
			filter((event) => {
				const stepIndex = getStepIndex(event.percent);
				if (stepIndex > lastStepIndex) {
					lastStepIndex = stepIndex;
					return true;
				} else {
					return false;
				}
			}),
			tap((event) => {
				const stepIndex = getStepIndex(event.percent);
				const user = UserService.getCurrentUser();
				/*
				var tracing =
				{
					'VideoType': 'Vimeo',
					'VideoId': videoId,
					'Duration': event.duration,
					'Seconds': event.seconds,
					'Percent': event.percent
				};
				ApiService.post$('/user/tracing', tracing);
				*/
				GtmService.push({
					'event': 'PlayingEvent',
					'videoType': 'Vimeo',
					'videoId': videoId,
					'duration': event.duration,
					// 'seconds': event.seconds,
					// 'percent': event.percent,
					'progress': steps[stepIndex],
					'eventId': this.vimeo.id,
					'eventTitle': this.vimeo.title,
					'userId': user ? user.id : 'not logged',
				});
			})
		);
	}

}

VimeoComponent.meta = {
	selector: '[vimeo]',
	outputs: ['ready', 'canPlay', 'complete'],
	inputs: ['vimeo'],
};
