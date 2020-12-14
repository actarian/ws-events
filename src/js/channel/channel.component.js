import { Component } from 'rxcomp';
import { first, switchMap } from 'rxjs/operators';
import FavouriteService from "../favourite/favourite.service";
import UserService from '../user/user.service';

export default class ChannelComponent extends Component {

	toggleSubscribe() {
		let flag = this.channel.info.subscribed;
		UserService.authorized$().pipe(
			switchMap(user => FavouriteService[flag ? 'subscriptionRemove$' : 'subscriptionAdd$'](this.channel.idDoc)),
			first(),
		).subscribe(() => {
			flag = !flag;
			this.channel.info.subscribed = flag;
			if (flag) {
				this.channel.info.subscribers++;
			} else {
				this.channel.info.subscribers--;
			}
			this.pushChanges();
		}, (error) => {
			console.log('ChannelComponent.toggleSubscribe.error', error);
		});
	}

	toggleLike() {
		let flag = this.channel.info.liked;
		UserService.authorized$().pipe(
			switchMap(user => FavouriteService[flag ? 'likeRemove$' : 'likeAdd$'](this.channel.id, 'channel')),
			first(),
		).subscribe(() => {
			flag = !flag;
			this.channel.info.liked = flag;
			if (flag) {
				this.channel.info.likes++;
			} else {
				this.channel.info.likes--;
			}
			this.pushChanges();
		}, (error) => {
			console.log('ChannelComponent.toggleLike.error', error);
		});
	}

}

ChannelComponent.meta = {
	selector: '[channel]',
	inputs: ['channel']
};
