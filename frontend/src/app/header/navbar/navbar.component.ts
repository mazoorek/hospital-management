import {Component, ElementRef, HostListener, ViewChild} from "@angular/core";
import {NavbarService} from "./navbar.service";

export interface NavbarEssential {
  sectionElement: ElementRef,
  navbarElement: ElementRef
}

const ADDITIONAL_OFFSET: number = 20; // bez tego czasem slider ląduje na zakładce obok

@Component({
  selector: 'navbar',
  template: `
    <a class="navbar-item" #HomeNavbarItem
       (click)="navigationItemClicked(homeNavbarItem)">Home</a>
    <a class="navbar-item" #WardsNavbarItem
       (click)="navigationItemClicked(wardsNavbarItem)">Oddziały</a>
    <a class="navbar-item" #SpecializationsNavbarItem
       (click)="navigationItemClicked(specializationsNavbarItem)">Specjalizacje</a>
    <a class="navbar-item" #FunctionsNavbarItem
       (click)="navigationItemClicked(functionsNavbarItem)">Funkcje</a>
    <a class="navbar-item" #AppointmentTypesNavbarItem
       (click)="navigationItemClicked(appointmentTypesNavbarItem)">Charaktery Wizyt</a>
    <a class="navbar-item" #OperationTypesNavbarItem
       (click)="navigationItemClicked(operationTypesNavbarItem)">Typy operacji</a>
    <a class="navbar-item" #PatientsNavbarItem
       (click)="navigationItemClicked(patientsNavbarItem)">Pacjenci</a>
    <a class="navbar-item" #EmployeesNavbarItem
       (click)="navigationItemClicked(employeesNavbarItem)">Pracownicy</a>
    <a class="navbar-item" #DoctorsNavbarItem
       (click)="navigationItemClicked(doctorsNavbarItem)">Lekarze</a>
    <a class="navbar-item" #StaffNavbarItem
       (click)="navigationItemClicked(staffNavbarItem)">Personel</a>
    <a class="navbar-item" #LeavesNavbarItem
       (click)="navigationItemClicked(leavesNavbarItem)">Urlopy</a>
    <a class="navbar-item" #RoomsNavbarItem
       (click)="navigationItemClicked(roomsNavbarItem)">Pokoje</a>
    <a class="navbar-item" #AppointmentsNavbarItem
       (click)="navigationItemClicked(appointmentsNavbarItem)">Wizyty</a>
    <span class="navbar-slider" [ngStyle]="{'width.px': sliderWidth, 'left.px': sliderLeft}"></span>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild('HomeNavbarItem', {read: ElementRef, static: false}) homeNavbarItem: ElementRef;
  @ViewChild('WardsNavbarItem', {read: ElementRef, static: false}) wardsNavbarItem: ElementRef;
  @ViewChild('SpecializationsNavbarItem', {read: ElementRef, static: false}) specializationsNavbarItem: ElementRef;
  @ViewChild('FunctionsNavbarItem', {read: ElementRef, static: false}) functionsNavbarItem: ElementRef;
  @ViewChild('AppointmentTypesNavbarItem', {read: ElementRef, static: false}) appointmentTypesNavbarItem: ElementRef;
  @ViewChild('OperationTypesNavbarItem', {read: ElementRef, static: false}) operationTypesNavbarItem: ElementRef;
  @ViewChild('PatientsNavbarItem', {read: ElementRef, static: false}) patientsNavbarItem: ElementRef;
  @ViewChild('EmployeesNavbarItem', {read: ElementRef, static: false}) employeesNavbarItem: ElementRef;
  @ViewChild('DoctorsNavbarItem', {read: ElementRef, static: false}) doctorsNavbarItem: ElementRef;
  @ViewChild('StaffNavbarItem', {read: ElementRef, static: false}) staffNavbarItem: ElementRef;
  @ViewChild('LeavesNavbarItem', {read: ElementRef, static: false}) leavesNavbarItem: ElementRef;
  @ViewChild('RoomsNavbarItem', {read: ElementRef, static: false}) roomsNavbarItem: ElementRef;
  @ViewChild('AppointmentsNavbarItem', {read: ElementRef, static: false}) appointmentsNavbarItem: ElementRef;

  sliderWidth: number = 0;
  sliderLeft: number = 0;

  currentNavbarItem: ElementRef = this.homeNavbarItem;
  navbarEssentials: NavbarEssential[];

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.findCurrentTabSelector();
  }

  @HostListener("window:resize", [])
  onResize() {
    this.setSliderCss();
  }

  constructor(private navbarService: NavbarService) {
    this.navbarService.pageSections.subscribe((pageSections) => {
      this.navbarEssentials = [
        {
          sectionElement: pageSections.home,
          navbarElement: this.homeNavbarItem
        },
        {
          sectionElement: pageSections.wards,
          navbarElement: this.wardsNavbarItem
        },
        {
          sectionElement: pageSections.specializations,
          navbarElement: this.specializationsNavbarItem
        },
        {
          sectionElement: pageSections.functions,
          navbarElement: this.functionsNavbarItem
        },
        {
          sectionElement: pageSections.appointmentTypes,
          navbarElement: this.appointmentTypesNavbarItem
        },
        {
          sectionElement: pageSections.operationTypes,
          navbarElement: this.operationTypesNavbarItem
        },
        {
          sectionElement: pageSections.patients,
          navbarElement: this.patientsNavbarItem
        },
        {
          sectionElement: pageSections.employees,
          navbarElement: this.employeesNavbarItem
        },
        {
          sectionElement: pageSections.doctors,
          navbarElement: this.doctorsNavbarItem
        },
        {
          sectionElement: pageSections.staff,
          navbarElement: this.staffNavbarItem
        },
        {
          sectionElement: pageSections.leavesOfAbsence,
          navbarElement: this.leavesNavbarItem
        },
        {
          sectionElement: pageSections.rooms,
          navbarElement: this.roomsNavbarItem
        },
        {
          sectionElement: pageSections.appointments,
          navbarElement: this.appointmentsNavbarItem
        }
      ];
    });
  }

  navigationItemClicked(currentNavbarItem: ElementRef): void {
    if (this.navbarEssentials) {
      const section =
        this.navbarEssentials
          .find(navbarEssential => navbarEssential.navbarElement === currentNavbarItem).sectionElement;
      section.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      this.currentNavbarItem = currentNavbarItem;
      this.setSliderCss();
    }
  }

  findCurrentTabSelector() {
    if (this.navbarEssentials) {
      this.navbarEssentials.forEach(element => {
          if (element.sectionElement.nativeElement.offsetTop <= window.pageYOffset + ADDITIONAL_OFFSET
            && element.sectionElement.nativeElement.offsetTop
            + element.sectionElement.nativeElement.offsetHeight >= window.pageYOffset + ADDITIONAL_OFFSET) {
            this.currentNavbarItem = element.navbarElement;
            this.setSliderCss();
          }
        }
      );
    }
  };

  setSliderCss() {
    if (this.currentNavbarItem) {
      this.sliderWidth = this.currentNavbarItem.nativeElement.offsetWidth;
      this.sliderLeft = this.currentNavbarItem.nativeElement.offsetLeft;
    }
  }
}
