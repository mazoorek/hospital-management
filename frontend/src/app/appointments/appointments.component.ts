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
import {LeaveOfAbsence} from "../leaves-of-absence/leave-of-absence.model";
import {LeavesOfAbsenceService} from "../leaves-of-absence/leaves-of-absence.service";

export interface SimplifiedDoctor {
  doctorId: number;
  employeeId: number;
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
            [showIdColumn]="false"
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
                       (change)="updateFormValidators()"
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
                Data dla tego pacjenta jest juz zajeta
              </div>
              <div class="form-row">
                <label for="endDate">Data końca</label>
                <input type="text"
                       (change)="updateFormValidators()"
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
                <label for="pesel">Pesel pacjenta</label>
                <select id="pesel" class="select-field" (change)="changePesel($event)"
                        formControlName="pesel">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz pacjenta
                  </option>
                  <option *ngFor="let pesel of pesels"
                          [ngValue]="pesel">{{pesel}}</option>
                </select>
              </div>
              <div class="form-row">
                <label for="appointmentType">Charakter wizyty</label>
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
                [disabled]="!canConfirmRecord()"
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
  leavesOfAbsence: LeaveOfAbsence [];
  operationTypes: string[];
  addRowForm: FormGroup;
  listContent: ListContent;
  editedRow: Appointment;
  appointments: Appointment [];
  selectedDoctor: string;
  selectedRoom: string;

  constructor(private appointmentsService: AppointmentsService,
              private doctorsService: DoctorsService,
              private roomsService: RoomsService,
              private appointmentTypesService: AppointmentTypesService,
              private operationTypesService: OperationTypesService,
              private leavesOfAbsenceService: LeavesOfAbsenceService,
              private patientsService: PatientsService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadAppointments();
    this.appointmentsService.loadAppointmentsSubject.subscribe(() => {
      this.loadAppointments();
    });
    this.resetEditedRow();
  }

  canConfirmRecord(): boolean {
    console.log(+this.selectedDoctor);
    return this.addRowForm.valid && this.addRowForm.get('appointmentType').value && this.addRowForm.get('doctorId').value
      && this.addRowForm.get('roomId').value && this.getFilteredDoctors().length > 0 && this.getFilteredRooms().length > 0
      && this.getFilteredDoctors().includes(+this.selectedDoctor) && this.getFilteredRooms().includes(+this.selectedRoom);
  }

  resetEditedRow(): void {
    this.editedRow = {
      id: -1,
      startDate: '',
      endDate: '',
      roomId: '-1',
      pesel: '',
      doctorId: '-1',
      appointmentType: '',
      operationType: '',
    }
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
    this.addRowForm.patchValue({
      'appointmentType': event.target.value
    });
    this.updateFormValidators();
  }

  changeOperationType(event): void {

  }

  changeDoctorId(event): void {
    this.selectedDoctor = String(event.target.value).split(" ").slice(-1)[0];
    console.log(this.selectedDoctor);
  }

  changeRoomId(event): void {
    this.selectedRoom = String(event.target.value).split(" ").slice(-1)[0];
  }

  shouldShowDoctors(): boolean {
    return this.addRowForm.get('appointmentType').value && this.addRowForm.get('startDate').valid
      && this.addRowForm.get('endDate').valid;
  }

