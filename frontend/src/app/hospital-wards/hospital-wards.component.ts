import {Component, OnInit} from "@angular/core";
import {HospitalWardsService} from "./hospital-wards.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {HospitalWard} from "./hospital-ward.model";
import {RoomsService} from "../rooms/rooms.service";
import {DoctorsService} from "../doctors/doctors.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'hospital-wards',
  template: `
    <div class="section-container">
      <h1 class="section-header">ODDZIAŁY</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item form-flex-item"
             [ngClass]="{'collapsed': !showForm}">
          <div *ngIf="showForm" class="form-container">
            <form class="form-body" [formGroup]="addRowForm">
              <div class="form-row">
                <label for="hospitalWardName">Nazwa Oddziału</label>
                <input type="text"
                       placeholder="wpisz nazwę oddziału"
                       class="form-control"
                       formControlName="name"
                       id="hospitalWardName">
              </div>
              <div class="validation-error" *ngIf="formHospitalWardName.errors?.pattern">
                Pole może zawierać małe/duże litery oraz znaki spacji
              </div>
              <div class="validation-error"
                   *ngIf="formHospitalWardName.errors?.required && formHospitalWardName.touched">
                Pole nie może być puste
              </div>
              <div class="validation-error"
                   *ngIf="addRowForm.get('name').hasError('forbiddenName')">
                Nazwa oddziału jest już zajęta
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
            [showIdColumn]="false"
            (removeRowChange)="deleteHospitalWard($event)"
            (selectedRowChange)="selectedRow=$event"
            [listContent]="listContent"></list>
          <div class="selected-row-buttons-container" *ngIf="selectedRow>-1">
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowWardAppointments()"
              text="wizyty oddziału"></action-button>
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowWardRooms()"
              text="pokoje oddziału"></action-button>
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowWardDoctors()"
              text="lekarze oddziału"></action-button>
          </div>
        </div>
      </div>
    </div>
    <div class="display-list" *ngIf="showWardAppointments">
      <list [listContent]="appointmentsListContent"
            (closeListChange)="closeWardAppointments()"
            [editable]="false"></list>
    </div>
    <div class="display-list" *ngIf="showWardRooms">
      <list [listContent]="roomsListContent"
            (closeListChange)="closeWardRooms()"
            [editable]="false"></list>
    </div>
    <div class="display-list" *ngIf="showWardDoctors">
      <list [listContent]="doctorsListContent"
            (closeListChange)="closeWardDoctors()"
            [editable]="false"></list>
    </div>
  `,
  styleUrls: ['./hospital-wards.component.scss']
})
export class HospitalWardsComponent implements OnInit {
  hospitalWards: HospitalWard[];
  editedHospitalWardName: string;
  loading: boolean = true;
  showForm: boolean = false;
  showWardAppointments = false;
  showWardRooms = false;
  showWardDoctors = false;
  formRowId: number = -1;
  selectedRow: number = -1;
  addRowForm: FormGroup;
  listContent: ListContent;
  appointmentsListContent: ListContent;
  roomsListContent: ListContent;
  doctorsListContent: ListContent;

  constructor(private hospitalWardsService: HospitalWardsService,
              private roomsService: RoomsService,
              private doctorsService: DoctorsService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadHospitalWards();
    this.hospitalWardsService.loadHospitalWardsSubject.subscribe(() => {
      this.loadHospitalWards();
    });
  }

  closeWardAppointments() {
    this.showWardAppointments = false;
    this.selectedRow = -1;
  }

  closeWardRooms() {
    this.showWardRooms = false;
    this.selectedRow = -1;
  }
  closeWardDoctors() {
    this.showWardDoctors = false;
    this.selectedRow = -1;
  }

