import { switchMap, takeUntil } from 'rxjs/operators';
import PageComponent from '../page/page.component';
import UserService from '../user/user.service';
import NotificationService from './notification.service';

export default class NotificationComponent extends PageComponent {

	onInit() {
		this.grid = {
			mode: 4,
			width: 320,
			gutter: 0,
		};
		this.notifications = [];
		this.load$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(notifications => {
			this.notifications = notifications;
			this.pushChanges();
		});
	}

	load$() {
		return UserService.sharedChanged$.pipe(
			switchMap(() => NotificationService.notifications$()),
		);
	}

}

NotificationComponent.meta = {
	selector: '[notification]',
};
