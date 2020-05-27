import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ENV } from '../environment/environment';
import EventService from '../event/event.service';
import HttpService from '../http/http.service';

const notifications$_ = new BehaviorSubject(null);
export default class NotificationService {

	static getCurrentNotifications() {
		return notifications$_.getValue();
	}

	static notifications$() {
		return HttpService.get$(`${ENV.API}/user/notification`).pipe(
			map((items) => EventService.mapEvents(items)),
			switchMap(items => {
				notifications$_.next(items);
				return notifications$_;
			})
		);
	}

}

NotificationService.notifications$ = NotificationService.notifications$().pipe(shareReplay(1));
