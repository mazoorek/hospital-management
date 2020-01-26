import {Component, OnInit} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {LeavesOfAbsenceService} from "./leaves-of-absence.service";
import {LeaveOfAbsence} from "./leave-of-absence.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmployeesService} from "../employees/employees.service";
import {Employee} from "../employees/employee.model";
import {AppointmentsService} from "../appointments/appointments.service";
import {Appointment} from "../appointments/appointment.model";
import {DoctorsService} from "../doctors/doctors.service";

export interface SimpleDoctor {
  employeeId: number;
  doctorId: number;
}

@Component({
  selector: 'leaves-of-absence',
  template: `
    <div class="section-container">
      <h1 class="section-header">URLOPY</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item list-flex-item">
          <list
            (addOrUpdateRowChange)="loadForm($event)"
            [showIdColumn]="false"
            (removeRowChange)="deleteLeaveOfAbsence($event)"
            [listContent]="listContent"></list>
        </div>
        <div class="flex-item form-flex-item"
             [ngClass]="{'collapsed': !showForm}">
          <div *ngIf="showForm" class="form-container">
            <form class="form-body" [formGroup]="addRowForm">
              <div class="form-row">
                <label for="startDate">Data początku</label>
                <input type="text"
                       (change)="updateValidationForDates()"
                       placeholder="wpisz początkową datę"
                       class="form-control"
                       formControlName="startDate"
                       id="startDate">
              </div>
              <div class="validation-error form-row"
                   *ngIf="formLeaveStartDate.errors?.required && formLeaveStartDate.touched">
                Pole nie może być puste
              </div>
              <div class="validation-error form-row"
                   *ngIf="addRowForm.get('startDate').hasError('badDataFormat')">
                Wpisz poprawną datę w formacie yyyy-mm-dd
              </div>
              <div class="validation-error form-row"
                   *ngIf="addRowForm.get('startDate').hasError('forbiddenStartDate')">
                Data urlopu dla tego pracownika już zajęta/ wizyta z pacjentem w tym terminie
              </div>
              <div class="form-row">
                <label for="endDate">Data końca</label>
                <input type="text"
                       (change)="updateValidationForDates()"
                       placeholder="wpisz datę końca"
                       class="form-control"
                       formControlName="endDate"
                       id="endDate">
              </div>
              <div class="validation-error form-row"
                   *ngIf="formLeaveEndDate.errors?.required && formLeaveEndDate.touched">
                Pole nie może być puste
              </div>
              <div class="validation-error form-row" *ngIf="addRowForm.get('endDate').hasError('badDataFormat')">
                Wpisz poprawną datę w formacie yyyy-mm-dd
              </div>
              <div class="validation-error form-row"
                   *ngIf="addRowForm.get('endDate').hasError('forbiddenEndDate')">
                Niepoprawna data (urlop wziety/wizyta z pacjentem w tym terminie lub mniejsza od daty początkowej)
              </div>
              <div class="form-row">
                <label for="employeeId">Id pracownika</label>
                <select id="employeeId" class="select-field" (change)="changeEmployeeId($event)"
                        formControlName="employeeId">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz pracownika
                  </option>
                  <option *ngFor="let employeeId of employeeIds"
                          [ngValue]="employeeId">{{employeeId}}</option>
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
      </div>
    </div>
  `,
  styleUrls: ['./leaves-of-absence.component.scss']
})
export class LeavesOfAbsenceComponent implements OnInit {
  loading: boolean = true;
  showForm: boolean = false;
  formRowId: number = -1;
  employeeIds: string[];
  addRowForm: FormGroup;
  listContent: ListContent;
  editedStartDate: string = '';
  editedEndDate: string = '';
  editedEmployee: string = '';
  leavesOfAbsence: LeaveOfAbsence [];
  appointments: Appointment [];
  simpleDoctors: SimpleDoctor [];

  constructor(private leavesOfAbsenceService: LeavesOfAbsenceService,
              private appointmentsService: AppointmentsService,
              private doctorsService: DoctorsService,
              private employeesService: EmployeesService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadLeavesOfAbsence();
    this.leavesOfAbsenceService.loadLeavesOfAbsenceSubject.subscribe(() => {
      this.loadLeavesOfAbsence();
    });
  }

  get formLeaveStartDate() {
    return this.addRowForm.get('startDate');
  }

  get formLeaveEndDate() {
    return this.addRowForm.get('endDate');
  }

  changeEmployeeId(event): void {
    this.addRowForm.patchValue({
      'employeeId': event.target.value
    });
    this.addRowForm.get('startDate').updateValueAndValidity();
    this.addRowForm.get('endDate').updateValueAndValidity();
  }

