import { getContext } from 'rxcomp';
import ControlComponent from './control.component';

export default class ControlTextComponent extends ControlComponent {

	onInit() {
		this.required = false;
		const { node } = getContext(this);
		const input = node.querySelector('input');
		input.setAttribute('autocomplete', this.control.name);
	}

}

ControlTextComponent.meta = {
	selector: '[control-text]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="wse__group--form" [class]="{ required: control.validators.length }">
			<label [innerHTML]="label"></label>
			<input type="text" class="wse__control--text" [formControl]="control" [placeholder]="label" />
			<span class="wse__required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
