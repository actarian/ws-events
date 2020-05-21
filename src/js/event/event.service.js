import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import HttpService from '../http/http.service';

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
		const diff = this.startDate - now;
		const hoursDiff = Math.floor(diff / 1000 / 60 / 60);
		return !this.info.started && this.startDate > now && hoursDiff >= 24;
	}

	get past() {
		return this.info.ended;
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
		}
	}
}

export default class EventService {

	static detail$(eventId) {
		return HttpService.get$(`/api/event/${eventId}/detail`).pipe(
			map(x => EventService.fake(new Event(x)))
			// map(x => new Event(x))
		);
	}

	static top$() {
		return HttpService.get$(`/api/event/evidence`).pipe(
			map(items => items.map(x => EventService.fake(new Event(x))))
			// map(items => items.map(x => new Event(x)))
		);
	}

	static upcoming$() {
		return HttpService.get$(`/api/event/upcoming`).pipe(
			// map(items => items.map(x => EventService.fake(new Event(x))))
			map(items => items.map(x => new Event(x)))
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

	static mapEvents(events) {
		return events ? events.map(x => this.fake(new Event(x))) : [];
	}

	static fake(item) {
		// console.log('EventService.fake', item);
		const now = new Date();
		const index = item.id % 1000;
		item.url = `${item.url}?eventId=${item.id}`;
		item.channel.url = `${item.channel.url}?channelId=${item.channel.id}`;
		item.info.subscribers = 50 + Math.floor(Math.random() * 200);
		item.info.likes = 50 + Math.floor(Math.random() * 200);
		switch (index) {
			case 1:
				item.startDate = new Date(new Date().setMinutes(now.getMinutes() - 10));
				item.endDate = null;
				item.info.started = true;
				item.info.ended = false;
				break;
			case 2:
				item.startDate = new Date(new Date().setHours(now.getHours() + 2));
				item.endDate = null;
				item.info.started = false;
				item.info.ended = false;
				break;
			case 3:
				item.startDate = new Date(new Date().setHours(now.getHours() - 7));
				item.endDate = new Date(new Date().setHours(now.getHours() - 6));
				item.info.started = true;
				item.info.ended = true;
				break;
			case 4:
				item.startDate = new Date(new Date().setDate(now.getDate() + 7));
				item.endDate = null;
				item.info.started = false;
				item.info.ended = false;
				break;
			case 5:
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
		return item;
	}

}
