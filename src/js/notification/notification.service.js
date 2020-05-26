import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ENV } from '../environment/environment';
import EventService from '../event/event.service';
import HttpService from '../http/http.service';

export default class NotificationService {

	static getCurrentNotification() {
		return this.notification$_.getValue();
	}

	static observe$() {
		return HttpService.get$(`${ENV.API}/user/notification`).pipe(
			map((items) => EventService.mapEvents(items)),
			switchMap(items => {
				this.notification$_.next(items);
				return this.notification$_;
			})
		);
	}

}

NotificationService.notification$_ = new BehaviorSubject(null);
NotificationService.observe$ = NotificationService.observe$().pipe(shareReplay(1));
