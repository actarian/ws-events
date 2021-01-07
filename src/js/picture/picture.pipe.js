import { Pipe } from 'rxcomp';

export default class PicturePipe extends Pipe {
	static transform(value, options) {
		let { src, width, height } = value.picture;
		if (options) {
			width = options.width;
			height = options.height;
		}
		const mediaType = value.media ? value.media.type : null;
		let url = '';
		switch(mediaType) {
			case 'vimeo':
				url = `${src}`;
				break;
			default:
				url = `${src}${width}x${height}?sig=${value.id}`;
		}
		return url;
	}
}

PicturePipe.meta = {
	name: 'picture',
};
