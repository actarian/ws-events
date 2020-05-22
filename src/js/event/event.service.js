import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import HttpService from '../http/http.service';
import QuestionService from '../question/question.service';

export class Event {

	get live() {
		return this.info.started && !this.info.ended;
	}

	get incoming() {
		const now = new Date();
		const diff = this.startDate - now;
		const hoursDiff = Math.floor(diff / 1000 / 60 / 60);
		return !this.info.started && this.startDate > now && hoursDiff < 24;
	}

	get future() {
		const now = new Date();
		return !this.info.started && this.startDate > now;
	}

	get past() {
		return this.info.ended;
	}

	get hasRelated() {
		return this.related && this.related.length;
	}

	constructor(data) {
		if (data) {
			Object.assign(this, data);
			if (this.creationDate) {
				this.creationDate = new Date(this.creationDate);
			}
			if (this.startDate) {
				this.startDate = new Date(this.startDate);
			}
			if (this.endDate) {
				this.endDate = new Date(this.endDate);
			}
			if (this.related) {
				this.related = EventService.mapEvents(this.related);
			}
			if (this.questions) {
				this.questions = QuestionService.mapQuestions(this.questions);
			}
		}
	}
}

export default class EventService {

	static detail$(eventId) {
		const id = 1001; // !!!
		return HttpService.get$(`/api/event/${id}/detail`).pipe(
			tap(x => x.id = parseInt(eventId)), // !!!
			map(x => EventService.mapEvent(x))
		);
	}

	static listing$(eventId) {
		// return HttpService.get$(`/api/event/${eventId}/listing`);
		return EventService.fakeListing(eventId).pipe(
			tap((items) => {
				// console.log(JSON.stringify(items));
			})
		);
	}

	static top$() {
		return HttpService.get$(`/api/event/evidence`).pipe(
			map(items => EventService.mapEvents(items))
		);
	}

	static upcoming$() {
		return HttpService.get$(`/api/event/upcoming`).pipe(
			map(items => EventService.mapEvents(items))
		);
	}

	static subscribe$(eventId) {
		return of(null);
	}

	static unsubscribe$(eventId) {
		return of(null);
	}

	static like$(eventId) {
		return of(null);
	}

	static unlike$(eventId) {
		return of(null);
	}

	static save$(eventId) {
		return of(null);
	}

	static unsave$(eventId) {
		return of(null);
	}

	static mapEvent(event) {
		return EventService.fake(new Event(event));
	}

	static mapEvents(events) {
		return events ? events.map(x => EventService.mapEvent(x)) : [];
	}

	static fake(item) {
		// console.log('EventService.fake', item);
		const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L'];
		const index = item.id % 1000;
		item.url = `${item.url}?eventId=${item.id}`;
		if (item.channel) {
			item.channel.url = `${item.channel.url}?channelId=${item.channel.id}`;
			const channelIndex = item.channel.id % 100;
			item.name = `Event ${letters[channelIndex - 1]}${index}`;
		}
		if (item.info) {
			item.info.subscribers = 50 + Math.floor(Math.random() * 200);
			item.info.likes = 50 + Math.floor(Math.random() * 200);
			item.thron = {
				src: 'https://gruppoconcorde-view.thron.com/api/xcontents/resources/delivery/getContentDetail?clientId=gruppoconcorde&xcontentId=16ef3c0a-ba0c-4e3a-a10a-32bc7f9a4297&pkey=yz1hpd'
			};
			const now = new Date();
			switch (index) {
				case 1:
					item.startDate = new Date(new Date().setMinutes(now.getMinutes() - 10));
					item.endDate = null;
					item.info.started = true;
					item.info.ended = false;
					break;
				case 2:
					item.startDate = new Date(new Date().setMinutes(now.getMinutes() + 2));
					item.endDate = null;
					item.info.started = false;
					item.info.ended = false;
					break;
				case 3:
					item.startDate = new Date(new Date().setHours(now.getHours() + 2));
					item.endDate = null;
					item.info.started = false;
					item.info.ended = false;
					break;
				case 4:
					item.startDate = new Date(new Date().setHours(now.getHours() - 7));
					item.endDate = new Date(new Date().setHours(now.getHours() - 6));
					item.info.started = true;
					item.info.ended = true;
					break;
				case 5:
					item.startDate = new Date(new Date().setDate(now.getDate() + 7));
					item.endDate = null;
					item.info.started = false;
					item.info.ended = false;
					break;
				case 6:
					item.startDate = new Date(new Date().setDate(now.getDate() + 14));
					item.endDate = null;
					item.info.started = false;
					item.info.ended = false;
					break;
				default:
					item.startDate = new Date(new Date().setDate(now.getDate() - 14 - Math.floor(Math.random() * 150)));
					item.endDate = new Date(new Date(item.startDate.getTime()).setHours(item.startDate.getHours() + 1));
					item.info.started = true;
					item.info.ended = true;
			}
		}
		if (item.related) {
			item.related = item.related.filter(x => (x.id !== item.id) && (x.live || x.incoming || x.past));
		}
		return item;
	}

	static fakeListing(eventId) {
		eventId = 1001;
		return HttpService.get$(`/api/event/${eventId}/detail`).pipe(
			map(x => {
				const channel_ = new Event(x).channel;
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
				return new Array(30).fill(true).map((x, i) => {
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
					item.id = (channel_.id - 100) * 1000 + 1 + i;
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
						item.channel = Object.assign({}, channel_);
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
		);
	}

}
