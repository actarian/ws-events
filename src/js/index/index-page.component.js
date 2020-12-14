import { combineLatest } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import ChannelService from '../channel/channel.service';
import EventService from '../event/event.service';
import PageComponent from '../page/page.component';
import UserService from '../user/user.service';

export default class IndexPageComponent extends PageComponent {

	onInit() {
		this.topEvents = this.topChannels = this.upcomingEvents = [];
		this.load$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(data => {
			this.topEvents = data[0];
			this.topChannels = data[1];
			this.upcomingEvents = data[2];
			this.pushChanges();
		});
	}

	load$() {
		return UserService.sharedChanged$.pipe(
			switchMap(() => combineLatest([
				EventService.top$(),
				ChannelService.top$(),
				EventService.upcoming$(),
			]))
		);
	}

}

IndexPageComponent.meta = {
	selector: '[index-page]',
};
