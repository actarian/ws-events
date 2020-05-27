import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import EventService from '../event/event.service';
import ApiService from '../http/api.service';
import LocalStorageService from '../local-storage/local-storage.service';

const USE_LOCAL_STORAGE = true;

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
		return ApiService.staticGet$(`/user/subscription`).pipe(
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
		return ApiService.staticGet$(`/user/like`).pipe(
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
		return ApiService.staticGet$(`/user/favourite`).pipe(
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
		return ApiService.staticPost$(`/user/subscription/add`, { id }).pipe(
			tap(() => {
				if (USE_LOCAL_STORAGE) {
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
		return ApiService.staticPost$(`/user/subscription/remove`, { id }).pipe(
			tap(() => {
				if (USE_LOCAL_STORAGE) {
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
		return ApiService.staticPost$(`/user/like/add`, { id }).pipe(
			tap(() => {
				if (USE_LOCAL_STORAGE) {
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
		return ApiService.staticPost$(`/user/like/remove`, { id }).pipe(
			tap(() => {
				if (USE_LOCAL_STORAGE) {
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
		return ApiService.staticPost$(`/user/favourite/add`, { id }).pipe(
			tap(() => {
				if (USE_LOCAL_STORAGE) {
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
		return ApiService.staticPost$(`/user/favourite/remove`, { id }).pipe(
			tap(() => {
				if (USE_LOCAL_STORAGE) {
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
