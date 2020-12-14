import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { combineLatest } from 'rxjs';
import { first, switchMap, takeUntil, tap } from 'rxjs/operators';
import FavouriteService from '../favourite/favourite.service';
import FilterItem from '../filter/filter-item';
import FilterService from '../filter/filter.service';
import LocationService from '../location/location.service';
import PageComponent from '../page/page.component';
import UserService from '../user/user.service';
import EventService from './event.service';

export default class EventPageComponent extends PageComponent {

	onInit() {
		this.grid = {
			mode: 1,
			width: 350,
			gutter: 2,
		};
		this.user = null;
		this.event = null;
		this.listing = null;
		this.filters = null;
		this.secondaryFiltersVisible = false;
		this.secondaryFilters = null;
		this.activeFilters = null;
		this.filteredItems = [];
		this.load$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(data => {
			this.event = data[0];
			this.listing = data[1];
			this.setFilters(data[2]);
			this.startFilter(this.listing);
			this.pushChanges();
		});
		this.error = null;
		this.inputActive = false;
		const form = this.form = new FormGroup({
			question: new FormControl(null, [Validators.RequiredValidator()]),
			checkRequest: window.antiforgery,
			checkField: ''
		});
		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(changes => {
			this.inputActive = (changes.question && changes.question.length > 0);
			this.pushChanges();
		});
	}

	load$() {
		const eventId = LocationService.get('eventId') || this.eventId;
		return UserService.sharedChanged$.pipe(
			tap(user => this.user = user),
			switchMap(() => combineLatest(
				EventService.detail$(eventId),
				EventService.listing$(eventId),
				EventService.filter$(eventId),
			))
		);
	}

	setFilters(filters) {
		const filterObject = {
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
		filters.forEach(filter => {
			filter.mode = 'or';
			filterObject[filter.key] = filter;
		});
		const filterService = this.filterService = new FilterService(filterObject, {}, (key, filter) => {
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
		this.secondaryFilters = Object.keys(this.filters).filter(key => key !== 'type').map(key => {
			return this.filters[key];
		});
	}

	startFilter(items) {
		this.filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(filteredItems => {
			this.filteredItems = [];
			this.activeFilters = [];
			this.pushChanges();
			setTimeout(() => {
				this.filteredItems = filteredItems;
				this.activeFilters = this.secondaryFilters.map(f => {
					f = new FilterItem(f);
					f.options = f.options.filter(o => f.has(o));
					return f;
				}).filter(f => f.options.length);
				this.pushChanges();
			}, 1);
			// console.log('EventPageComponent.filteredItems', filteredItems.length);
		});
	}

	onChange($event) {
		this.pushChanges();
	}

	toggleGrid() {
		this.grid.width = this.grid.width === 350 ? 525 : 350;
		this.pushChanges();
	}

	toggleFilters() {
		this.secondaryFiltersVisible = !this.secondaryFiltersVisible;
		this.pushChanges();
	}

	toggleSubscribe() {
		let flag = this.event.info.subscribed;
		UserService.authorized$().pipe(
			switchMap(user => FavouriteService[flag ? 'subscriptionRemove$' : 'subscriptionAdd$'](this.event.id)),
			first(),
		).subscribe(() => {
			flag = !flag;
			this.event.info.subscribed = flag;
			if (flag) {
				this.event.info.subscribers++;
			} else {
				this.event.info.subscribers--;
			}
			this.pushChanges();
		}, (error) => {
			console.log('EventPageComponent.toggleSubscribe.error', error);
		});
	}

	toggleLike() {
		let flag = this.event.info.liked;
		UserService.authorized$().pipe(
			switchMap(user => FavouriteService[flag ? 'likeRemove$' : 'likeAdd$'](this.event.id, 'event')),
			first(),
		).subscribe(() => {
			flag = !flag;
			this.event.info.liked = flag;
			if (flag) {
				this.event.info.likes++;
			} else {
				this.event.info.likes--;
			}
			this.pushChanges();
		}, (error) => {
			console.log('EventPageComponent.toggleLike.error', error);
		});
	}

	toggleSave() {
		let flag = this.event.info.saved;
		UserService.authorized$().pipe(
			switchMap(user => FavouriteService[flag ? 'favouriteRemove$' : 'favouriteAdd$'](this.event.id)),
			first(),
		).subscribe(() => {
			flag = !flag;
			this.event.info.saved = flag;
			this.pushChanges();
		}, (error) => {
			console.log('EventPageComponent.toggleSave.error', error);
		});
	}

	toggleShare(toggle) {
		this.event.info.sharing = toggle !== undefined ? toggle : !this.event.info.sharing;
		this.pushChanges();
	}

	onInputFocus(event) {
		this.inputFocus = true;
		this.pushChanges();
	}

	onInputBlur(event) {
		this.inputFocus = false;
		this.pushChanges();
	}

	postQuestion(event) {
		if (this.form.valid) {
			// console.log('EventPageComponent.postQuestion.onSubmit', this.form.value);
			this.form.submitted = true;
			EventService.postQuestion$(this.event, this.form.value.question).pipe(
				first(),
			).subscribe(question => {
				this.event.questions.unshift(question);
				this.form.controls.question.value = null;
				// this.pushChanges();
			}, error => {
				console.log('EventPageComponent.postQuestion.error', error);
				this.error = error;
				this.pushChanges();
			});
		} else {
			this.form.touched = true;
		}
	}
}

EventPageComponent.meta = {
	selector: '[event-page]',
	inputs: ['eventId']
};
