import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ENV, STATIC } from '../environment/environment';
import EventService from '../event/event.service';
import HttpService from '../http/http.service';
import LocalStorageService from '../local-storage/local-storage.service';

const subscriptions$_ = new BehaviorSubject([]);
const likes$_ = new BehaviorSubject([]);
const favourites$_ = new BehaviorSubject([]);

export default class FavouriteService {

	static getCurrentSubscriptions() {
		return subscriptions$_.getValue();
	}

	static getCurrentLikes() {
		return likes$_.getValue();
	}

	static getCurrentFavourites() {
		return favourites$_.getValue();
	}

	static subscriptions$() {
		return HttpService.get$(`${ENV.API}/user/subscription`).pipe(
			map(() => {
				const subscriptions = LocalStorageService.get('subscriptions') || [];
				return subscriptions;
			}),
			map(events => EventService.fakeSaved(events)),
			switchMap(subscriptions => {
				subscriptions$_.next(subscriptions);
				return subscriptions$_;
			})
		);
	}

	static likes$() {
		return HttpService.get$(`${ENV.API}/user/like`).pipe(
			map(() => {
				const likes = LocalStorageService.get('likes') || [];
				return likes;
			}),
			map(events => EventService.fakeSaved(events)),
			switchMap(likes => {
				likes$_.next(likes);
				return likes$_;
			})
		);
	}

	static favourites$() {
		return HttpService.get$(`${ENV.API}/user/favourite`).pipe(
			map(() => {
				const favourites = LocalStorageService.get('favourites') || [];
				return favourites;
			}),
			map(events => EventService.fakeSaved(events)),
			switchMap(favourites => {
				favourites$_.next(favourites);
				return favourites$_;
			})
		);
	}

	static subscriptionAdd$(id) {
		return HttpService.post$(`${ENV.API}/user/subscription/add`, { id }).pipe(
			tap(() => {
				if (STATIC) {
					const subscriptions = LocalStorageService.get('subscriptions') || [];
					const item = subscriptions.find(x => x.id === id);
					if (!item) {
						subscriptions.unshift({ id });
					}
					subscriptions$_.next(subscriptions);
					LocalStorageService.set('subscriptions', subscriptions);
				}
			}),
		);
	}

	static subscriptionRemove$(id) {
		return HttpService.post$(`${ENV.API}/user/subscription/remove`, { id }).pipe(
			tap(() => {
				if (STATIC) {
					const subscriptions = LocalStorageService.get('subscriptions') || [];
					const item = subscriptions.find(x => x.id === id);
					const index = item ? subscriptions.indexOf(item) : -1;
					if (index !== -1) {
						subscriptions.splice(index, 1);
					}
					subscriptions$_.next(subscriptions);
					LocalStorageService.set('subscriptions', subscriptions);
				}
			}),
		);
	}

	static likeAdd$(id) {
		return HttpService.post$(`${ENV.API}/user/like/add`, { id }).pipe(
			tap(() => {
				if (STATIC) {
					const likes = LocalStorageService.get('likes') || [];
					const item = likes.find(x => x.id === id);
					if (!item) {
						likes.unshift({ id });
					}
					likes$_.next(likes);
					LocalStorageService.set('likes', likes);
				}
			}),
		);
	}

	static likeRemove$(id) {
		return HttpService.post$(`${ENV.API}/user/like/remove`, { id }).pipe(
			tap(() => {
				if (STATIC) {
					const likes = LocalStorageService.get('likes') || [];
					const item = likes.find(x => x.id === id);
					const index = item ? likes.indexOf(item) : -1;
					if (index !== -1) {
						likes.splice(index, 1);
					}
					likes$_.next(likes);
					LocalStorageService.set('likes', likes);
				}
			}),
		);
	}

	static favouriteAdd$(id) {
		return HttpService.post$(`${ENV.API}/user/favourite/add`, { id }).pipe(
			tap(() => {
				if (STATIC) {
					const favourites = LocalStorageService.get('favourites') || [];
					const item = favourites.find(x => x.id === id);
					if (!item) {
						favourites.unshift({ id });
					}
					favourites$_.next(favourites);
					LocalStorageService.set('favourites', favourites);
				}
			}),
		);
	}

	static favouriteRemove$(id) {
		return HttpService.post$(`${ENV.API}/user/favourite/remove`, { id }).pipe(
			tap(() => {
				if (STATIC) {
					const favourites = LocalStorageService.get('favourites') || [];
					const item = favourites.find(x => x.id === id);
					const index = item ? favourites.indexOf(item) : -1;
					if (index !== -1) {
						favourites.splice(index, 1);
					}
					favourites$_.next(favourites);
					LocalStorageService.set('favourites', favourites);
				}
			}),
		);
	}

}

FavouriteService.subscriptions$ = FavouriteService.subscriptions$().pipe(shareReplay(1));
FavouriteService.likes$ = FavouriteService.likes$().pipe(shareReplay(1));
FavouriteService.favourites$ = FavouriteService.favourites$().pipe(shareReplay(1));
