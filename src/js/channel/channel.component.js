import { Component } from 'rxcomp';
import { first } from 'rxjs/operators';
import ChannelService from './channel.service';

export default class ChannelComponent extends Component {

	toggleSubscribe() {
		const flag = this.channel.info.subscribed;
		ChannelService[flag ? 'unsubscribe$' : 'subscribe$'](this.channel.id).pipe(
			first()
		).subscribe(() => {
			this.channel.info.subscribed = !flag;
			this.pushChanges();
		});
	}

	toggleLike() {
		const flag = this.channel.info.liked;
		ChannelService[flag ? 'unlike$' : 'like$'](this.channel.id).pipe(
			first()
		).subscribe(() => {
			this.channel.info.liked = !flag;
			this.pushChanges();
		});
	}

}

ChannelComponent.meta = {
	selector: '[channel]',
	inputs: ['channel']
};
