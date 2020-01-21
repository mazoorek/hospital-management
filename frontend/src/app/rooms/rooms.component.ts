import {Component, OnInit} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {RoomsService} from "./rooms.service";
import {Room} from "./room.model";
import {AppointmentsService} from "../appointments/appointments.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HospitalWardsService} from "../hospital-wards/hospital-wards.service";
import {HospitalWard} from "../hospital-wards/hospital-ward.model";

@Component({
  selector: 'rooms',
  template: `
    <div class="section-container">
      <h1 class="section-header">POKOJE</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item form-flex-item"
             [ngClass]="{'collapsed': !showForm}">
          <div *ngIf="showForm" class="form-container">
            <form class="form-body" [formGroup]="addRowForm">
              <div class="form-row">
                <label for="roomNumber">Numer pokoju</label>
                <input type="text"
                       placeholder="wpisz numer pokoju"
                       class="form-control"
                       formControlName="roomNumber"
                       id="roomNumber">
              </div>
              <div class="validation-error" *ngIf="addRowForm.get('roomNumber').hasError('numberIsForbidden')">
                Numer pokoju musi być unikatowy dla danego oddziału
              </div>
              <div class="validation-error" *ngIf="formRoomNumber.errors?.pattern">
                Pole musi zawierać cyfry
              </div>
              <div class="validation-error" *ngIf="formRoomNumber.errors?.required && formRoomNumber.touched">
                Pole nie może być puste
              </div>
              <div class="validation-error"
                   *ngIf="addRowForm.get('roomNumber').hasError('maxlength') && formRoomNumber.touched">
                Pole musi się składać z 9 cyfr
              </div>
              <div class="form-row">
                <label for="hospitalWardName">Nazwa oddziału</label>
                <select id="hospitalWardName" class="select-field" (change)="changeHospitalWard($event)"
                        formControlName="hospitalWardName">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz nazwę
                    oddziału
                  </option>
                  <option *ngFor="let hospitalWard of hospitalWards"
                          [ngValue]="hospitalWard">{{hospitalWard}}</option>
                </select>
              </div>
              <div class="validation-error" *ngIf="addRowForm.get('hospitalWardName').hasError('wardIsForbidden')">
                Numer pokoju musi być unikatowy dla danego oddziału
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
        <div class="flex-item list-flex-item">
          <list
            (addOrUpdateRowChange)="loadForm($event)"
            (selectedRowChange)="selectedRow=$event"
            (removeRowChange)="deleteRoom($event)"
            [listContent]="listContent"></list>
          <div class="selected-row-buttons-container" *ngIf="selectedRow>-1">
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowRoomAppointments()"
              text="wizyty w pokoju"></action-button>
          </div>
        </div>
      </div>
    </div>
    <div class="display-list" *ngIf="showRoomAppointments">
      <list [listContent]="appointmentListContent"
            (closeListChange)="closeRoomAppointments()"
            [editable]="false"></list>
    </div>
  `,
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  rooms: Room [];
  loading: boolean = true;
  showForm: boolean = false;
  showRoomAppointments = false;
  selectedRow: number = -1;
  formRowId: number = -1;
  editedRowRoomNumber: number = -1;
  editedRowWardName: string = '';
  hospitalWards: string[];
  addRowForm: FormGroup;
  listContent: ListContent;
  appointmentListContent: ListContent;


  constructor(private roomsService: RoomsService,
              private hospitalWardsService: HospitalWardsService,
              private appointmentsService: AppointmentsService) {
  }

  ngOnInit(): void {
    this.loadRooms();
    this.roomsService.loadRoomsSubject.subscribe(() => {
      this.loadRooms();
    });
  }

  get formRoomNumber() {
    return this.addRowForm.get('roomNumber');
  }

  changeHospitalWard(event): void {
    this.addRowForm.patchValue({
      'hospitalWardName': event.target.value
    });
    this.addRowForm.get('roomNumber').updateValueAndValidity();
  }

  forbiddenRoomNumber(control: FormControl): { [s: string]: boolean } {
    let error: boolean = false;
    let filterByRegex = new RegExp('^[A-Za-z\\s]+$');
    if (this.addRowForm && this.addRowForm.value['hospitalWardName']) {
        let wardName = this.addRowForm.value['hospitalWardName'].split(" ").filter(word => word.match(filterByRegex)).join(" ");
        if (this.formRowId === -1 || this.editedRowRoomNumber != control.value || this.editedRowWardName !== wardName) {
          this.rooms.filter(room => room.wardName === wardName).forEach(room => {
            if (room.number == control.value) {
              error = true;
            }
          });
        }
      if (error) {
        return {'numberIsForbidden': true};
      }
    }
    return null;
  }

  onShowRoomAppointments() {
    this.loading = true;
    this.roomsService.getRoomAppointments(this.selectedRow).subscribe(appointments => {
      appointments = appointments.map(appointment => ({
        ...appointment,
        startDate: new Date(appointment.startDate).toISOString().substring(0, 16).replace('T',' '),
        endDate: new Date(appointment.endDate).toISOString().substring(0, 16).replace('T',' ')
      }));
      let rows: Row[] = [];
      for (let appointment of appointments) {
        rows.push({
          row: [
            String(appointment.id),
            appointment.startDate,
            appointment.endDate,
            appointment.pesel,
            appointment.doctorId,
            appointment.appointmentType,
            appointment.operationType
          ]
        })
      }
      this.appointmentListContent = {
        columns: ['id', 'data początku', 'data końca', 'pesel', 'id lekarza', 'charakter wizyty', 'typ operacji'],
        rows: rows
      };
      this.loading = false;
      this.showRoomAppointments = true;
    });
  }

  closeRoomAppointments() {
    this.showRoomAppointments = false;
    this.selectedRow = -1;
  }

  setupForm(): void {
    this.addRowForm = new FormGroup({
      'roomNumber': new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.maxLength(9),
        this.forbiddenRoomNumber.bind(this),
      ]),
      'hospitalWardName': new FormControl('', [
        Validators.required,
      ])
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'numer', 'oddział'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let room of this.rooms) {
      rows.push({
        row: [
          String(room.id),
          String(room.number),
          room.wardName
        ]
      })
    }
    return rows;
  }

  loadRooms(): void {
    this.loading = true;
    this.roomsService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
      this.setupForm();
      this.loadListContent();
      this.loadFormData();
    });
  }

  private loadFormData() {
    this.loading = true;
    this.hospitalWardsService.getHospitalWards().subscribe(hospitalWards => {
      this.hospitalWards = (hospitalWards as HospitalWard []).map(hospitalWard => hospitalWard.name);
      this.loading = false;
    });
  }

  deleteRoom(roomId: number): void {
    this.loading = true;
    this.roomsService.deleteRoom(roomId).subscribe(() => {
      this.loadSelfAndDependentTables();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.editedRowRoomNumber = this.rooms.filter(room => room.id === this.formRowId).map(room => room.number)[0];
      this.editedRowWardName = this.rooms.filter(room => room.id === this.formRowId).map(room => room.wardName)[0];
      this.addRowForm.patchValue({
        'roomNumber': this.editedRowRoomNumber,
        'hospitalWardName': this.editedRowWardName
      });
    } else {
      this.addRowForm.reset();
    }
    this.showForm = true;
  }

  onClickAddOrUpdate(): void {
    if (this.addRowForm.valid) {
      this.loading = true;
      let filterByRegex = new RegExp('^[A-Za-z\\s]+$');
      if (this.formRowId === -1) {
        this.roomsService.insertRoom({
          number: this.addRowForm.value['roomNumber'],
          wardName: this.addRowForm.value['hospitalWardName'].split(" ").filter(word => word.match(filterByRegex)).join(" ")
        } as Room).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.roomsService.updateRoom({
          number: this.addRowForm.value['roomNumber'],
          wardName: this.addRowForm.value['hospitalWardName'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
          id: this.formRowId
        } as Room).subscribe(() => {
          this.showForm = false;
          this.formRowId = -1;
          this.editedRowWardName = '';
          this.editedRowRoomNumber = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.loadRooms();
    this.appointmentsService.loadAppointments();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
