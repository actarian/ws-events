import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import DownloadService from '../download/download.service';
import { STATIC } from '../environment/environment';
import HttpService from '../http/http.service';
import ModalService, { ModalResolveEvent } from '../modal/modal.service';
import UserService from '../user/user.service';

const src = STATIC ? '/ws-events/register-or-login-modal.html' : '/Viewdoc.cshtml?co_id=23649';

export default class SecureDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		fromEvent(node, 'click').pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			event.preventDefault();
			this.tryDownloadHref();
		});
	}

	tryDownloadHref() {
		const { node } = getContext(this);
		const href = node.getAttribute('href');
		if (href) {
			HttpService.get$(href, undefined, 'blob').pipe(
				first(),
				map(response => response.data),
			).subscribe(blob => {
				DownloadService.download(blob, href.split('/').pop());
			}, error => {
				console.log('SecureDirective.tryDownloadHref.error', error);
				this.onLogin(event);
			});
		}
	}

	onLogin(event) {
		ModalService.open$({ src: src, data: { view: 1 } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('SecureDirective.onLogin', event);
			if (event instanceof ModalResolveEvent) {
				UserService.setUser(event.data);
				this.tryDownloadHref();
			}
		});
	}

}

SecureDirective.meta = {
	selector: '[secure]',
};
