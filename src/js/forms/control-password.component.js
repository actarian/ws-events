import ControlComponent from './control.component';

export default class ControlPasswordComponent extends ControlComponent {

	onInit() {
		this.required = false;
	}

}

ControlPasswordComponent.meta = {
	selector: '[control-password]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="wse__group--form" [class]="{ required: control.validators.length }">
			<label [innerHTML]="label"></label>
			<input type="password" class="wse__control--text" [formControl]="control" [placeholder]="label" autocomplete="new-password" />
			<span class="wse__required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
