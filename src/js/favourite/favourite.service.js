import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ENV } from '../environment/environment';
import EventService from '../event/event.service';
import HttpService from '../http/http.service';
import LocalStorageService from '../local-storage/local-storage.service';

export default class FavouriteService {

	static observe$() {
		return HttpService.get$(`${ENV.API}/user/favourite`).pipe(
			map(() => {
				const favourites = LocalStorageService.get('favourites') || [];
				return favourites;
			}),
			switchMap(favourites => {
				this.favourites$.next(favourites);
				return this.favourites$;
			})
		);
	}

	static saved$() {
		return this.observe$().pipe(
			map(events => EventService.fakeSaved(events)),
		);
		return HttpService.get$(`${ENV.API}/user/favourite/items`).pipe(
			map(events => EventService.mapEvents(events)),
		);
	}

	static liked$() {
		return of([]);
	}

	static add$(id) {
		return HttpService.post$(`${ENV.API}/user/favourite/add`, { id }).pipe(
			tap(() => {
				const favourites = LocalStorageService.get('favourites') || [];
				const item = favourites.find(x => x.id === id);
				if (!item) {
					favourites.unshift({ id });
				}
				this.favourites$.next(favourites);
				LocalStorageService.set('favourites', favourites);
			}),
		);
	}

	static remove$(id) {
		return HttpService.post$(`${ENV.API}/user/favourite/remove`, { id }).pipe(
			tap(() => {
				const favourites = LocalStorageService.get('favourites') || [];
				const item = favourites.find(x => x.id === id);
				const index = item ? favourites.indexOf(item) : -1;
				if (index !== -1) {
					favourites.splice(index, 1);
				}
				this.favourites$.next(favourites);
				LocalStorageService.set('favourites', favourites);
			}),
		);
	}

}

FavouriteService.favourites$ = new BehaviorSubject([]);
