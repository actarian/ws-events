import { Pipe } from "rxcomp";

export const LABELS = Object.assign({
	cancel: 'Cancel',
	error_email: 'Invalid email',
	error_match: 'Fields do not match',
	error_required: 'Field is required',
	loading: 'loading',
	required: 'Required',
	select: 'Select',
}, (window.labels || {}));

export default class LabelPipe extends Pipe {

	static transform(key) {
		const labels = LABELS;
		return labels[key] || `#${key}#`;
	}

}

LabelPipe.meta = {
	name: 'label',
};
