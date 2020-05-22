import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import FilterService from '../filter/filter.service';
import LocationService from '../location/location.service';
import PageComponent from '../page/page.component';
import { User } from '../user/user.service';
import EventService from './event.service';

export default class EventPageComponent extends PageComponent {

	onInit() {
		this.user = new User({
			firstName: 'Sergio',
			lastName: 'Arcuri'
		});
		console.log(this.user);
		this.event = this.listing = null;
		this.grid = {
			mode: 1,
			width: 350,
			gutter: 2,
		};
		this.filteredItems = [];
		const filters = {
			type: {
				label: 'Type',
				mode: 'select',
				options: [{
					label: 'Event',
					value: 'event',
				}, {
					label: 'Picture',
					value: 'picture',
				}, {
					label: 'Product',
					value: 'product',
				}, {
					label: 'Magazine',
					value: 'magazine',
				}]
			},
		};
		const filterService = this.filterService = new FilterService(filters, {}, (key, filter) => {
			switch (key) {
				case 'type':
					filter.filter = (item, value) => {
						return item.type === value;
					};
					break;
				case 'tag':
					filter.filter = (item, value) => {
						return item.tags.indexOf(value) !== -1;
					};
					break;
				default:
					filter.filter = (item, value) => {
						return item.features.indexOf(value) !== -1;
					};
			}
		});
		this.filters = filterService.filters;
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.event = data[0];
			this.listing = data[1];
			this.startFilter(this.listing);
			this.pushChanges();
		});
	}

	load$() {
		const eventId = LocationService.get('eventId');
		return combineLatest(
			EventService.detail$(eventId),
			EventService.listing$(eventId),
		);
	}

	startFilter(items) {
		this.filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(filteredItems => {
			this.filteredItems = [];
			this.pushChanges();
			setTimeout(() => {
				this.filteredItems = filteredItems;
				this.pushChanges();
			}, 1);
			console.log('EventPageComponent.filteredItems', filteredItems.length);
		});
	}

	onChange($event) {
		this.pushChanges();
	}

	toggleGrid() {
		this.grid.width = this.grid.width === 350 ? 700 : 350;
		this.pushChanges();
	}

	toggleSubscribe() {
		let flag = this.event.info.subscribed;
		EventService[flag ? 'unsubscribe$' : 'subscribe$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.subscribed = flag;
			if (flag) {
				this.event.info.subscribers++;
			} else {
				this.event.info.subscribers--;
			}
			this.pushChanges();
		});
	}

	toggleLike() {
		let flag = this.event.info.liked;
		EventService[flag ? 'unlike$' : 'like$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.liked = flag;
			if (flag) {
				this.event.info.likes++;
			} else {
				this.event.info.likes--;
			}
			this.pushChanges();
		});
	}

	toggleSave() {
		let flag = this.event.info.saved;
		EventService[flag ? 'unsave$' : 'save$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.saves = flag;
			this.pushChanges();
		});
	}

}

EventPageComponent.meta = {
	selector: '[event-page]',
};