  onShowWardAppointments(): void {
    this.loading = true;
    this.hospitalWardsService.getHospitalWardAppointments(this.selectedRow).subscribe(appointments => {
      appointments = appointments.map(appointment => ({
        ...appointment,
        startDate: new Date(appointment.startDate).toISOString().substring(0, 16).replace('T',' '),
        endDate: new Date(appointment.endDate).toISOString().substring(0, 16).replace('T',' ')
      }));
      let rows: Row[] = [];
      for (let appointment of appointments) {
        rows.push({
          row: [
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
      this.appointmentsListContent = {
        columns: ['data początku', 'data końca', 'id pokoju', 'pesel', 'id lekarza', 'charakter wizyty', 'typ operacji'],
        rows: rows
      };
      this.loading = false;
      this.showWardAppointments = true;
    });
  }

  onShowWardRooms(): void {
    this.loading = true;
    this.hospitalWardsService.getHospitalWardRooms(this.selectedRow).subscribe(rooms => {
      let rows: Row[] = [];
      for (let room of rooms) {
        rows.push({
          row: [
            String(room.number),
          ]
        })
      }
      this.roomsListContent = {
        columns: ['numer pokoju'],
        rows: rows
      };
      this.loading = false;
      this.showWardRooms = true;
    });
  }

  onShowWardDoctors() {
    this.loading = true;
    this.hospitalWardsService.getHospitalWardDoctors(this.selectedRow).subscribe(doctors => {
      let rows: Row[] = [];
      for (let doctor of doctors) {
        rows.push({
          row: [
            String(doctor.id),
            doctor.name,
            doctor.surname,
            String(doctor.employeeId),
            doctor.specializationName
          ]
        })
      }
      this.doctorsListContent = {
        columns: ['id', 'imię', 'nazwisko', 'id pracownika', 'specjalizacja'],
        rows: rows
      };
      this.loading = false;
      this.showWardDoctors = true;
    });
  }

  get formHospitalWardName() {
    return this.addRowForm.get('name');
  }

  loadHospitalWards() {
    this.hospitalWardsService.getHospitalWards().subscribe(hospitalWards => {
      this.hospitalWards = hospitalWards;
      this.loadListContent();
      this.showForm = false;
      this.loading = false;
    });
  }

  setupForm(): void {
    this.addRowForm = new FormGroup({
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$'),
        this.forbiddenName.bind(this)
      ])
    });
  }

  forbiddenName(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      if (this.hospitalWards.filter(hospitalWard => (hospitalWard.name == control.value && hospitalWard.name !== this.editedHospitalWardName)).length) {
        return {'forbiddenName': true};
      }
    }
    return null;
  }


  loadListContent(): void {
    this.listContent = {
      columns: ['oddział'],
      rows: this.loadRows()
    };
  }


  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let hospitalWard of this.hospitalWards) {
      rows.push({
        row: [
          String(hospitalWard.id),
          hospitalWard.name,
        ]
      })
    }
    return rows;
  }

  deleteHospitalWard(wardId: number): void {
    this.loading = true;
    this.hospitalWardsService.deleteHospitalWard(wardId).subscribe(() => {
      this.loadSelfAndDependentTables();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.editedHospitalWardName = this.hospitalWards.filter(ward => ward.id === this.formRowId).map(ward => ward.name)[0];
      this.addRowForm.patchValue({
        'name': this.editedHospitalWardName
      })
    } else {
      this.addRowForm.reset();
    }
    this.showForm = true;
  }

  onClickAddOrUpdate(): void {
    if (this.addRowForm.valid) {
      this.loading = true;
      if (this.formRowId === -1) {
        this.hospitalWardsService.insertHospitalWard({
          name: this.addRowForm.value['name']
        } as HospitalWard).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.hospitalWardsService.updateHospitalWard({
          name: this.addRowForm.value['name'],
          id: this.formRowId
        } as HospitalWard).subscribe(() => {
          this.editedHospitalWardName = '';
          this.showForm = false;
          this.formRowId = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.loadHospitalWards();
    this.roomsService.loadRooms();
    this.doctorsService.loadDoctors();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
