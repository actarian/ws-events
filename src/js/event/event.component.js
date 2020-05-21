import { Component } from 'rxcomp';
import { first } from 'rxjs/operators';
import EventService from './event.service';

export default class EventComponent extends Component {

	toggleSubscribe() {
		let flag = this.event.info.subscribed;
		EventService[flag ? 'unsubscribe$' : 'subscribe$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.subscribed = flag;
			if (flag) {
				this.event.info.subscribers++;
			} else {
				this.event.info.subscribers--;
			}
			this.pushChanges();
		});
	}

	toggleLike() {
		let flag = this.event.info.liked;
		EventService[flag ? 'unlike$' : 'like$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.liked = flag;
			if (flag) {
				this.event.info.likes++;
			} else {
				this.event.info.likes--;
			}
			this.pushChanges();
		});
	}

}

EventComponent.meta = {
	selector: '[event]',
	inputs: ['event']
};
