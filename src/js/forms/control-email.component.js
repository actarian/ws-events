import ControlComponent from './control.component';

export default class ControlEmailComponent extends ControlComponent {

}

ControlEmailComponent.meta = {
	selector: '[control-email]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="wse__group--form" [class]="{ required: control.validators.length }">
			<label [innerHTML]="label"></label>
			<input type="text" class="wse__control--text" [formControl]="control" [placeholder]="label" required email />
			<span class="wse__required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
