import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import ApiService from '../api/api.service';
import EventService from '../event/event.service';

const notifications$_ = new BehaviorSubject(null);
export default class NotificationService {

	static getCurrentNotifications() {
		return notifications$_.getValue();
	}

	static notifications$() {
		//return ApiService.staticGet$(`/user/notification`).pipe(
		//associo la campanella in alto non alle notifiche ma agli eventi a cui un utente si è scritto
		return ApiService.get$(`/user/subscription`).pipe(
			map((response) => EventService.mapEvents(response.data, response.static)),
			switchMap(items => {
				notifications$_.next(items);
				return notifications$_;
			})
		);
	}

}

NotificationService.sharedNotifications$ = NotificationService.notifications$().pipe(shareReplay(1));
