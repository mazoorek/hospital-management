import {Component, Input} from "@angular/core";

@Component({
  selector: 'header',
  template: `
        <div class="section-container">
          <h1 class="title">HOSPITAL MANAGEMENT</h1>
          <h3 class="subtitle">Aplikacja do zarządzania szpitalem</h3>
        </div>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
}
