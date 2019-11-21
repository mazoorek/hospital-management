import {Component, Input} from "@angular/core";

@Component({
  selector: 'header',
  template: `
      <div class="header-section">
          <h1 class="title">HOSPITAL MANAGEMENT</h1>
          <h3 class="subtitle">Aplikacja do zarządzania szpitalem</h3>
          <navbar [ngClass]="{'fixed': fixed}"></navbar>
      </div>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() fixed: boolean = false;
}