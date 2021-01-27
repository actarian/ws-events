import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import ApiService from '../api/api.service';
import { STATIC } from '../environment/environment';
import LocalStorageService from '../local-storage/local-storage.service';
import ModalService, { ModalResolveEvent } from '../modal/modal.service';

const src = STATIC ? '/ws-events/register-or-login-modal.html' : window.linkModal;

export class User {
	get avatar() {
		return (this.firstName || '?').substr(0, 1).toUpperCase() + (this.lastName || '?').substr(0, 1).toUpperCase();
	}

	get fullName() {
		return this.firstName + ' ' + this.lastName;
	}

	constructor(data) {
		if (data) {
			Object.assign(this, data);
		}
	}
}

export default class UserService {

	static getCurrentUser() {
		return this.user$_.getValue();
	}

	static setUser(user) {
		if (user) {
			user = new User(user);
		}
		this.user$_.next(user);
	}

	static me$() {
		//return ApiService.staticGet$(`/user/me`).pipe(
		return ApiService.get$(`/user/me`).pipe(
			// map((user) => this.mapStatic__(user, 'me')),
			map((response) => this.mapUser(response.data, response.static)),
			catchError(error => of (null)),
			switchMap(user => {
				this.setUser(user);
				return this.user$_;
			}),
		);
	}

	static changed$() {
		return this.sharedMe$.pipe(
			distinctUntilChanged((a, b) => (a == null && b == null) || (a && b && a.id === b.id)),
		)
	}

	static authorized$() {
		let user = this.getCurrentUser();
		if (user) {
			return of(user);
		} else {
			return ModalService.open$({ src: src, data: { view: 1 } }).pipe(
				switchMap(event => {
					if (event instanceof ModalResolveEvent) {
						user = event.data;
						this.setUser(user);
					}
					if (user) {
						return of(user);
					} else {
						return throwError('unauthorized');
					}
				}),
			);
		}
	}

	static register$(payload) {
		return ApiService.staticPost$(`/user/register`, payload).pipe(
			map((response) => this.mapUser(response.data, response.static)),
			// map((response) => this.mapStatic__(response.data, response.static, 'register')),
			tap(user => this.setUser(user)),
		);
	}

	static login$(payload) {
		return ApiService.staticPost$(`/user/login`, payload).pipe(
			map((response) => this.mapUser(response.data, response.static)),
			// map((response) => this.mapStatic__(response.data, response.static, 'login')),
			tap(user => {
				if (user && user.thron && window.thronClientId && window._ta && _ta.initTracker) {
					var tracker = _ta.initTracker(window.thronClientId);
					tracker.loginAs(
						user.thron.loginType,
						user.thron.loginValue,
						user.thron.contactName
					).then(success => console.log('UserService.tracker.success', success));
				}
			}),
			tap(user => this.setUser(user)),
		);
	}

	static logout$() {
		return ApiService.staticPost$(`/user/logout`).pipe(
			// map((response) => this.mapUser(null, response.static)),
			// map((response) => this.mapStatic__(response.data, response.static, 'logout')),
			tap(user => this.setUser(null)),
		);
	}

	static forgot$(payload) {
		return ApiService.staticPost$(`/user/forgot`, payload).pipe(
			// map((response) => this.mapUser(response.data, response.static)),
			// map((response) => this.mapStatic__(response.data, response.static, 'retrieve')),
		);
	}

	static update$(payload) {
		return ApiService.staticPost$(`/user/update`, payload).pipe(
			map((response) => this.mapUser(response.data, response.static)),
			// map((response) => this.mapStatic__(response.data, response.static, 'register')),
			tap(user => this.setUser(user)),
		);
	}

	static mapStatic__(user, isStatic, action = 'me') {
		if (!isStatic) {
			return user;
		};
		switch (action) {
			case 'me':
				if (!LocalStorageService.exist('user')) {
					user = null;
				};
				break;
			case 'register':
				LocalStorageService.set('user', user);
				break;
			case 'login':
				LocalStorageService.set('user', user);
				break;
			case 'logout':
				LocalStorageService.delete('user');
				break;
		}
		return user;
	}

	static fake(user) {
		user.firstName = user.firstName || 'Jhon';
		user.lastName = user.lastName || 'Appleseed';
		return user;
	}

	static mapUser(user, isStatic) {
		if (user) {
			return isStatic ? UserService.fake(new User(user)) : new User(user);
		}
	}

	static mapUsers(users, isStatic) {
		return users ? users.map(x => UserService.mapUser(x, isStatic)) : [];
	}

}

UserService.user$_ = new BehaviorSubject(null);
UserService.sharedMe$ = UserService.me$().pipe(shareReplay(1));
UserService.sharedChanged$ = UserService.changed$().pipe(shareReplay(1));
