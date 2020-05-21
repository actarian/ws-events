import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import FilterService from '../filter/filter.service';
import LocationService from '../location/location.service';
import PageComponent from '../page/page.component';
import ChannelService from './channel.service';

export default class ChannelPageComponent extends PageComponent {

	onInit() {
		this.channels = this.channel = this.listing = null;
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
			this.channels = data[0];
			this.channel = data[1];
			this.listing = data[2];
			this.startFilter(this.listing);
			this.pushChanges();
		});
	}

	load$() {
		const channelId = LocationService.get('channelId');
		return combineLatest(
			ChannelService.channels$(),
			ChannelService.detail$(channelId),
			ChannelService.listing$(channelId),
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
			console.log('ChannelPageComponent.filteredItems', filteredItems.length);
		});
	}

	toggleGrid() {
		this.grid.width = this.grid.width === 350 ? 700 : 350;
		this.pushChanges();
	}

}

ChannelPageComponent.meta = {
	selector: '[channel-page]',
};
