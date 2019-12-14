import {Component, HostBinding, Input} from "@angular/core";

@Component({
  selector: 'action-button',
  template:`
    <p>{{text}}</p>
  `,
  styleUrls: ['action-button.component.scss']
})
export class ActionButtonComponent {
  @Input()
  @HostBinding('class.green') green = false;

  @Input()
  @HostBinding('class.red') red = false;

  @Input()
  @HostBinding('class.transparent') transparent = false;

  @Input() text = '';
}
