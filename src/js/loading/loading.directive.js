import { Directive, getContext } from 'rxcomp';

export default class LoadingDirective extends Directive {

	onInit() {
		this.onLoad = this.onLoad.bind(this);
		const { node } = getContext(this);
		if ('loading' in HTMLImageElement.prototype) {
			node.addEventListener('load', this.onLoad);
		} else {
			this.onLoad();
		}
	}

	onLoad() {
		const { node } = getContext(this);
		node.classList.add('lazyed');
	}

	onDestroy() {
		const { node } = getContext(this);
		node.removeEventListener('load', this.onLoad);
	}
}

LoadingDirective.meta = {
	selector: '[loading]',
	inputs: ['loading']
};
