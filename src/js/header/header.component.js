import { Component } from 'rxcomp';
import { combineLatest, of } from 'rxjs';
import { catchError, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import CssService from '../css/css.service';
import FavouriteService from '../favourite/favourite.service';
import NotificationService from '../notification/notification.service';
import UserService from '../user/user.service';

export default class HeaderComponent extends Component {

	onInit() {
		this.user = null;
		this.favourites = [];
		UserService.sharedChanged$.pipe(
			tap(user => this.user = user),
			switchMap(() => combineLatest(
				NotificationService.notifications$(),
				FavouriteService.subscriptions$(),
				FavouriteService.likes$(),
				FavouriteService.favourites$(),
			)),
			catchError(() => of (null)),
			takeUntil(this.unsubscribe$)
		).subscribe(data => {
			this.notifications = data[0];
			this.subscriptions = data[1];
			this.likes = data[2];
			this.favourites = data[3];
			this.pushChanges();
		});
		CssService.height$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(height => {
			// console.log('HeaderComponent.height$', height);
		});
		// console.log(JSON.stringify(LocaleService.defaultLocale));
	}

	doLogout($event) {
		UserService.logout$().pipe(
			first(),
		).subscribe((response) => window.location.href = response.data.retUrl);
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
