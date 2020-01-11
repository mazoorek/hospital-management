import {Component, OnInit} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {AppointmentsService} from "./appointments.service";
import {Appointment} from "./appointment.model";
import {PatientsService} from "../patients/patients.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Patient} from "../patients/patients.model";
import {DoctorsService} from "../doctors/doctors.service";
import {RoomsService} from "../rooms/rooms.service";
import {AppointmentTypesService} from "../appointment-types/appointment-types.service";
import {OperationTypesService} from "../operation-types/operation-types.service";
import {Doctor} from "../doctors/doctor.model";
import {Room} from "../rooms/room.model";
import {AppointmentType} from "../appointment-types/appointment-types.model";
import {OperationType} from "../operation-types/operation-types.model";

export interface SimplifiedDoctor {
  doctorId: number;
  specializationName: string;
  wardName: string;
}

export interface SimplifiedAppointmentType {
  appointmentType: string;
  specializationName: string;
}

export interface SimplifiedRoom {
  roomId: number;
  wardName: string;
}

@Component({
  selector: 'appointments',
  template: `
    <div class="section-container">
      <h1 class="section-header">WIZYTY</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item list-flex-item">
          <list
            (addOrUpdateRowChange)="loadForm($event)"
            (removeRowChange)="deleteAppointment($event)"
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
                Wpisz poprawną datę w formacie 'yyyy-mm-dd hh:mm'
              </div>
              <div class="validation-error form-row"
                   *ngIf="addRowForm.get('startDate').hasError('forbiddenStartDate')">
                Data urlopu dla tego pracownika już zajęta
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
                Wpisz poprawną datę w formacie 'yyyy-mm-dd hh:mm'
              </div>
              <div class="validation-error form-row"
                   *ngIf="addRowForm.get('endDate').hasError('forbiddenEndDate')">
                Niepoprawna data (zajęta lub mniejsza lub równa dacie początkowej)
              </div>
              <div class="form-row">
                <label for="pesel">Id pacjenta</label>
                <select id="pesel" class="select-field" (change)="changePesel($event)"
                        formControlName="pesel">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz pacjenta
                  </option>
                  <option *ngFor="let pesel of pesels"
                          [ngValue]="pesel">{{pesel}}</option>
                </select>
              </div>
              <div class="form-row">
                <label for="appointmentType">Typ wizyty</label>
                <select id="appointmentType" class="select-field" (change)="changeAppointmentType($event)"
                        formControlName="appointmentType">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz typ wizyty
                  </option>
                  <option *ngFor="let appointmentType of simplifiedAppointmentTypes"
                          [ngValue]="appointmentType.appointmentType">{{appointmentType.appointmentType}}</option>
                </select>
              </div>
              <div class="form-row" *ngIf="addRowForm.get('appointmentType').value=='operacja'">
                <label for="operationType">Typ operacji</label>
                <select id="operationType" class="select-field" (change)="changeOperationType($event)"
                        formControlName="operationType">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz typ operacji
                  </option>
                  <option *ngFor="let operationType of operationTypes"
                          [ngValue]="operationType">{{operationType}}</option>
                </select>
              </div>
              <div class="form-row" *ngIf="shouldShowDoctors()">
                <label for="doctorId">Id lekarza</label>
                <select id="doctorId" class="select-field"
                        *ngIf="getFilteredDoctors().length>0"
                        (change)="changeDoctorId($event)"
                        formControlName="doctorId">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz lekarza
                  </option>
                  <option *ngFor="let doctor of getFilteredDoctors()"
                          [ngValue]="doctor">{{doctor}}</option>
                </select>
                <p *ngIf="getFilteredDoctors().length==0">
                  Brak wolnych lekarzy w tym terminie/ dla tej specjalizacji
                </p>
              </div>
              <div class="form-row" *ngIf="shouldShowRooms()">
                <label for="roomId">Id pokoju</label>
                <select id="roomId"
                        class="select-field"
                        *ngIf="getFilteredRooms().length>0"
                        (change)="changeRoomId($event)"
                        formControlName="roomId">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz pokój
                  </option>
                  <option *ngFor="let room of getFilteredRooms()"
                          [ngValue]="room">{{room}}</option>
                </select>
                <p *ngIf="getFilteredRooms().length==0">
                  Brak wolnych pokoi w tym terminie/ dla tego oddziału
                </p>
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
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  loading: boolean = true;
  showForm: boolean = false;
  formRowId: number = -1;
  pesels: string[];
  simplifiedDoctors: SimplifiedDoctor[];
  simplifiedRooms: SimplifiedRoom[];
  simplifiedAppointmentTypes: SimplifiedAppointmentType[];
  operationTypes: string[];
  addRowForm: FormGroup;
  listContent: ListContent;
  editedRow: Appointment;
  appointments: Appointment [];

  constructor(private appointmentsService: AppointmentsService,
              private doctorsService: DoctorsService,
              private roomsService: RoomsService,
              private appointmentTypesService: AppointmentTypesService,
              private operationTypesService: OperationTypesService,
              private patientsService: PatientsService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadAppointments();
    this.appointmentsService.loadAppointmentsSubject.subscribe(() => {
      this.loadAppointments();
    });
  }

  get formLeaveStartDate() {
    return this.addRowForm.get('startDate');
  }

  get formLeaveEndDate() {
    return this.addRowForm.get('endDate');
  }

  changePesel(event): void {
    this.addRowForm.patchValue({
      'pesel': event.target.value
    });
    this.addRowForm.get('startDate').updateValueAndValidity();
    this.addRowForm.get('endDate').updateValueAndValidity();
  }

  changeAppointmentType(event): void {

  }

  changeOperationType(event): void {

  }

  changeDoctorId(event): void {

  }

  changeRoomId(event): void {

  }

  shouldShowDoctors(): boolean {
    return this.addRowForm.get('appointmentType').value && this.addRowForm.get('startDate').valid
      && this.addRowForm.get('endDate').valid;
  }

  getFilteredDoctors(): number [] {
    let specialization: string = this.simplifiedAppointmentTypes
      .filter(appointmentType => appointmentType.appointmentType == this.addRowForm.get('appointmentType').value)
      .map(appointmentType => appointmentType.specializationName)[0];
    let startDate = new Date(this.addRowForm.get('startDate').value);
    let endDate = new Date(this.addRowForm.get('endDate').value);
    return this.simplifiedDoctors
      .filter(doctor => doctor.specializationName === specialization)
      .map(doctor => doctor.doctorId)
      .filter(doctor => {
        let free = true;
        this.appointments.forEach(appointment => {
          if(+appointment.doctorId === doctor) {
            let appointmentStartDate = new Date(appointment.startDate);
            let appointmentEndDate = new Date(appointment.endDate);
            if(startDate <= appointmentEndDate) {
              if(startDate >= appointmentStartDate && startDate <= appointmentEndDate) free = false;
              else if(endDate >= appointmentStartDate && endDate <= appointmentEndDate) free = false;
              else if(startDate <appointmentStartDate && endDate > appointmentEndDate) free = false;
            }
          }
        });
        return free;
      });
  }

  shouldShowRooms(): boolean {
    return this.addRowForm.get('doctorId').value && this.addRowForm.get('appointmentType').value
      && this.addRowForm.get('startDate').valid && this.addRowForm.get('endDate').valid;
  }

  getFilteredRooms(): number [] {
    let wardName: string = this.simplifiedDoctors
      .filter(doctor => doctor.doctorId == this.addRowForm.get('doctorId').value)
      .map(doctor => doctor.wardName)[0];
    let startDate = new Date(this.addRowForm.get('startDate').value);
    let endDate = new Date(this.addRowForm.get('endDate').value);
    return this.simplifiedRooms
      .filter(room => room.wardName === wardName)
      .map(room => room.roomId)
      .filter(room => {
        let free = true;
        this.appointments.forEach(appointment => {
          if(+appointment.roomId === room) {
            let appointmentStartDate = new Date(appointment.startDate);
            let appointmentEndDate = new Date(appointment.endDate);
            if(startDate <= appointmentEndDate) {
              if(startDate >= appointmentStartDate && startDate <= appointmentEndDate) free = false;
              else if(endDate >= appointmentStartDate && endDate <= appointmentEndDate) free = false;
              else if(startDate <appointmentStartDate && endDate > appointmentEndDate) free = false;
            }
          }
        });
        return free;
      });
  }

  updateValidationForDates(): void {
    this.addRowForm.get('startDate').updateValueAndValidity();
    this.addRowForm.get('endDate').updateValueAndValidity();
  }

  private loadAppointments() {
    this.loading = true;
    this.appointmentsService.getAppointments().subscribe(appointments => {
      this.appointments = appointments.map(appointment => ({
        ...appointment,
        startDate: new Date(appointment.startDate).toISOString().substring(0, 16).replace('T',' '),
        endDate: new Date(appointment.endDate).toISOString().substring(0, 16).replace('T',' ')
      }));
      this.loadListContent();
      this.loadFormData();
    })
  }

  private loadFormData() {
    this.loading = true;
    this.patientsService.getPatients().subscribe(patients => {
      this.pesels = (patients as Patient []).map(patient => String(patient.pesel));
      this.doctorsService.getDoctors().subscribe(doctors => {
        this.simplifiedDoctors = (doctors as Doctor []).map(doctor => ({
          doctorId: doctor.id,
          specializationName: doctor.specializationName,
          wardName: doctor.wardName
        }));
        this.roomsService.getRooms().subscribe(rooms => {
          this.simplifiedRooms = (rooms as Room []).map(room => ({
            roomId: room.id,
            wardName: room.wardName
          }));
          this.appointmentTypesService.getAppointmentTypes().subscribe(appointmentTypes => {
            this.simplifiedAppointmentTypes = (appointmentTypes as AppointmentType []).map(appointmentType => ({
              appointmentType: appointmentType.type,
              specializationName: appointmentType.specializationName
            }));
            this.operationTypesService.getOperationTypes().subscribe(operationTypes => {
              this.operationTypes = (operationTypes as OperationType []).map(operationType => operationType.type);
              this.loading = false;
            })
          })
        })
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
      'pesel': new FormControl('', Validators.required),
      'doctorId': new FormControl('', Validators.required),
      'roomId': new FormControl('', Validators.required),
      'appointmentType': new FormControl('', Validators.required),
      'operationType': new FormControl('')
    });
  }

  isValidDate(dateString: string): boolean {
    let dateRegEx = new RegExp('^\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}$');
    if (!dateString.match(dateRegEx)) return false;
    let d = new Date(dateString.substring(0, 10));
    let dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    let hour = dateString.substring(11, 13);
    let minute = dateString.substring(14, 16);
    if (isNaN(+hour) || isNaN(+minute)) return false;
    if (+hour < 0 || +hour > 23 || +minute < 0 || +minute > 23) return false;
    return d.toISOString().slice(0, 10) === dateString.substring(0, 10); // lata przestępne
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
      if (this.addRowForm.value['pesel']) {
        let pesel: string = String(this.addRowForm.value['pesel']).split(" ").slice(-1)[0];
        let dateString: string = String(control.value);
        if (this.isValidDate(dateString)) {
          let formStartDate = new Date(dateString);
          if (this.formRowId > -1) {
            let editedStartDate = new Date(this.editedRow.startDate);
            let editedEndDate = new Date(this.editedRow.endDate);
            if (editedStartDate <= formStartDate && formStartDate <= editedEndDate) {
              if (pesel === this.editedRow.pesel) {
                return null;
              }
            }
          }
          this.appointments.filter(appointment => appointment.pesel == pesel)
            .forEach(leave => {
              let leaveStartDate = new Date(leave.startDate);
              let leaveEndDate = new Date(leave.endDate);
              if (leaveStartDate <= formStartDate && formStartDate <= leaveEndDate) {
                error = true;
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
          if (formEndDate <= formStartDate) {
            error = true;
          }
        }
      }
      if (this.addRowForm.value['pesel']) {
        let pesel: string = String(this.addRowForm.value['pesel']).split(" ").slice(-1)[0];
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
            let editedStartDate = new Date(this.editedRow.startDate);
            let editedEndDate = new Date(this.editedRow.endDate);
            if (editedStartDate <= formEndDate && formEndDate <= editedEndDate) {
              if (!error) {
                if (pesel === this.editedRow.pesel) {
                  return null;
                }
              }
            }
          }
          this.appointments.filter(appointment => appointment.pesel == pesel)
            .forEach(appointment => {
              let appointmentStartDate = new Date(appointment.startDate);
              let appointmentEndDate = new Date(appointment.endDate);
              if (appointmentStartDate <= formEndDate && formEndDate <= appointmentEndDate) {
                error = true;
              }
              let formStartDate = new Date(this.addRowForm.value['startDate']);
              if (formStartDate < appointmentStartDate && formEndDate >= appointmentStartDate) {
                error = true;
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
      columns: ['id', 'data początku', 'data końca', 'id pokoju', 'pesel', 'id lekarza', 'charakter', 'typ operacji'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let appointment of this.appointments) {
      rows.push({
        row: [
          String(appointment.id),
          appointment.startDate,
          appointment.endDate,
          appointment.roomId,
          appointment.pesel,
          appointment.doctorId,
          appointment.appointmentType,
          appointment.operationType ? appointment.operationType : '',
        ]
      })
    }
    return rows;
  }

  deleteAppointment(appointmentId: number): void {
    this.loading = true;
    this.appointmentsService.deleteAppointment(appointmentId).subscribe(() => {
      this.loadAppointments();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.editedRow = this.appointments.filter(appointment => appointment.id === this.formRowId)[0];
      this.addRowForm.patchValue({
        'startDate': this.editedRow.startDate,
        'endDate': this.editedRow.endDate,
        'pesel': this.editedRow.pesel,
        'doctorId': this.editedRow.doctorId,
        'roomId': this.editedRow.roomId,
        'appointmentType': this.editedRow.appointmentType,
        'operationType': this.editedRow.operationType,
      });
    } else {
      this.addRowForm.reset();
    }
    this.showForm = true;
  }

  onClickAddOrUpdate(): void {
    if (this.addRowForm.valid) {
      this.loading = true;
      if (this.formRowId === -1) {
        this.appointmentsService.insertAppointment({
          startDate: String(this.addRowForm.value['startDate']).replace(' ','T')+':00.000Z',
          endDate: String(this.addRowForm.value['endDate']).replace(' ','T')+':00.000Z',
          pesel: this.addRowForm.value['pesel'].split(" ").slice(-1)[0],
          doctorId: String(this.addRowForm.value['doctorId']).split(" ").slice(-1)[0],
          roomId: String(this.addRowForm.value['roomId']).split(" ").slice(-1)[0],
          appointmentType: this.addRowForm.value['appointmentType'].split(" ").slice(-1)[0],
          operationType: this.addRowForm.value['operationType'] ? this.addRowForm.value['operationType'].split(" ").slice(-1)[0]: ''
        } as Appointment).subscribe(() => {
          this.showForm = false;
          this.loadAppointments();
        });
      } else {
        this.appointmentsService.updateAppointment({
          startDate: String(this.addRowForm.value['startDate']).replace(' ','T')+':00.000Z',
          endDate: String(this.addRowForm.value['endDate']).replace(' ','T')+':00.000Z',
          pesel: this.addRowForm.value['pesel'].split(" ").slice(-1)[0],
          doctorId: String(this.addRowForm.value['doctorId']).split(" ").slice(-1)[0],
          roomId: String(this.addRowForm.value['roomId']).split(" ").slice(-1)[0],
          appointmentType: this.addRowForm.value['appointmentType'].split(" ").slice(-1)[0],
          operationType: this.addRowForm.value['operationType'] ? this.addRowForm.value['operationType'].split(" ").slice(-1)[0]: '',
          id: this.formRowId
        } as Appointment).subscribe(() => {
          this.showForm = false;
          this.formRowId = -1;
          this.loadAppointments();
        });
      }
    }
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
