import { Component, getContext } from 'rxcomp';
import ModalOutletComponent from '../modal/modal-outlet.component';
import ModalService from '../modal/modal.service';

export default class RegisterOrLoginModal extends Component {

	onInit() {
		const { node, parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			// console.log('RegisterOrLoginModal.onInit', data);
		}
		this.views = {
			SIGN_IN: 1,
			SIGN_UP: 2,
			FORGOTTEN: 3,
		};
		this.view = node.hasAttribute('view') ? parseInt(node.getAttribute('view')) : this.views.SIGN_IN;
	}

	onForgot(event) {
		// console.log('RegisterOrLoginModal.onForgot');
		this.view = this.views.FORGOTTEN;
		this.pushChanges();
	}

	onLogin(event) {
		// console.log('RegisterOrLoginModal.onLogin');
		this.view = this.views.SIGN_IN;
		this.pushChanges();
	}

	onRegister(event) {
		// console.log('RegisterOrLoginModal.onRegister');
		this.view = this.views.SIGN_UP;
		this.pushChanges();
	}

	onSignIn(user) {
		// console.log('RegisterOrLoginModal.onSignIn', user);
		// UserService.setUser(user);
		ModalService.resolve(user);
	}

	onSignUp(user) {
		// console.log('RegisterOrLoginModal.onSignUp', user);
		// UserService.setUser(user);
		ModalService.resolve(user);
	}

	onForgottenSent(email) {
		// console.log('RegisterOrLoginModal.onForgottenSent', email);
		// this.view = this.views.SIGN_IN;
		this.pushChanges();
	}

	close() {
		ModalService.reject();
	}

}

RegisterOrLoginModal.meta = {
	selector: '[register-or-login-modal]',
};
