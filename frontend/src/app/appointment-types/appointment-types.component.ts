import {Component, OnInit} from "@angular/core";
import {AppointmentTypesService} from "./appointment-types.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {AppointmentType} from "./appointment-types.model";
import {AppointmentsService} from "../appointments/appointments.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SpecializationsService} from "../specializations/specializations.service";
import {Specialization} from "../specializations/specialization.model";

@Component({
  selector: 'appointment-types',
  template: `
    <div class="section-container">
      <h1 class="section-header">CHARAKTERY WIZYT</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item form-flex-item"
             [ngClass]="{'collapsed': !showForm}">
          <div *ngIf="showForm" class="form-container">
            <form class="form-body" [formGroup]="addRowForm">
              <div class="form-row">
                <label for="appointmentType">Charakter wizyty</label>
                <input type="text"
                       placeholder="wpisz charakter wizyty"
                       class="form-control"
                       formControlName="appointmentType"
                       id="appointmentType">
              </div>
              <div class="validation-error" *ngIf="formAppointmentType.errors?.pattern">
                Pole może zawierać małe/duże litery oraz znaki spacji
              </div>
              <div class="validation-error" *ngIf="formAppointmentType.errors?.required && formAppointmentType.touched">
                Pole nie może być puste
              </div>
              <div class="validation-error"
                   *ngIf="addRowForm.get('appointmentType').hasError('forbiddenAppointmentType')">
                Charakter wizyty jest już zajęty
              </div>
              <div class="form-row">
                <label for="specializationName">Nazwa specjalizacji</label>
                <select id="specializationName" class="select-field" (change)="changeSpecialization($event)"
                        formControlName="specialization">
                  <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz nazwę
                    specjalizacji
                  </option>
                  <option *ngFor="let specialization of specializations"
                          [ngValue]="specialization">{{specialization}}</option>
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
        <div class="flex-item list-flex-item">
          <list class="flex-item list-flex-item"
                (addOrUpdateRowChange)="loadForm($event)"
                (selectedRowChange)="selectedRow=$event"
                (removeRowChange)="deleteAppointmentType($event)"
                [listContent]="listContent"></list>
          <div class="selected-row-buttons-container" *ngIf="selectedRow>-1">
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowAppointmentTypeAppointments()"
              text="wizyty o danym charakterze"></action-button>
          </div>
        </div>
      </div>
    </div>
    <div class="display-list" *ngIf="showAppointmentTypeAppointments">
      <list [listContent]="appointmentListContent"
            (closeListChange)="closeAppointmentTypeAppointments()"
            [editable]="false"></list>
    </div>
  `,
  styleUrls: ['./appointment-types.component.scss']
})
export class AppointmentTypesComponent implements OnInit {
  appointmentTypes: AppointmentType[];
  editedAppointmentType: string;
  loading: boolean = true;
  showForm: boolean = false;
  showAppointmentTypeAppointments = false;
  selectedRow: number = -1;
  formRowId: number = -1;
  specializations: string[];
  addRowForm: FormGroup;
  listContent: ListContent;
  appointmentListContent: ListContent;

  constructor(private appointmentTypesService: AppointmentTypesService,
              private specializationsService: SpecializationsService,
              private appointmentsService: AppointmentsService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadAppointmentTypes();
    this.appointmentTypesService.loadAppointmentTypesSubject.subscribe(() => {
      this.loadAppointmentTypes();
    });
  }

  onShowAppointmentTypeAppointments() {
    this.loading = true;
    this.appointmentTypesService.getAppointmentTypeAppointments(this.selectedRow).subscribe(appointments => {
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
              appointment.roomId,
              appointment.pesel,
              appointment.doctorId,
              appointment.operationType ? appointment.operationType : '',
            ]
          })
        }
      this.appointmentListContent = {
        columns: ['id', 'data początku', 'data końca', 'id pokoju', 'pesel', 'id lekarza', 'typ operacji'],
        rows: rows
      };
      this.loading = false;
      this.showAppointmentTypeAppointments = true;
    });
  }

  closeAppointmentTypeAppointments() {
    this.showAppointmentTypeAppointments = false;
    this.selectedRow = -1;
  }

  get formAppointmentType() {
    return this.addRowForm.get('appointmentType');
  }

  changeSpecialization(event): void {
    this.addRowForm.patchValue({
      'specialization': event.target.value
    })
  }

  private loadAppointmentTypes() {
    this.loading = true;
    this.appointmentTypesService.getAppointmentTypes().subscribe(operationTypes => {
      this.appointmentTypes = operationTypes;
      this.loadListContent();
      this.loadFormData();
    });
  }

  private loadFormData() {
    this.loading = true;
    this.specializationsService.getSpecializations().subscribe(specializations => {
      this.specializations = (specializations as Specialization []).map(specialization => specialization.name);
      this.loading = false;
    });
  }

  setupForm(): void {
    this.addRowForm = new FormGroup({
      'appointmentType': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$'),
        this.forbiddenAppointmentType.bind(this)
      ]),
      'specialization': new FormControl('', Validators.required)
    });
  }

  forbiddenAppointmentType(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      if (this.appointmentTypes.filter(appointmentType => (appointmentType.type == control.value && appointmentType.type !== this.editedAppointmentType)).length) {
        return {'forbiddenAppointmentType': true};
      }
    }
    return null;
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'charakter wizyty', 'nazwa specjalizacji'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let appointmentType of this.appointmentTypes) {
      rows.push({
        row: [
          String(appointmentType.id),
          appointmentType.type,
          String(appointmentType.specializationName),
        ]
      })
    }
    return rows;
  }

  deleteAppointmentType(appointmentTypeId: number): void {
    this.loading = true;
    this.appointmentTypesService.deleteAppointmentType(appointmentTypeId).subscribe(() => {
      this.loadSelfAndDependentTables();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.editedAppointmentType = this.appointmentTypes.filter(type => type.id === this.formRowId).map(type => type.type)[0]
      this.addRowForm.patchValue({
        'appointmentType': this.editedAppointmentType,
        'specialization': this.appointmentTypes.filter(type => type.id === this.formRowId).map(type => type.specializationName)[0]
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
        this.appointmentTypesService.insertAppointmentType({
          type: this.addRowForm.value['appointmentType'],
          specializationName: this.addRowForm.value['specialization'].split(" ").filter(word => word.match(filterByRegex)).join(" ")
        } as AppointmentType).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.appointmentTypesService.updateAppointmentType({
          type: this.addRowForm.value['appointmentType'],
          specializationName: this.addRowForm.value['specialization'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
          id: this.formRowId
        } as AppointmentType).subscribe(() => {
          this.editedAppointmentType = '';
          this.showForm = false;
          this.formRowId = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.appointmentsService.loadAppointments();
    this.loadAppointmentTypes();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
