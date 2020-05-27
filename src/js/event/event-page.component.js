import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import FavouriteService from '../favourite/favourite.service';
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
		this.event = this.listing = this.error = null;
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
		this.grid.width = this.grid.width === 350 ? 525 : 350;
		this.pushChanges();
	}

	toggleSubscribe() {
		let flag = this.event.info.subscribed;
		FavouriteService[flag ? 'subscriptionRemove$' : 'subscriptionAdd$'](this.event.id).pipe(
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
		FavouriteService[flag ? 'likeRemove$' : 'likeAdd$'](this.event.id).pipe(
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
		FavouriteService[flag ? 'favouriteRemove$' : 'favouriteAdd$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.saved = flag;
			this.pushChanges();
		});
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
};
