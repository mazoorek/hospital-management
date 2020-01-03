import {Component, HostBinding, Input} from "@angular/core";

@Component({
  selector: 'action-button',
  template:`
    <div class="button-container"
         [ngStyle]="{'width.px': width, 'height.px': height }"
         [ngClass]="{'red': red, 'green': green, 'transparent': transparent, 'aquamarine': aquamarine, 'disabled': disabled}">
        <p class="button-content">{{text}}</p>
    </div>
  `,
  styleUrls: ['action-button.component.scss']
})
export class ActionButtonComponent {
  @Input() green = false;
  @Input() red = false;
  @Input() transparent = false;
  @Input() aquamarine = false;
  @Input() text = '';
  @Input() width = 70;
  @Input() height = 50;
  @Input() disabled = false;
}
