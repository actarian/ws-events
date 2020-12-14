import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil } from 'rxjs/operators';
import UserService from './user.service';

export default class UserForgotComponent extends Component {

	onInit() {
		const form = new FormGroup({
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			checkRequest: window.antiforgery,
			checkField: ''
		});

		const controls = form.controls;
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			// console.log('UserForgotComponent.form.changes$', changes, form.valid);
			this.pushChanges();
		});

		this.form = form;
		this.error = null;
		this.success = false;
	}

	test() {
		this.form.patch({
			email: 'jhonappleseed@gmail.com',
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		// console.log('UserForgotComponent.onSubmit', 'form.valid', valid);
		if (this.form.valid) {
			// console.log('UserForgotComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			UserService.forgot$(this.form.value).pipe(
				first()
			).subscribe(response => {
				// console.log('UserForgotComponent.onSubmit', response);
				this.sent.next(true);
				this.success = true;
				// this.form.reset();
				this.pushChanges();
			}, error => {
				console.log('UserForgotComponent.error', error);
				this.error = error;
				this.pushChanges();
			});
		} else {
			this.form.touched = true;
		}
	}

	onLogin() {
		this.login.next();
	}

	onRegister() {
		this.register.next();
	}

}

UserForgotComponent.meta = {
	selector: '[user-forgot]',
	outputs: ['sent', 'login', 'register'],
};
