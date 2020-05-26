import { Component, getContext } from 'rxcomp';

export default class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('wse__hidden');
		this.asideActive = false;
	}

	// onView() { const context = getContext(this); }

	// onChanges() {}

	// onDestroy() {}

	onAsideToggle($event) {
		const { node } = getContext(this);
		if ($event) {
			node.classList.add('wse__aside--active');
			node.classList.remove('wse__notification--active');
		} else {
			node.classList.remove('wse__aside--active');
		}
		/*
		this.asideActive = $event;
		this.pushChanges();
		*/
	}

	onNotificationToggle($event) {
		const { node } = getContext(this);
		if ($event) {
			node.classList.add('wse__notification--active');
			node.classList.remove('wse__aside--active');
		} else {
			node.classList.remove('wse__notification--active');
		}
	}

}

AppComponent.meta = {
	selector: '[app-component]',
};
