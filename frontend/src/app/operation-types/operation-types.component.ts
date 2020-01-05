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
            <div class="form-row">
              <label for="specializationName">Nazwa specjalizacji</label>
              <select id="specializationName" class="select-field" (change)="changeSpecialization($event)" formControlName="specialization">
                <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz nazwę specjalizacji</option>
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
      <list class="flex-item list-flex-item"
            (addOrUpdateRowChange)="loadForm($event)"
            (removeRowChange)="deleteOperationTypes($event)"
            [listContent]="listContent"></list>
    </div>
  `,
  styleUrls: ['./operation-types.component.scss']
})
export class OperationTypesComponent implements OnInit{
  operationTypes: OperationType[];
  loading: boolean = true;
  showForm: boolean = false;
  formRowId: number = -1;
  specializations: string[];
  addRowForm: FormGroup;
  listContent: ListContent;

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
        Validators.pattern('^[A-Za-z\\s]+$')
      ]),
      'specialization': new FormControl('', Validators.required)
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'typy operacji', 'nazwa specjalizacji'],
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
      this.addRowForm.patchValue({
        'operationType': this.operationTypes.filter(type => type.id === this.formRowId).map(type => type.type)[0],
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
          type: this.addRowForm.value['operationType'],
          specializationName: this.addRowForm.value['specialization'].split(" ").filter(word => word.match(filterByRegex)).join(" ")
        } as OperationType).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.operationTypesService.updateOperationType({
          type: this.addRowForm.value['operationType'],
          specializationName: this.addRowForm.value['specialization'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
          id: this.formRowId
        } as OperationType).subscribe(() => {
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
