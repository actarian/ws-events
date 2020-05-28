import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import ApiService from '../api/api.service';
import { STATIC } from '../environment/environment';
import LocalStorageService from '../local-storage/local-storage.service';

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
		this.user$_.next(user);
	}

	static me$() {
		return ApiService.staticGet$(`/user/me`).pipe(
			// map((user) => this.mapStatic__(user, 'me')),
			map((user) => this.mapUser(user)),
			catchError(error => of (null)),
			switchMap(user => {
				this.setUser(user);
				return this.user$_;
			})
		);
	}

	static register$(payload) {
		return ApiService.staticPost$(`/user/register`, payload).pipe(
			map((user) => this.mapStatic__(user, 'register')),
		);
	}

	static login$(payload) {
		return ApiService.staticPost$(`/user/login`, payload).pipe(
			map((user) => this.mapStatic__(user, 'login')),
		);
	}

	static logout$() {
		return ApiService.staticPost$(`/user/logout`).pipe(
			map((user) => this.mapStatic__(user, 'logout')),
		);
	}

	static retrieve$(payload) {
		return ApiService.staticPost$(`/user/retrievepassword`, payload).pipe(
			map((user) => this.mapStatic__(user, 'retrieve')),
		);
	}

	static update$(payload) {
		return ApiService.staticPost$(`/user/updateprofile`, payload).pipe(
			map((user) => this.mapStatic__(user, 'register')),
		);
	}

	static mapStatic__(user, action = 'me') {
		if (!STATIC) {
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

	static mapUser(user) {
		return UserService.fake(new User(user));
	}

	static mapUsers(users) {
		return users ? users.map(x => UserService.mapUser(x)) : [];
	}

}

UserService.user$_ = new BehaviorSubject(null);
