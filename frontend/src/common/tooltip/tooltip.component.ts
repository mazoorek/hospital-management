import {Component, Input} from "@angular/core";

@Component({
  selector: 'tooltip',
  template: `
    <div>{{ text }}</div>
  `,
  styleUrls: ['tooltip.component.scss']
})
export class TooltipComponent {

  @Input() text = '';

}
