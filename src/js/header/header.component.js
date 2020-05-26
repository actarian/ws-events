import { Component } from 'rxcomp';
import { of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import CssService from '../css/css.service';
import FavouriteService from '../favourite/favourite.service';
import NotificationService from '../notification/notification.service';
import UserService from '../user/user.service';

export default class HeaderComponent extends Component {

	onInit() {
		this.user = null;
		this.favourites = [];
		UserService.me$().pipe(
			catchError(() => of (null)),
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			console.log('HeaderComponent.me$', user);
			this.user = user;
			this.pushChanges();
		});
		FavouriteService.observe$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(favourites => {
			this.favourites = favourites;
			// console.log('HeaderComponent.favourites', favourites);
			this.pushChanges();
		});
		NotificationService.observe$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(notifications => {
			this.notifications = notifications;
			// console.log('HeaderComponent.notifications', notifications);
			this.pushChanges();
		});
		CssService.height$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(height => {
			// console.log('HeaderComponent.height$', height);
		});
		// console.log(JSON.stringify(LocaleService.defaultLocale));
	}

	toggleAside($event) {
		this.aside_ = !this.aside_;
		this.aside.next(this.aside_);
	}

	dismissAside($event) {
		if (this.aside_) {
			this.aside_ = false;
			this.aside.next(this.aside_);
		}
	}

	toggleNotification($event) {
		this.notification_ = !this.notification_;
		this.notification.next(this.notification_);
	}

	dismissNotification($event) {
		if (this.notification_) {
			this.notification_ = false;
			this.notification.next(this.notification_);
		}
	}

	onDropped(id) {
		// console.log('HeaderComponent.onDropped', id);
		this.submenu = id;
		this.pushChanges();
	}

}

HeaderComponent.meta = {
	selector: 'header',
	outputs: ['aside', 'notification']
};