  getFilteredDoctors(): number [] {
    let specialization: string = this.simplifiedAppointmentTypes
      .filter(appointmentType => appointmentType.appointmentType == String(this.addRowForm.value['appointmentType']).split(" ").filter(word => word.match('^[A-Za-z\\s]+$')).join(" "))
      .map(appointmentType => appointmentType.specializationName)[0];
    let startDate = new Date(this.addRowForm.get('startDate').value);
    let endDate = new Date(this.addRowForm.get('endDate').value);
    return this.simplifiedDoctors
      .filter(doctor => doctor.specializationName === specialization)
      .filter(doctor => {
        let free = true;
        if (doctor.doctorId !== +this.editedRow.doctorId) {
          this.leavesOfAbsence.forEach(leaveOfAbsence => {
            if(+leaveOfAbsence.employeeId === doctor.employeeId) {
              let leaveStartDate = new Date(leaveOfAbsence.startDate);
              let leaveEndDate = new Date(leaveOfAbsence.endDate);
              if (startDate <= leaveEndDate) {
                if (startDate >= leaveStartDate && startDate <= leaveEndDate) free = false;
                else if (endDate >= leaveStartDate && endDate <= leaveEndDate) free = false;
                else if (startDate < leaveStartDate && endDate > leaveEndDate) free = false;
              }
            }
          })
        }
        return free;
      })
      .map(doctor => doctor.doctorId)
      .filter(doctor => {
        let free = true;
        if (doctor !== +this.editedRow.doctorId) {
          this.appointments.forEach(appointment => {
            if (+appointment.doctorId === doctor) {
              let appointmentStartDate = new Date(appointment.startDate);
              let appointmentEndDate = new Date(appointment.endDate);
              if (startDate <= appointmentEndDate) {
                if (startDate >= appointmentStartDate && startDate <= appointmentEndDate) free = false;
                else if (endDate >= appointmentStartDate && endDate <= appointmentEndDate) free = false;
                else if (startDate < appointmentStartDate && endDate > appointmentEndDate) free = false;
              }
            }
          });
        } else {
          this.appointments.forEach(appointment => {
            if (appointment.id!==this.editedRow.id && appointment.doctorId === this.editedRow.doctorId) {
              let appointmentStartDate = new Date(appointment.startDate);
              let appointmentEndDate = new Date(appointment.endDate);
              if((appointmentStartDate.getDate() - startDate.getDate() !==0)  || (appointmentEndDate.getDate() - endDate.getDate() !== 0)) {
                if (startDate <= appointmentEndDate) {
                  if (startDate >= appointmentStartDate && startDate <= appointmentEndDate) free = false;
                  else if (endDate >= appointmentStartDate && endDate <= appointmentEndDate) free = false;
                  else if (startDate < appointmentStartDate && endDate > appointmentEndDate) free = false;
                }
              }
            }
          });
        }
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
        if (room !== +this.editedRow.roomId) {
          this.appointments.forEach(appointment => {
            if (+appointment.roomId === room) {
              let appointmentStartDate = new Date(appointment.startDate);
              let appointmentEndDate = new Date(appointment.endDate);
              if (startDate <= appointmentEndDate) {
                if (startDate >= appointmentStartDate && startDate <= appointmentEndDate) free = false;
                else if (endDate >= appointmentStartDate && endDate <= appointmentEndDate) free = false;
                else if (startDate < appointmentStartDate && endDate > appointmentEndDate) free = false;
              }
            }
          });
        } else {
          this.appointments.forEach(appointment => {
            if (appointment.id!==this.editedRow.id && appointment.roomId === this.editedRow.roomId) {
              let appointmentStartDate = new Date(appointment.startDate);
              let appointmentEndDate = new Date(appointment.endDate);
              if((appointmentStartDate.getDate() - startDate.getDate() !==0)  || (appointmentEndDate.getDate() - endDate.getDate() !== 0)) {
                if (startDate <= appointmentEndDate) {
                  if (startDate >= appointmentStartDate && startDate <= appointmentEndDate) free = false;
                  else if (endDate >= appointmentStartDate && endDate <= appointmentEndDate) free = false;
                  else if (startDate < appointmentStartDate && endDate > appointmentEndDate) free = false;
                }
              }
            }
          });
        }
        return free;
      });
  }

  private loadAppointments() {
    this.loading = true;
    this.appointmentsService.getAppointments().subscribe(appointments => {
      this.appointments = appointments.map(appointment => ({
        ...appointment,
        startDate: new Date(appointment.startDate).toISOString().substring(0, 16).replace('T', ' '),
        endDate: new Date(appointment.endDate).toISOString().substring(0, 16).replace('T', ' ')
      }));
      this.loadListContent();
      this.loadFormData();
    })
  }

