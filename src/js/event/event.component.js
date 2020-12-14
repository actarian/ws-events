import { Component } from 'rxcomp';
import { first, switchMap } from 'rxjs/operators';
import FavouriteService from '../favourite/favourite.service';
import UserService from '../user/user.service';

export default class EventComponent extends Component {

	onChange($event) {
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
			console.log('EventComponent.toggleSubscribe.error', error);
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
			console.log('EventComponent.toggleLike.error', error);
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
			console.log('EventComponent.toggleSave.error', error);
		});
	}

}

EventComponent.meta = {
	selector: '[event]',
	inputs: ['event']
};
