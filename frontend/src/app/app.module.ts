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
import {LeavesOfAbsenceComponent} from "./leaves-of-absence/leaves-of-absence.component";
import {RoomsComponent} from "./rooms/rooms.component";
import {AppointmentsComponent} from "./appointments/appointments.component";
import {ActionButtonComponent} from "../common/button/action-button.component";



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    ActionButtonComponent,
    HospitalWardsComponent,
    ListComponent,
    SpinnerComponent,
    PatientsComponent,
    EmployeesComponent,
    DoctorsComponent,
    LeavesOfAbsenceComponent,
    RoomsComponent,
    AppointmentsComponent
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
