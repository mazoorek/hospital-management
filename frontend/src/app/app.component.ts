import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {NavbarService} from "./header/navbar/navbar.service";

const TAB_CONTAINER_HEIGHT: number = 90;

@Component({
  selector: 'app-root',
  template: `
    <header #header></header>
    <navbar [ngClass]="{'fixed': fixed}"></navbar>
    <hospital-wards #wards></hospital-wards>
    <specializations #specializations></specializations>
    <functions #functions></functions>
    <appointment-types #appointmentTypes></appointment-types>
    <operation-types #operationTypes></operation-types>
    <patients #patients></patients>
    <employees #employees></employees>
    <doctors #doctors>></doctors>
    <staff #staff></staff>
    <leaves-of-absence #leavesOfAbsence></leaves-of-absence>
    <rooms #rooms></rooms>
    <appointments #appointments></appointments>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('header', {read: ElementRef, static: false}) home: ElementRef;
  @ViewChild('wards', {read: ElementRef, static: false}) wards: ElementRef;
  @ViewChild('specializations', {read: ElementRef, static: false}) specializations: ElementRef;
  @ViewChild('functions', {read: ElementRef, static: false}) functions: ElementRef;
  @ViewChild('appointmentTypes', {read: ElementRef, static: false}) appointmentTypes: ElementRef;
  @ViewChild('operationTypes', {read: ElementRef, static: false}) operationTypes: ElementRef;
  @ViewChild('patients', {read: ElementRef, static: false}) patients: ElementRef;
  @ViewChild('employees', {read: ElementRef, static: false}) employees: ElementRef;
  @ViewChild('doctors', {read: ElementRef, static: false}) doctors: ElementRef;
  @ViewChild('staff', {read: ElementRef, static: false}) staff: ElementRef;
  @ViewChild('leavesOfAbsence', {read: ElementRef, static: false}) leavesOfAbsence: ElementRef;
  @ViewChild('rooms', {read: ElementRef, static: false}) rooms: ElementRef;
  @ViewChild('appointments', {read: ElementRef, static: false}) appointments: ElementRef;

  fixed: boolean = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.checkTabContainerPosition();
  }

  constructor(private navbarService: NavbarService) {
  }

  ngAfterViewInit(): void {
    this.navbarService.pageSections.next({
      home: this.home,
      wards: this.wards,
      specializations: this.specializations,
      functions: this.functions,
      appointmentTypes: this.appointmentTypes,
      operationTypes: this.operationTypes,
      patients: this.patients,
      employees: this.employees,
      doctors: this.doctors,
      staff: this.staff,
      leavesOfAbsence: this.leavesOfAbsence,
      rooms: this.rooms,
      appointments: this.appointments
    });
  }

  checkTabContainerPosition(): void {
    let offset =
      this.home.nativeElement.offsetTop + this.home.nativeElement.offsetHeight - TAB_CONTAINER_HEIGHT;
    this.fixed = window.pageYOffset > offset;
  }
}
