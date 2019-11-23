import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {NavbarComponent} from "./header/navbar/navbar.component";
import {HeaderComponent} from "./header/header.component";
import {HospitalWardsComponent} from "./hospital-wards/hospital-wards.component";
import {HttpClientModule} from "@angular/common/http";
import {PatientsComponent} from "./patients/patients.component";
import {ListComponent} from "../common/List/list.component";
import {SpinnerComponent} from "../common/Spinner/spinner.component";
import {EmployeesComponent} from "./employees/employees.component";
import {DoctorsComponent} from "./doctors/doctors.component";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    HospitalWardsComponent,
    ListComponent,
    SpinnerComponent,
    PatientsComponent,
    EmployeesComponent,
    DoctorsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{provide: "windowObject", useValue: window}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
