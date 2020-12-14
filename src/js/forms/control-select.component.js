import ControlComponent from './control.component';

export default class ControlSelectComponent extends ControlComponent {

	onInit() {
		this.labels = window.labels || {};
	}

}

ControlSelectComponent.meta = {
	selector: '[control-select]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="wse__group--form--select" [class]="{ required: control.validators.length }">
			<label [innerHTML]="label"></label>
			<select class="wse__control--select" [formControl]="control" required>
				<option value="">{{labels.select}}</option>
				<option [value]="item.id" *for="let item of control.options" [innerHTML]="item.name"></option>
			</select>
			<span class="wse__required__badge">required</span>
			<svg class="wse__caret-down"><use xlink:href="#caret-down"></use></svg>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
