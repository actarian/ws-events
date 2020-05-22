import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { STATIC } from '../environment/environment';
import HttpService from '../http/http.service';
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

	static setUser(user) {
		this.user$.next(user);
	}

	static me$() {
		return HttpService.get$('/api/users/me').pipe(
			map((user) => this.mapStatic__(user, 'me')),
			switchMap(user => {
				this.setUser(user);
				return this.user$;
			})
		);
	}

	static register$(payload) {
		return HttpService.post$('/api/users/register', payload).pipe(
			map((user) => this.mapStatic__(user, 'register')),
		);
	}

	static update(payload) {
		return HttpService.post$('/api/users/updateprofile', payload).pipe(
			map((user) => this.mapStatic__(user, 'register')),
		);
	}

	static login$(payload) {
		return HttpService.post$('/api/users/login', payload).pipe(
			map((user) => this.mapStatic__(user, 'login')),
		);
	}

	static logout$() {
		return HttpService.post$('/api/users/logout').pipe(
			map((user) => this.mapStatic__(user, 'logout')),
		);
	}
	static retrieve$(payload) {
		return HttpService.post$('/api/users/retrievepassword', payload).pipe(
			map((user) => this.mapStatic__(user, 'retrieve')),
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

UserService.user$ = new BehaviorSubject(null);
