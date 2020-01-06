import {Component, ElementRef, OnInit} from "@angular/core";
import {EmployeesService} from "./employees.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Employee} from "./employee.model";
import {DoctorsService} from "../doctors/doctors.service";
import {StaffService} from "../staff/staff.service";
import {LeavesOfAbsenceService} from "../leaves-of-absence/leaves-of-absence.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Staff} from "../staff/staff.model";
import {NavbarService} from "../header/navbar/navbar.service";

@Component({
  selector: 'employees',
  template: `
    <h1 class="section-header">PRACOWNICY</h1>
    <spinner *ngIf="loading"></spinner>
    <div class="section-body" *ngIf="!loading">
      <div class="flex-item form-flex-item"
           [ngClass]="{'collapsed': !showForm}">
        <div *ngIf="showForm" class="form-container">
          <form class="form-body" [formGroup]="addRowForm">
            <div class="form-row" *ngIf="formRowId>-1">
              <label for="name">Imię</label>
              <input type="text"
                     placeholder="wpisz imię"
                     class="form-control"
                     formControlName="name"
                     id="name">
            </div>
            <div class="validation-error" *ngIf="formEmployeeName.errors?.pattern">
              Pole może zawierać małe/duże litery oraz znaki spacji
            </div>
            <div class="validation-error" *ngIf="formEmployeeName.errors?.required && formEmployeeName.touched">
              Pole nie może być puste
            </div>
            <div class="form-row" *ngIf="formRowId>-1">
              <label for="surname">Nazwisko</label>
              <input type="text"
                     placeholder="wpisz nazwisko"
                     class="form-control"
                     formControlName="surname"
                     id="surname">
            </div>
            <div class="validation-error" *ngIf="formEmployeeSurname.errors?.pattern">
              Pole może zawierać małe/duże litery oraz znaki spacji
            </div>
            <div class="validation-error" *ngIf="formEmployeeSurname.errors?.required && formEmployeeSurname.touched">
              Pole nie może być puste
            </div>
            <div class="form-row" *ngIf="formRowId===-1">
              <label for="employeeType">Typ pracownnika</label>
              <select id="employeeType" class="select-field" (change)="changeEmployeeType($event)"
                      formControlName="employeeType">
                <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz Typ Pracownika
                </option>
                <option *ngFor="let employeeType of employeeTypes"
                        [ngValue]="employeeType">{{employeeType}}</option>
              </select>
            </div>
          </form>
          <div class="buttons-container">
            <action-button
              class="form-button"
              (click)="onClickAddOrUpdate()"
              [green]="true"
              [disabled]="addRowForm.invalid"
              text="Zatwierdź rekord"
              [width]="200"></action-button>
            <action-button
              class="form-button"
              (click)="onClickHideForm()"
              [red]="true"
              text="Porzuć"
              [width]="200"></action-button>
          </div>
        </div>
      </div>
      <list class="flex-item list-flex-item"
            (addOrUpdateRowChange)="loadForm($event)"
            (removeRowChange)="deleteEmployee($event)"
            [listContent]="listContent"></list>
    </div>
  `,
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  loading: boolean = true;
  listContent: ListContent;
  showForm: boolean = false;
  formRowId: number = -1;
  addRowForm: FormGroup;
  employees: Employee [];
  employeeTypes: string [] = ['lekarz', 'personel'];
  doctorsSection: ElementRef;
  staffSection: ElementRef;

  constructor(private employeeService: EmployeesService,
              private doctorsService: DoctorsService,
              private staffService: StaffService,
              private navbarService: NavbarService,
              private leavesOfAbsenceService: LeavesOfAbsenceService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadEmployees();
    this.employeeService.loadEmployeesSubject.subscribe(() => {
      this.loadEmployees();
    });
    this.navbarService.pageSections.subscribe(pageSections => {
      this.doctorsSection = pageSections.doctors;
      this.staffSection = pageSections.staff;
    });
  }

  get formEmployeeName() {
    return this.addRowForm.get('name');
  }

  get formEmployeeSurname() {
    return this.addRowForm.get('surname');
  }

  changeEmployeeType(event): void {
    this.addRowForm.patchValue({
      'employeeType': event.target.value
    })
  }

  private loadEmployees() {
    this.loading = true;
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.loadListContent();
      this.loading = false;
    })
  }

  setupForm(): void {
    this.addRowForm = new FormGroup({
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]),
      'surname': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]),
      'employeeType': new FormControl('', Validators.required)
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko', 'typ stanowiska'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let employee of this.employees) {
      rows.push({
        row: [
          String(employee.id),
          employee.name,
          employee.surname,
          employee.type
        ]
      })
    }
    return rows;
  }

  deleteEmployee(employeeId: number): void {
    this.loading = true;
    this.employeeService.deleteEmployee(employeeId).subscribe(() => {
      this.loadEmployees();
      this.doctorsService.loadDoctors();
      this.staffService.loadStaff();
      this.leavesOfAbsenceService.loadLeavesOfAbsence();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.addRowForm.get('name').setValidators([
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]);
      this.addRowForm.get('surname').setValidators([
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]);
      this.addRowForm.get('employeeType').setValidators(null);
      this.addRowForm.patchValue({
        'name': this.employees.filter(employee => employee.id === this.formRowId).map(employee => employee.name)[0],
        'surname': this.employees.filter(employee => employee.id === this.formRowId).map(employee => employee.surname)[0],
      });
    } else {
      this.addRowForm.get('name').setValidators(null);
      this.addRowForm.get('surname').setValidators(null);
      this.addRowForm.get('employeeType').setValidators(Validators.required);
      this.addRowForm.reset();
    }
    this.showForm = true;
  }

  onClickAddOrUpdate(): void {
    if (this.addRowForm.valid) {
      this.loading = true;
      if (this.formRowId === -1) {
        let filterByRegex = new RegExp('^[A-Za-z\\s]+$');
        let employeeType = this.addRowForm.value['employeeType'].split(" ").filter(word => word.match(filterByRegex)).join(" ")
          if(employeeType==='lekarz') {
            this.doctorsService.addNewDoctor();
            this.doctorsSection.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
          } else {
            this.staffService.addNewStaffMember();
            this.staffSection.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
          }
          this.showForm = false;
          this.loading = false;
      } else {
        this.employeeService.updateEmployee({
          name: this.addRowForm.value['name'],
          surname: this.addRowForm.value['surname'],
          id: this.formRowId
        } as Employee).subscribe(() => {
          this.showForm = false;
          this.formRowId = -1;
          this.loadEmployees();
        });
      }
    }
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
