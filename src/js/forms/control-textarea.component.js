import ControlComponent from './control.component';

export default class ControlTextareaComponent extends ControlComponent {

	onInit() {
		this.required = false;
	}

}

ControlTextareaComponent.meta = {
	selector: '[control-textarea]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="wse__group--form--textarea" [class]="{ required: control.validators.length }">
			<label [innerHTML]="label"></label>
			<textarea class="wse__control--text" [formControl]="control" [innerHTML]="label" rows="4"></textarea>
			<span class="wse__required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
