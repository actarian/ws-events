import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import AppComponent from './app.component';
import ChannelPageComponent from './channel/channel-page.component';
import ChannelComponent from './channel/channel.component';
import DatePipe from './date/date.pipe';
import DropdownItemDirective from './dropdown/dropdown-item.directive';
import DropdownDirective from './dropdown/dropdown.directive';
import EventDateComponent from './event/event-date.component';
import EventPageComponent from './event/event-page.component';
import EventComponent from './event/event.component';
import ErrorsComponent from './forms/errors.component';
import HtmlPipe from './html/html.pipe';
import IndexPageComponent from './index/index-page.component';
import LazyDirective from './lazy/lazy.directive';
import ModalOutletComponent from './modal/modal-outlet.component';
import ModalComponent from './modal/modal.component';
import RegisterOrLoginComponent from './register-or-login/register-or-login.component';
import RelativeDatePipe from './relative-date/relative-date.pipe';
import ScrollToDirective from './scroll-to/scroll-to.directive';
import SecureDirective from './secure/secure.directive';
import SwiperEventsDirective from './swiper/swiper-events.directive';
import SwiperSlidesDirective from './swiper/swiper-slides.directive';
import SwiperTopEventsDirective from './swiper/swiper-top-events.directive';
import SwiperDirective from './swiper/swiper.directive';
import ThronComponent from './thron/thron.component';
import VideoComponent from './video/video.component';
import VirtualStructure from './virtual/virtual.structure';
import YoutubeComponent from './youtube/youtube.component';

export default class AppModule extends Module {}

AppModule.meta = {
	imports: [
		CoreModule,
		FormModule,
	],
	declarations: [
		ChannelComponent,
		ChannelPageComponent,
		DatePipe,
		DropdownDirective,
		DropdownItemDirective,
		ErrorsComponent,
		EventComponent,
		EventDateComponent,
		EventPageComponent,
		HtmlPipe,
		IndexPageComponent,
		LazyDirective,
		ModalComponent,
		ModalOutletComponent,
		RegisterOrLoginComponent,
		RelativeDatePipe,
		ScrollToDirective,
		SecureDirective,
		SwiperDirective,
		SwiperEventsDirective,
		SwiperSlidesDirective,
		SwiperTopEventsDirective,
		ThronComponent,
		VirtualStructure,
		VideoComponent,
		YoutubeComponent,
	],
	bootstrap: AppComponent,
};
