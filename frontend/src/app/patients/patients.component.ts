import {Component, OnInit} from "@angular/core";
import {PatientsService} from "./patients.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Patient} from "./patients.model";
import {AppointmentsService} from "../appointments/appointments.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'patients',
  template: `
    <div class="section-container">
      <h1 class="section-header">PACJENCI</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item form-flex-item"
             [ngClass]="{'collapsed': !showForm}">
          <div *ngIf="showForm" class="form-container">
            <form class="form-body" [formGroup]="addRowForm">
              <div class="form-row">
                <label for="pesel">Pesel</label>
                <input type="text"
                       placeholder="wpisz pesel"
                       class="form-control"
                       formControlName="pesel"
                       id="pesel">
              </div>
              <div class="validation-error" *ngIf="formPesel.errors?.pattern">
                Pole może zawierać tylko cyfry z zakresu 0-9
              </div>
              <div class="validation-error"
                   *ngIf="(addRowForm.get('pesel').hasError('minlength') || addRowForm.get('pesel').hasError('maxlength')) && formPesel.touched">
                Pole musi się składać z 11 cyfr
              </div>
              <div class="validation-error"
                   *ngIf="formPesel.errors?.required && formPesel.touched">
                Pole nie może być puste
              </div>
              <div class="validation-error"
                   *ngIf="addRowForm.get('pesel').hasError('forbiddenPesel')">
                Pesel jest już zajęty
              </div>
              <div class="form-row">
                <label for="name">Imię</label>
                <input type="text"
                       placeholder="wpisz imię"
                       class="form-control"
                       formControlName="name"
                       id="name">
              </div>
              <div class="validation-error" *ngIf="formPatientName.errors?.pattern">
                Pole może zawierać małe/duże litery oraz znaki spacji
              </div>
              <div class="validation-error"
                   *ngIf="formPatientName.errors?.required && formPatientName.touched">
                Pole nie może być puste
              </div>
              <div class="form-row">
                <label for="surname">Nazwisko</label>
                <input type="text"
                       placeholder="wpisz pesel"
                       class="form-control"
                       formControlName="surname"
                       id="surname">
              </div>
              <div class="validation-error" *ngIf="formPatientSurname.errors?.pattern">
                Pole może zawierać małe/duże litery oraz znaki spacji
              </div>
              <div class="validation-error"
                   *ngIf="formPatientSurname.errors?.required && formPatientSurname.touched">
                Pole nie może być puste
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
            (selectedRowChange)="selectedRow=$event"
            (removeRowChange)="deletePatient($event)"
            [listContent]="listContent"></list>
          <div class="selected-row-buttons-container" *ngIf="selectedRow>-1">
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowPatientAppointments()"
              text="wizyty pacjenta"></action-button>
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowPatientDoctors()"
              text="lekarze pacjenta"></action-button>
          </div>
        </div>
      </div>
    </div>
    <div class="display-list" *ngIf="showPatientAppointments">
      <list [listContent]="appointmentListContent"
            (closeListChange)="closePatientAppointments()"
            [editable]="false"></list>
    </div>
    <div class="display-list" *ngIf="showPatientDoctors">
      <list [listContent]="doctorsListContent"
            (closeListChange)="closePatientDoctors()"
            [editable]="false"></list>
    </div>
  `,
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients: Patient [];
  editedPesel: string = '';
  loading: boolean = true;
  showForm: boolean = false;
  showPatientAppointments = false;
  showPatientDoctors = false;
  selectedRow: number = -1;
  formRowId: number = -1;
  addRowForm: FormGroup;
  listContent: ListContent;
  appointmentListContent: ListContent;
  doctorsListContent: ListContent;

  constructor(private patientsService: PatientsService,
              private appointmentsService: AppointmentsService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadPatients();
    this.patientsService.loadPatientsSubject.subscribe(() => {
      this.loadPatients();
    });
  }

  check() {

  }

  onShowPatientAppointments() {
    this.loading = true;
    this.patientsService.getPatientAppointments(this.selectedRow).subscribe(appointments => {
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
            appointment.doctorId,
            appointment.appointmentType,
            appointment.operationType ? appointment.operationType : '',
          ]
        })
      }
      this.appointmentListContent = {
        columns: ['data początku', 'data końca', 'id pokoju', 'id lekarza', 'charakter wizyty', 'typ operacji'],
        rows: rows
      };
      this.loading = false;
      this.showPatientAppointments = true;
    });
  }

  onShowPatientDoctors() {
    this.loading = true;
    this.patientsService.getPatientDoctors(this.selectedRow).subscribe(doctors => {
      let rows: Row[] = [];
      for (let doctor of doctors) {
        rows.push({
          row: [
            String(doctor.id),
            doctor.name,
            doctor.surname,
            String(doctor.employeeId),
            doctor.specializationName,
            doctor.wardName
          ]
        })
      }
      this.doctorsListContent = {
        columns: ['id', 'imię', 'nazwisko', 'id pracownika', 'specjalizacja', 'oddział'],
        rows: rows
      };
      this.loading = false;
      this.showPatientDoctors = true;
    });
  }

  closePatientAppointments() {
    this.showPatientAppointments = false;
    this.selectedRow = -1;
  }

  closePatientDoctors() {
    this.showPatientDoctors = false;
    this.selectedRow = -1;
  }

  get formPesel() {
    return this.addRowForm.get('pesel');
  }

  get formPatientName() {
    return this.addRowForm.get('name');
  }

  get formPatientSurname() {
    return this.addRowForm.get('surname');
  }

  private loadPatients() {
    this.loading = true;
    this.patientsService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.loadListContent();
      this.loading = false;
    });
  }

  setupForm(): void {
    this.addRowForm = new FormGroup({
      'pesel': new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(11),
        Validators.maxLength(11),
        this.forbiddenPesel.bind(this)
      ]),
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]),
      'surname': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]),
    });
  }

  forbiddenPesel(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      if (this.patients.filter(patient => (patient.pesel == String(control.value).replace(new RegExp("\\s+", "g"),' ').trim() && patient.pesel !== this.editedPesel)).length) {
        return {'forbiddenPesel': true};
      }
    }
    return null;
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['pesel', 'imię', 'nazwisko'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let patient of this.patients) {
      rows.push({
        row: [
          String(patient.id),
          patient.pesel,
          patient.name,
          patient.surname
        ]
      })
    }
    return rows;
  }

  deletePatient(patientId: number): void {
    this.loading = true;
    this.patientsService.deletePatient(patientId).subscribe(() => {
      this.loadSelfAndDependentTables();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.editedPesel = this.patients.filter(patient => patient.id === this.formRowId).map(patient => patient.pesel)[0];
      this.addRowForm.patchValue({
        'pesel': this.editedPesel,
        'name': this.patients.filter(patient => patient.id === this.formRowId).map(patient => patient.name)[0],
        'surname': this.patients.filter(patient => patient.id === this.formRowId).map(patient => patient.surname)[0]
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
        this.patientsService.insertPatient({
          pesel: this.addRowForm.value['pesel'],
          name: this.addRowForm.value['name'],
          surname: this.addRowForm.value['surname']
        } as Patient).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.patientsService.updatePatient({
          pesel: this.addRowForm.value['pesel'],
          name: this.addRowForm.value['name'],
          surname: this.addRowForm.value['surname'],
          id: this.formRowId
        } as Patient).subscribe(() => {
          this.editedPesel ='';
          this.showForm = false;
          this.formRowId = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.loadPatients();
    this.appointmentsService.loadAppointments();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
