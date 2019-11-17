import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {NavbarComponent} from "./header/navbar/navbar.component";
import {HeaderComponent} from "./header/header.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [{provide: "windowObject", useValue: window}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
