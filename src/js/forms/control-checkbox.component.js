import ControlComponent from './control.component';

export default class ControlCheckboxComponent extends ControlComponent {}

ControlCheckboxComponent.meta = {
	selector: '[control-checkbox]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="wse__group--form--checkbox" [class]="{ required: control.validators.length }">
			<label>
				<input type="checkbox" class="wse__control--checkbox" [formControl]="control" [value]="true" />
				<span [innerHTML]="label | html"></span>
			</label>
			<span class="wse__required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