  private loadFormData(): void {
    this.loading = true;
    this.patientsService.getPatients().subscribe(patients => {
      this.pesels = (patients as Patient []).map(patient => String(patient.pesel));
      this.doctorsService.getDoctors().subscribe(doctors => {
        this.simplifiedDoctors = (doctors as Doctor []).map(doctor => ({
          doctorId: doctor.id,
          specializationName: doctor.specializationName,
          wardName: doctor.wardName,
          employeeId: doctor.employeeId
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
              this.leavesOfAbsenceService.getLeavesOfAbsence().subscribe(leaves => {
                this.leavesOfAbsence = leaves;
                this.loading = false;
              })
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
    if (+hour < 0 || +hour > 23 || +minute < 0 || +minute > 59) return false;
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
            .forEach(appointment => {
              let leaveStartDate = new Date(appointment.startDate);
              let leaveEndDate = new Date(appointment.endDate);
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
      columns: ['data początku', 'data końca', 'id pokoju', 'pesel', 'id lekarza', 'charakter wizyty', 'typ operacji'],
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

  updateFormValidators(): void {
    this.addRowForm.get('startDate').updateValueAndValidity();
    this.addRowForm.get('endDate').updateValueAndValidity();
    this.addRowForm.get('pesel').updateValueAndValidity();
    this.addRowForm.get('doctorId').updateValueAndValidity();
    this.addRowForm.get('roomId').updateValueAndValidity();
    this.addRowForm.get('appointmentType').updateValueAndValidity();
    this.addRowForm.get('operationType').updateValueAndValidity();
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
      this.updateFormValidators();
      this.selectedDoctor = this.editedRow.doctorId;
      this.selectedRoom = this.editedRow.roomId;
    } else {
      this.addRowForm.reset();
    }
    this.showForm = true;
  }

  onClickAddOrUpdate(): void {
    if (this.canConfirmRecord()) {
      this.loading = true;
      if (this.formRowId === -1) {
        this.appointmentsService.insertAppointment({
          startDate: String(this.addRowForm.value['startDate']).replace(' ', 'T') + ':00.000Z',
          endDate: String(this.addRowForm.value['endDate']).replace(' ', 'T') + ':00.000Z',
          pesel: this.addRowForm.value['pesel'].split(" ").slice(-1)[0],
          doctorId: String(this.addRowForm.value['doctorId']).split(" ").slice(-1)[0],
          roomId: String(this.addRowForm.value['roomId']).split(" ").slice(-1)[0],
          appointmentType: String(this.addRowForm.value['appointmentType']).split(" ").filter(word => word.match('^[A-Za-z\\s]+$')).join(" "),
          operationType: this.addRowForm.value['operationType'] ? String(this.addRowForm.value['operationType']).split(" ").filter(word => word.match('^[A-Za-z\\s]+$')).join(" ") : ''
        } as Appointment).subscribe(() => {
          this.showForm = false;
          this.leavesOfAbsenceService.loadLeavesOfAbsence();
          this.loadAppointments();
        });
      } else {
        this.appointmentsService.updateAppointment({
          startDate: String(this.addRowForm.value['startDate']).replace(' ', 'T') + ':00.000Z',
          endDate: String(this.addRowForm.value['endDate']).replace(' ', 'T') + ':00.000Z',
          pesel: this.addRowForm.value['pesel'].split(" ").slice(-1)[0],
          doctorId: String(this.addRowForm.value['doctorId']).split(" ").slice(-1)[0],
          roomId: String(this.addRowForm.value['roomId']).split(" ").slice(-1)[0],
          appointmentType: String(this.addRowForm.value['appointmentType']).split(" ").filter(word => word.match('^[A-Za-z\\s]+$')).join(" "),
          operationType: this.addRowForm.value['operationType'] ? String(this.addRowForm.value['operationType']).split(" ").filter(word => word.match('^[A-Za-z\\s]+$')).join(" ") : '',
          id: this.formRowId
        } as Appointment).subscribe(() => {
          this.resetEditedRow();
          this.showForm = false;
          this.formRowId = -1;
          this.leavesOfAbsenceService.loadLeavesOfAbsence();
          this.loadAppointments();
        });
      }
    }
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
