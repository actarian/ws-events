import { Component } from 'rxcomp';
import { first } from 'rxjs/operators';
import EventService from './event.service';

export default class EventComponent extends Component {

	toggleSubscribe() {
		const flag = this.event.info.subscribed;
		EventService[flag ? 'unsubscribe$' : 'subscribe$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			this.event.info.subscribed = !flag;
			this.pushChanges();
		});
	}

	toggleLike() {
		const flag = this.event.info.liked;
		EventService[flag ? 'unlike$' : 'like$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			this.event.info.liked = !flag;
			this.pushChanges();
		});
	}

}

EventComponent.meta = {
	selector: '[event]',
	inputs: ['event']
};
