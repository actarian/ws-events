import { switchMap, takeUntil } from 'rxjs/operators';
import ChannelService from '../channel/channel.service';
import LocationService from '../location/location.service';
import PageComponent from '../page/page.component';
import UserService from '../user/user.service';

export default class AsideComponent extends PageComponent {

	onInit() {
		let channelId = LocationService.get('channelId');
		channelId = channelId ? parseInt(channelId) : null;
		this.channelId = channelId;
		this.channels = [];
		this.load$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(channels => {
			this.channels = channels;
			this.pushChanges();
		});
	}

	load$() {
		return UserService.sharedChanged$.pipe(
			switchMap(() => ChannelService.channels$()),
		);
	}

}

AsideComponent.meta = {
	selector: '[aside]',
};