  updateValidationForDates(): void {
    this.addRowForm.get('startDate').updateValueAndValidity();
    this.addRowForm.get('endDate').updateValueAndValidity();
  }

  private loadLeavesOfAbsence() {
    this.loading = true;
    this.leavesOfAbsenceService.getLeavesOfAbsence().subscribe(leaves => {
      this.leavesOfAbsence = leaves.map(leave => ({
        ...leave,
        startDate: new Date(leave.startDate).toISOString().substring(0, 10),
        endDate: new Date(leave.endDate).toISOString().substring(0, 10)
      }));
      this.loadListContent();
      this.loadFormData();
    })
  }

  private loadFormData() {
    this.loading = true;
    this.employeesService.getEmployees().subscribe(employees => {
      this.employeeIds = (employees as Employee []).map(employee => String(employee.id));
      this.appointmentsService.getAppointments().subscribe(appointments => {
        this.appointments = appointments.map(appointment => ({
          ...appointment,
          startDate: new Date(appointment.startDate).toISOString().substring(0, 10).replace('T', ' '),
          endDate: new Date(appointment.endDate).toISOString().substring(0, 10).replace('T', ' ')
        }));
        this.doctorsService.getDoctors().subscribe(doctors => {
          this.simpleDoctors = doctors.map(doctor => ({
            doctorId: doctor.id,
            employeeId: doctor.employeeId
          }));
          this.loading = false;
        });
      });
    });
  }

  setupForm(): void {
    this.addRowForm = new FormGroup({
      'startDate': new FormControl('', [
        Validators.required,
        this.forbiddenDateFormat.bind(this),
        this.forbiddenStartDate.bind(this)
      ]),
      'endDate': new FormControl('', [
        Validators.required,
        this.forbiddenDateFormat.bind(this),
        this.forbiddenEndDate.bind(this)
      ]),
      'employeeId': new FormControl('', Validators.required)
    });
  }

  isValidDate(dateString: string): boolean {
    let dateRegEx = new RegExp('^\\d{4}-\\d{2}-\\d{2}$');
    if (!dateString.match(dateRegEx)) return false;
    let d = new Date(dateString);
    let dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  }

  forbiddenDateFormat(control: FormControl): { [s: string]: boolean } {
    if (!this.isValidDate(String(control.value))) {
      return {'badDataFormat': true};
    }
    return null;
  }

  forbiddenStartDate(control: FormControl): { [s: string]: boolean } {
    let error: boolean = false;
    if (this.addRowForm) {
      if (this.addRowForm.value['employeeId']) {
        let employeeId: string = String(this.addRowForm.value['employeeId']).split(" ").slice(-1)[0];
        let dateString: string = String(control.value);
        if (this.isValidDate(dateString)) {
          let formStartDate = new Date(dateString);
          if (this.formRowId > -1) {
            let editedStartDate = new Date(this.editedStartDate);
            let editedEndDate = new Date(this.editedEndDate);
            if (editedStartDate <= formStartDate && formStartDate <= editedEndDate) {
              if (employeeId === this.editedEmployee) {
                return null;
              }
            }
          }
          this.leavesOfAbsence.filter(leave => leave.employeeId == employeeId)
            .forEach(leave => {
              let leaveStartDate = new Date(leave.startDate);
              let leaveEndDate = new Date(leave.endDate);
              if (leaveStartDate <= formStartDate && formStartDate <= leaveEndDate) {
                error = true;
              }
            });
          let doctorId: number = this.simpleDoctors.filter(doctor => doctor.employeeId === +employeeId).map(doctor => doctor.doctorId)[0];
          this.appointments.forEach(appointment => {
            if (+appointment.doctorId === doctorId) {
              let appointmentStartDate = new Date(appointment.startDate);
              let appointmentEndDate = new Date(appointment.endDate);
              if (appointmentStartDate <= formStartDate && formStartDate <= appointmentEndDate) {
                console.log("tutaj");
                error = true;
              }
            }
          });
        }
      }
    }
    if (error) {
      return {'forbiddenStartDate': true};
    }
    return null;
  }

