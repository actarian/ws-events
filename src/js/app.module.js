import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import AppComponent from './app.component';
import AsideComponent from './aside/aside.component';
import ChannelPageComponent from './channel/channel-page.component';
import ChannelComponent from './channel/channel.component';
import ClickOutsideDirective from './click-outside/click-outside.directive';
import CountPipe from './count/count.pipe';
import DatePipe from './date/date.pipe';
import DropdownItemDirective from './dropdown/dropdown-item.directive';
import DropdownDirective from './dropdown/dropdown.directive';
import EventDateComponent from './event/event-date.component';
import EventPageComponent from './event/event-page.component';
import EventComponent from './event/event.component';
import FavouritePageComponent from './favourite/favourite-page.component';
import ControlCheckboxComponent from './forms/control-checkbox.component';
import ControlCustomSelectComponent from './forms/control-custom-select.component';
import ControlEmailComponent from './forms/control-email.component';
import ControlFileComponent from './forms/control-file.component';
import ControlPasswordComponent from './forms/control-password.component';
import ControlRadioComponent from './forms/control-radio.component';
import ControlSelectComponent from './forms/control-select.component';
import ControlTextComponent from './forms/control-text.component';
import ControlTextareaComponent from './forms/control-textarea.component';
import ErrorsComponent from './forms/errors.component';
import HeaderComponent from './header/header.component';
import HtmlPipe from './html/html.pipe';
import IndexPageComponent from './index/index-page.component';
import LabelPipe from './label/label.pipe';
import LazyDirective from './lazy/lazy.directive';
import ModalOutletComponent from './modal/modal-outlet.component';
import ModalComponent from './modal/modal.component';
import NotificationComponent from './notification/notification.component';
import PicturePipe from './picture/picture.pipe';
import RegisterOrLoginModal from './register-or-login/register-or-login.modal';
import RelativeDateDirective from './relative-date/relative-date.component';
import RelativeDatePipe from './relative-date/relative-date.pipe';
import ScrollToDirective from './scroll-to/scroll-to.directive';
import SecureDirective from './secure/secure.directive';
import ShareComponent from './share/share.component';
import SlugPipe from './slug/slug.pipe';
import SwiperEventsDirective from './swiper/swiper-events.directive';
import SwiperRelatedDirective from './swiper/swiper-related.directive';
import SwiperSlidesDirective from './swiper/swiper-slides.directive';
import SwiperTopEventsDirective from './swiper/swiper-top-events.directive';
import SwiperDirective from './swiper/swiper.directive';
import ThronComponent from './thron/thron.component';
import UserForgotComponent from './user/user-forgot.component';
import UserSigninComponent from './user/user-signin.component';
import UserSignupComponent from './user/user-signup.component';
import VideoComponent from './video/video.component';
import VimeoComponent from './vimeo/vimeo.component';
import VirtualStructure from './virtual/virtual.structure';
import YoutubeComponent from './youtube/youtube.component';

export default class AppModule extends Module {}

AppModule.meta = {
	imports: [
		CoreModule,
		FormModule,
	],
	declarations: [
		AsideComponent,
		ChannelComponent,
		ChannelPageComponent,
		ClickOutsideDirective,
		ControlCheckboxComponent,
		ControlCustomSelectComponent,
		ControlEmailComponent,
		ControlFileComponent,
		ControlPasswordComponent,
		ControlRadioComponent,
		ControlRadioComponent,
		ControlSelectComponent,
		ControlTextComponent,
		ControlTextareaComponent,
		CountPipe,
		DatePipe,
		DropdownDirective,
		DropdownItemDirective,
		ErrorsComponent,
		EventComponent,
		EventDateComponent,
		EventPageComponent,
		FavouritePageComponent,
		HeaderComponent,
		HtmlPipe,
		IndexPageComponent,
		LabelPipe,
		LazyDirective,
		ModalComponent,
		ModalOutletComponent,
		NotificationComponent,
		PicturePipe,
		RegisterOrLoginModal,
		RelativeDateDirective,
		RelativeDatePipe,
		ScrollToDirective,
		SecureDirective,
		ShareComponent,
		SlugPipe,
		SwiperDirective,
		SwiperEventsDirective,
		SwiperRelatedDirective,
		SwiperSlidesDirective,
		SwiperTopEventsDirective,
		ThronComponent,
		UserForgotComponent,
		UserSigninComponent,
		UserSignupComponent,
		VirtualStructure,
		VideoComponent,
		VimeoComponent,
		YoutubeComponent,
	],
	bootstrap: AppComponent,
};
