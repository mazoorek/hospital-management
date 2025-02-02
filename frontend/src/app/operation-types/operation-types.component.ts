import {Component, OnInit} from "@angular/core";
import {OperationTypesService} from "./operation-types.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {OperationType} from "./operation-types.model";
import {AppointmentsService} from "../appointments/appointments.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Specialization} from "../specializations/specialization.model";
import {SpecializationsService} from "../specializations/specializations.service";


@Component({
  selector: 'operation-types',
  template: `
    <div class="section-container">
      <h1 class="section-header">TYPY OPERACJI</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item form-flex-item"
             [ngClass]="{'collapsed': !showForm}">
          <div *ngIf="showForm" class="form-container">
            <form class="form-body" [formGroup]="addRowForm">
              <div class="form-row">
                <label for="operationType">Typ operacji</label>
                <input type="text"
                       placeholder="wpisz typ operacji"
                       class="form-control"
                       formControlName="operationType"
                       id="operationType">
              </div>
              <div class="validation-error" *ngIf="formOperationType.errors?.pattern">
                Pole może zawierać małe/duże litery oraz znaki spacji
              </div>
              <div class="validation-error" *ngIf="formOperationType.errors?.required && formOperationType.touched">
                Pole nie może być puste
              </div>
              <div class="validation-error"
                   *ngIf="addRowForm.get('operationType').hasError('forbiddenOperationType')">
                Typ operacji jest już zajęty
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
          <list
            (addOrUpdateRowChange)="loadForm($event)"
            [showIdColumn]="false"
            (selectedRowChange)="selectedRow=$event"
            (removeRowChange)="deleteOperationTypes($event)"
            [listContent]="listContent"></list>
          <div class="selected-row-buttons-container" *ngIf="selectedRow>-1">
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowOperationTypeAppointments()"
              text="wizyty o danym typie"></action-button>
          </div>
        </div>
      </div>
    </div>
    <div class="display-list" *ngIf="showOperationTypeAppointments">
      <list [listContent]="appointmentListContent"
            (closeListChange)="closeOperationTypeAppointments()"
            [editable]="false"></list>
    </div>
  `,
  styleUrls: ['./operation-types.component.scss']
})
export class OperationTypesComponent implements OnInit{
  operationTypes: OperationType[];
  editedOperationType: string;
  loading: boolean = true;
  showForm: boolean = false;
  showOperationTypeAppointments = false;
  selectedRow: number = -1;
  formRowId: number = -1;
  specializations: string[];
  addRowForm: FormGroup;
  listContent: ListContent;
  appointmentListContent: ListContent;


  constructor(private operationTypesService: OperationTypesService,
              private specializationsService: SpecializationsService,
              private appointmentsService: AppointmentsService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadOperationTypes();
    this.operationTypesService.loadOperationTypesSubject.subscribe(() => {
      this.loadOperationTypes();
    });
  }

  onShowOperationTypeAppointments() {
    this.loading = true;
    this.operationTypesService.getOperationTypeAppointments(this.selectedRow).subscribe(appointments => {
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
          ]
        })
      }
      this.appointmentListContent = {
        columns: ['data początku', 'data końca', 'id pokoju', 'pesel', 'id lekarza', 'charakter wizyty'],
        rows: rows
      };
      this.loading = false;
      this.showOperationTypeAppointments = true;
    });
  }

  closeOperationTypeAppointments() {
    this.showOperationTypeAppointments = false;
    this.selectedRow = -1;
  }

  get formOperationType() {
    return this.addRowForm.get('operationType');
  }

  changeSpecialization(event): void {
    this.addRowForm.patchValue({
      'specialization': event.target.value
    })
  }

  private loadOperationTypes() {
    this.loading = true;
    this.operationTypesService.getOperationTypes().subscribe(operationTypes => {
      this.operationTypes = operationTypes;
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
      'operationType': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$'),
        this.forbiddenOperationType.bind(this)
      ]),
      'specialization': new FormControl('', Validators.required)
    });
  }

  forbiddenOperationType(control: FormControl): { [s: string]: boolean } {
    let controlValue = String(control.value).replace(new RegExp("\\s+", "g"),' ').trim();
    if (control.value) {
      if(this.formRowId === -1 || this.editedOperationType!== controlValue) {
        if (this.operationTypes.filter(operationType => (operationType.type == controlValue)).length) {
          return {'forbiddenName': true};
        }
      }
    }
    return null;
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['typy operacji', 'nazwa specjalizacji'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let operationType of this.operationTypes) {
      rows.push({
        row: [
          String(operationType.id),
          operationType.type,
          operationType.specializationName,
        ]
      })
    }
    return rows;
  }

  deleteOperationTypes(operationTypesId: number): void {
    this.loading = true;
    this.operationTypesService.deleteOperationType(operationTypesId).subscribe(() => {
      this.loadSelfAndDependentTables();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.editedOperationType = this.operationTypes.filter(type => type.id === this.formRowId).map(type => type.type)[0];
      this.addRowForm.patchValue({
        'operationType': this.editedOperationType.replace(new RegExp("\\s+", "g"),' ').trim(),
        'specialization': this.operationTypes.filter(type => type.id === this.formRowId).map(type => type.specializationName)[0]
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
        this.operationTypesService.insertOperationType({
          type: String(this.addRowForm.value['operationType']).replace(new RegExp("\\s+", "g"),' ').trim(),
          specializationName: this.addRowForm.value['specialization'].split(" ").filter(word => word.match(filterByRegex)).join(" ")
        } as OperationType).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.operationTypesService.updateOperationType({
          type: String(this.addRowForm.value['operationType']).replace(new RegExp("\\s+", "g"),' ').trim(),
          specializationName: this.addRowForm.value['specialization'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
          id: this.formRowId
        } as OperationType).subscribe(() => {
          this.editedOperationType = '';
          this.showForm = false;
          this.formRowId = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.loadOperationTypes();
    this.appointmentsService.loadAppointments();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
