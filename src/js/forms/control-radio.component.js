import ControlComponent from './control.component';

export default class ControlRadioComponent extends ControlComponent {

}

ControlRadioComponent.meta = {
	selector: '[control-radio]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="wse__group--form--radio" [class]="{ required: control.validators.length }">
			<label>
				<input type="radio" class="wse__control--radio" [formControl]="control" [value]="true"/>
				<span [innerHTML]="label"></span>
			</label>
			<span class="wse__required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
