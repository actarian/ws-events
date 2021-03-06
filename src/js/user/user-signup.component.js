import { Component } from 'rxcomp';
import { FormControl, FormGroup, FormValidator, Validators } from 'rxcomp-form';
import { first, takeUntil } from 'rxjs/operators';
import RequiredIfValidator from '../forms/required-if.validator';
import UserService from './user.service';

export default class UserSignupComponent extends Component {

	onInit() {
		const data = window.data || {
			roles: [{
				id: 0,
				name: 'area eventi'
			}, {
				id: 5,
				name: 'architetto'
			}, {
				id: 6,
				name: 'giornalista'
			}, {
				id: 4,
				name: 'rivenditore'
			}],
			countries: [{
				id: 114,
				name: 'Italia',
				idstato: 114
			}, {
				id: 204,
				name: 'Stati Uniti d\'America',
				idstato: 0
			}],
			provinces: [{
				id: 1,
				name: 'Pesaro',
				idstato: 114
			}],
			newsletterLanguages: [{
				id: 1,
				name: 'Italiano'
			}, {
				id: 2,
				name: 'Inglese'
			}]
		};

		const form = new FormGroup({
			firstName: new FormControl(null, Validators.RequiredValidator()),
			lastName: new FormControl(null, Validators.RequiredValidator()),
			company: new FormControl(null, Validators.RequiredValidator()),
			role: null,
			country: new FormControl(null, Validators.RequiredValidator()),
			province: new FormControl(null, Validators.RequiredValidator()),
			address: new FormControl(null, Validators.RequiredValidator()),
			zipCode: new FormControl(null, Validators.RequiredValidator()),
			city: new FormControl(null, Validators.RequiredValidator()),
			telephone: new FormControl(null, Validators.RequiredValidator()),
			fax: null,
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			// username: new FormControl(null, [Validators.RequiredValidator()]),
			password: new FormControl(null, [Validators.RequiredValidator()]),
			passwordConfirm: new FormControl(null, [Validators.RequiredValidator(), this.MatchValidator('password')]),
			privacy: new FormControl(null, Validators.RequiredTrueValidator()),
			newsletter: null,
			newsletterLanguage: new FormControl(null, RequiredIfValidator(() => form.controls.newsletter.value)),
			checkRequest: window.antiforgery,
			checkField: ''
		});

		const controls = form.controls;
		controls.role.options = data.roles;
		controls.country.options = data.countries;
		controls.province.options = [];
		controls.newsletterLanguage.options = data.newsletterLanguages;
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			this.countryId = changes.country;
			this.pushChanges();
			// console.log('UserSignupComponent.form.changes$', changes, form.valid);
		});
		form.controls.newsletter.changes$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => form.controls.Lingua.newsletterLanguage.next(null));

		this.data = data;
		this.form = form;
		this.error = null;
		this.success = false;
	}

	set countryId(countryId) {
		if (this.countryId_ !== countryId) {
			// console.log('UserSignupComponent.set countryId', countryId);
			this.countryId_ = countryId;
			const provinces = this.data.provinces.filter(province => {
				return String(province.idstato) === String(countryId);
			});
			this.controls.province.options = provinces;
			this.controls.province.hidden = provinces.length === 0;
			if (!provinces.find(x => x.id === this.controls.province.value)) {
				this.controls.province.value = null;
			}
		}
	}

	test() {
		this.form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			company: 'Websolute',
			role: this.controls.role.options[0].id,
			country: this.controls.country.options[0].id,
			address: 'Strada della Campanara',
			zipCode: '15',
			city: 'Pesaro',
			telephone: '00390721411112',
			email: 'jhonappleseed@gmail.com',
			// username: 'username',
			password: 'password',
			passwordConfirm: 'password',
			privacy: true,
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	MatchValidator(fieldName) {
		return new FormValidator((value) => {
			const field = this.form ? this.form.get(fieldName) : null;
			if (!value || !field) {
				return null;
			}
			return value !== field.value ? { match: { value: value, match: field.value } } : null;
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		// console.log('UserSignupComponent.onSubmit', 'form.valid', valid);
		if (this.form.valid) {
			this.form.submitted = true;
			UserService.register$(this.form.value).pipe(
				first(),
			).subscribe(response => {
				// console.log('UserSignupComponent.onSubmit', response);
				this.success = true;
				/*
				dataLayer.push({
					'event': 'formSubmission',
					'form type': 'Registrazione'
				});
				*/
				this.form.reset();
				// this.pushChanges();
				// this.signUp.next(typeof response === 'string' ? { status: response } : response);
			}, error => {
				console.log('UserSignupComponent.error', error);
				this.error = error;
				this.form.submitted = false;
				this.pushChanges();
			});
		} else {
			this.form.touched = true;
		}
	}

	onLogin() {
		this.login.next();
	}

}

UserSignupComponent.meta = {
	selector: '[user-signup]',
	//outputs: ['signUp', 'login'],
};