  forbiddenEndDate(control: FormControl): { [s: string]: boolean } {
    let error: boolean = false;
    if (this.addRowForm) {
      let dateString: string = String(control.value);
      if (this.isValidDate(dateString)) {
        let formEndDate = new Date(dateString);
        if (this.addRowForm.value['startDate']) {
          let formStartDate = new Date(this.addRowForm.value['startDate']);
          if (formEndDate < formStartDate) {
            error = true;
          }
        }
      }
      if (this.addRowForm.value['employeeId']) {
        let employeeId: string = String(this.addRowForm.value['employeeId']).split(" ").slice(-1)[0];
        let dateString: string = String(control.value);
        if (this.isValidDate(dateString)) {
          let formEndDate = new Date(dateString);
          if (this.addRowForm.value['startDate']) {
            let formStartDate = new Date(this.addRowForm.value['startDate']);
            if (formEndDate < formStartDate) {
              error = true;
            }
          }
          if (this.formRowId > -1) {
            let editedStartDate = new Date(this.editedStartDate);
            let editedEndDate = new Date(this.editedEndDate);
            if (editedStartDate <= formEndDate && formEndDate <= editedEndDate) {
              if (!error) {
                if (employeeId === this.editedEmployee) {
                  return null;
                }
              }
            }
          }
          this.leavesOfAbsence.filter(leave => leave.employeeId == employeeId).forEach(leave => {
            let leaveStartDate = new Date(leave.startDate);
            let leaveEndDate = new Date(leave.endDate);
            if (leaveStartDate <= formEndDate && formEndDate <= leaveEndDate) {
              error = true;
            }
            let formStartDate = new Date(this.addRowForm.value['startDate']);
            if (formStartDate < leaveStartDate && formEndDate >= leaveStartDate) {
              error = true;
            }
          });
          let doctorId: number = this.simpleDoctors.filter(doctor => doctor.employeeId === +employeeId).map(doctor => doctor.doctorId)[0];
          this.appointments.forEach(appointment => {
            if (+appointment.doctorId === doctorId) {
              let appointmentStartDate = new Date(appointment.startDate);
              let appointmentEndDate = new Date(appointment.endDate);
              if (appointmentStartDate <= formEndDate && formEndDate <= appointmentEndDate) {
                error = true;
              }
              let formStartDate = new Date(this.addRowForm.value['startDate']);
              if (formStartDate < appointmentStartDate && formEndDate >= appointmentStartDate) {
                error = true;
              }
            }
          });
        }
      }
    }
    if (error) {
      return {'forbiddenEndDate': true};
    }
    return null;
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id pracownika', 'imię', 'nazwisko', 'początek', 'koniec'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let leaveOfAbsence of this.leavesOfAbsence) {
      rows.push({
        row: [
          String(leaveOfAbsence.id),
          leaveOfAbsence.employeeId,
          leaveOfAbsence.name,
          leaveOfAbsence.surname,
          leaveOfAbsence.startDate,
          leaveOfAbsence.endDate
        ]
      })
    }
    return rows;
  }

  deleteLeaveOfAbsence(leaveOfAbsence: number): void {
    this.loading = true;
    this.leavesOfAbsenceService.deleteLeaveOfAbsence(leaveOfAbsence).subscribe(() => {
      this.loadLeavesOfAbsence();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.editedStartDate = this.leavesOfAbsence.filter(leave => leave.id === this.formRowId).map(leave => leave.startDate)[0];
      this.editedEndDate = this.leavesOfAbsence.filter(leave => leave.id === this.formRowId).map(leave => leave.endDate)[0];
      this.editedEmployee = String(this.leavesOfAbsence.filter(leave => leave.id === this.formRowId).map(leave => leave.employeeId)[0]);
      this.addRowForm.patchValue({
        'startDate': this.editedStartDate,
        'endDate': this.editedEndDate,
        'employeeId': this.editedEmployee
      });
      this.addRowForm.get('startDate').updateValueAndValidity();
      this.addRowForm.get('endDate').updateValueAndValidity();
    } else {
      this.addRowForm.reset();
    }
    this.showForm = true;
  }

  onClickAddOrUpdate(): void {
    if (this.addRowForm.valid) {
      this.loading = true;
      if (this.formRowId === -1) {
        this.leavesOfAbsenceService.insertLeaveOfAbsence({
          startDate: this.addRowForm.value['startDate'],
          endDate: this.addRowForm.value['endDate'],
          employeeId: this.addRowForm.value['employeeId'].split(" ").slice(-1)[0]
        } as LeaveOfAbsence).subscribe(() => {
          this.showForm = false;
          this.appointmentsService.loadAppointments();
          this.loadLeavesOfAbsence();
        });
      } else {
        this.leavesOfAbsenceService.updateLeaveOfAbsence({
          startDate: this.addRowForm.value['startDate'],
          endDate: this.addRowForm.value['endDate'],
          employeeId: this.addRowForm.value['employeeId'].split(" ").slice(-1)[0],
          id: this.formRowId
        } as LeaveOfAbsence).subscribe(() => {
          this.showForm = false;
          this.formRowId = -1;
          this.editedStartDate = '';
          this.editedEndDate = '';
          this.appointmentsService.loadAppointments();
          this.loadLeavesOfAbsence();
        });
      }
    }
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
