import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {ActionButtonComponent} from "../common/actionButton/action-button.component";
import {OperationTypesComponent} from "./operation-types/operation-types.component";
import {SpecializationsComponent} from "./specializations/specializations.component";
import {StaffComponent} from "./staff/staff.component";
import {FunctionsComponent} from "./functions/functions.component";
import {AppointmentTypesComponent} from "./appointment-types/appointment-types.component";
import {RoomsService} from "./rooms/rooms.service";
import {HospitalWardsService} from "./hospital-wards/hospital-wards.service";
import {DoctorsService} from "./doctors/doctors.service";
import {EmployeesService} from "./employees/employees.service";
import {FunctionsService} from "./functions/functions.service";
import {LeavesOfAbsenceService} from "./leaves-of-absence/leaves-of-absence.service";
import {OperationTypesService} from "./operation-types/operation-types.service";
import {PatientsService} from "./patients/patients.service";
import {SpecializationsService} from "./specializations/specializations.service";
import {StaffService} from "./staff/staff.service";
import {AppointmentsService} from "./appointments/appointments.service";
import {AppointmentTypesService} from "./appointment-types/appointment-types.service";
import {OverlayModule} from "@angular/cdk/overlay";
import {TooltipComponent} from "../common/tooltip/tooltip.component";
import {TooltipDirective} from "../common/tooltip/tooltip.directive";

@NgModule({
  entryComponents: [
    TooltipComponent
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    ActionButtonComponent,
    OperationTypesComponent,
    SpecializationsComponent,
    HospitalWardsComponent,
    StaffComponent,
    AppointmentTypesComponent,
    ListComponent,
    SpinnerComponent,
    PatientsComponent,
    FunctionsComponent,
    EmployeesComponent,
    DoctorsComponent,
    LeavesOfAbsenceComponent,
    RoomsComponent,
    AppointmentsComponent,
    TooltipComponent,
    TooltipDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    OverlayModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: "windowObject", useValue: window},
    RoomsService,
    HospitalWardsService,
    DoctorsService,
    EmployeesService,
    FunctionsService,
    LeavesOfAbsenceService,
    OperationTypesService,
    PatientsService,
    SpecializationsService,
    StaffService,
    AppointmentsService,
    AppointmentTypesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
