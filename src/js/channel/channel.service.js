import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import EventService, { Event } from '../event/event.service';
import HttpService from '../http/http.service';

export class Channel {
	constructor(data) {
		if (data) {
			Object.assign(this, data);
			this.events = EventService.mapEvents(this.events);
		}
	}
}

export default class ChannelService {

	static channels$() {
		return HttpService.get$(`/api/channel/channels`).pipe(
			map(items => ChannelService.mapChannels(items))
		);
	}

	static detail$(channelId) {
		return HttpService.get$(`/api/channel/${channelId}/detail`).pipe(
			map(x => ChannelService.mapChannel(x))
		);
	}

	static listing$(channelId) {
		// return HttpService.get$(`/api/channel/${channelId}/listing`);
		return ChannelService.fakeListing(channelId).pipe(
			tap((items) => {
				// console.log(JSON.stringify(items));
			})
		);
	}

	static top$() {
		return HttpService.get$(`/api/channel/evidence`).pipe(
			map(items => ChannelService.mapChannels(items))
		);
	}

	static subscribe$(channelId) {
		return of(null);
	}

	static unsubscribe$(channelId) {
		return of(null);
	}

	static like$(channelId) {
		return of(null);
	}

	static unlike$(channelId) {
		return of(null);
	}

	static mapChannel(channel) {
		return ChannelService.fake(new Channel(channel));
	}

	static mapChannels(channels) {
		return channels ? channels.map(x => ChannelService.mapChannel(x)) : [];
	}

	static fake(item) {
		// console.log('ChannelService.fake', item);
		item.url = `${item.url}?channelId=${item.id}`;
		item.info.subscribers = 1500 + Math.floor(Math.random() * 200);
		item.info.likes = 500 + Math.floor(Math.random() * 200);
		return item;
	}

	static fakeListing(channelId) {
		return HttpService.get$(`/api/channel/${channelId}/detail`).pipe(
			map(x => {
				const channel_ = ChannelService.fake(new Channel(x));
				const info_ = {
					started: false,
					ended: false,
					subscribers: 100,
					subscribed: false,
					likes: 100,
					liked: false
				};
				const image_ = {
					id: 100000,
					width: 700,
					height: 700,
					src: 'https://source.unsplash.com/random/',
				};
				const category_ = {
					id: 10000,
					name: 'Category',
					url: '/ws-events/category.html',
				};
				const event_ = {
					id: 1000,
					type: 'event',
					name: 'Evento',
					title: 'Evento',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/ws-events/event.html',
					creationDate: '2020-05-20T08:11:17.827Z',
					startDate: '2020-05-20T08:11:17.827Z',
					picture: image_,
					info: info_,
					channel: channel_,
				};
				const picture_ = {
					id: 1000,
					type: 'picture',
					name: 'Picture',
					title: 'Picture',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/ws-events/document.html',
					picture: image_,
					category: category_,
				};
				const product_ = {
					id: 1000,
					type: 'product',
					name: 'Product',
					title: 'Product',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/ws-events/product.html',
					picture: image_,
					category: category_,
				};
				const magazine_ = {
					id: 1000,
					type: 'magazine',
					name: 'Magazine',
					title: 'Magazine',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/ws-events/product.html',
					picture: image_,
					category: category_,
				};
				const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L'];
				return new Array(250).fill(true).map((x, i) => {
					let type = 'event';
					if (i > 3) {
						if (i % 5 === 0) {
							type = 'picture';
						}
						if (i % 7 === 0) {
							type = 'product';
						}
						if (i % 11 === 0) {
							type = 'magazine';
						}
					}
					let item;
					switch (type) {
						case 'picture':
							item = Object.assign({}, picture_);
							break;
						case 'product':
							item = Object.assign({}, product_);
							break;
						case 'magazine':
							item = Object.assign({}, magazine_);
							break;
						case 'event':
							item = Object.assign({}, event_);
							break;
					}
					item.id = (channelId - 100) * 1000 + 1 + i;
					item.name = item.title = `${item.name} ${letters[(item.id - 1) % 10]}`;
					item.type = type;
					if (item.picture) {
						item.picture = Object.assign({}, image_, {
							id: (100001 + i),
							width: 700,
							height: [700, 900, 1100][i % 3],
						});
					}
					if (item.info) {
						item.info = Object.assign({}, info_);
					}
					if (item.channel) {
						item.channel = Object.assign({}, x);
					}
					if (item.category) {
						const categoryId = (10001 + (i % 10));
						item.category = Object.assign({}, category_, {
							id: categoryId,
							name: 'Category ' + letters[categoryId % 10],
							url: `${category_.url}?categoryId=${categoryId}`,
						});
					}
					switch (type) {
						case 'event':
							item = EventService.fake(new Event(item));
							break;
					}
					return item;
				});
			})
			// map(x => new Channel(x))
		);
	}

	static fakeListing_(channelId) {
		return HttpService.get$(`/api/channel/${channelId}/detail`).pipe(
			map(x => {
				const channel_ = ChannelService.fake(new Channel(x));
				const event_ = {
					id: 1000,
					type: 'event',
					name: 'Evento XYZ',
					title: 'Evento XYZ',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					picture: {
						src: 'https://source.unsplash.com/random/',
						width: 700,
						height: 700,
					},
					url: '/ws-events/event.html',
					creationDate: '2020-05-20T08:11:17.827Z',
					startDate: '2020-05-20T08:11:17.827Z',
					info: {
						started: false,
						ended: false,
						subscribers: 100,
						subscribed: false,
						likes: 100,
						liked: false
					},
					channel: channel_
				};
				return new Array(250).fill(true).map((x, i) => {
					const item = Object.assign({}, event_);
					item.id = (channelId - 100) * 1000 + 1 + i;
					item.picture = Object.assign({}, event_.picture);
					item.picture.width = 700;
					item.picture.height = [700, 900, 1100][i % 3];
					item.info = Object.assign({}, event_.info);
					item.channel = Object.assign({}, x);
					return EventService.fake(new Event(item));
				});
			})
			// map(x => new Channel(x))
		);
	}

}
