import { FormValidator } from 'rxcomp-form';

export default function RequiredIfValidator(condition) {
	return new FormValidator(function (value, params) {
		const condition = params.condition;
		if (!typeof condition === 'function') {
			return null;
		}
		if (Boolean(condition()) === true) {
			return (value == null || value.length === 0) ? { required: true } : null;
		} else {
			return null;
		}
	}, { condition });
}
