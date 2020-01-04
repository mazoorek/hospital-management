import {Component, OnInit} from "@angular/core";
import {SpecializationsService} from "./specializations.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Specialization} from "./specialization.model";
import {DoctorsService} from "../doctors/doctors.service";
import {OperationTypesService} from "../operation-types/operation-types.service";
import {AppointmentTypesService} from "../appointment-types/appointment-types.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'specializations',
  template: `
    <h1 class="section-header">SPECJALIZACJE</h1>
    <spinner *ngIf="loading"></spinner>
    <div class="section-body" *ngIf="!loading">
      <div class="flex-item form-flex-item"
           [ngClass]="{'collapsed': !showForm}">
        <div *ngIf="showForm" class="form-container">
          <form [formGroup]="addRowForm">
            <div class="input-field">
              <label for="SpecializationName">Nazwa Specializacji</label>
              <input type="text"
                     placeholder="wpisz nazwę specializacji"
                     class="form-control"
                     formControlName="name"
                     id="SpecializationName">
            </div>
            <div class="validation-error" *ngIf="formSpecializationName.errors?.pattern">
              Pole może zawierać małe/duże litery oraz znaki spacji
            </div>
            <div class="validation-error"
                 *ngIf="formSpecializationName.errors?.required && formSpecializationName.touched">
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
      <list class="flex-item list-flex-item"
            (addOrUpdateRowChange)="loadForm($event)"
            (removeRowChange)="deleteSpecializations($event)"
            [listContent]="listContent"></list>
    </div>
  `,
  styleUrls: ['./specializations.component.scss']
})
export class SpecializationsComponent implements OnInit {
  specializations: Specialization[];
  loading: boolean = true;
  showForm: boolean = false;
  formRowId: number = -1;
  addRowForm: FormGroup;
  listContent: ListContent;

  constructor(
    private specializationsService: SpecializationsService,
    private doctorsService: DoctorsService,
    private operationTypesService: OperationTypesService,
    private appointmentTypesService: AppointmentTypesService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadSpecializations();
    this.specializationsService.loadSpecializationsSubject.subscribe(() => {
      this.loadSpecializations();
    });
  }

  get formSpecializationName() {
    return this.addRowForm.get('name');
  }

  private loadSpecializations() {
    this.loading = true;
    this.specializationsService.getSpecializations().subscribe(specializations => {
      this.specializations = specializations;
      this.loadListContent();
      this.showForm = false;
      this.loading = false;
    });
  }

  setupForm(): void {
    this.addRowForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')])
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'nazwa'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let specialization of this.specializations) {
      rows.push({
        row: [
          String(specialization.id),
          specialization.name,
        ]
      })
    }
    return rows;
  }

  deleteSpecializations(specializationId: number): void {
    this.loading = true;
    this.specializationsService.deleteSpecialization(specializationId).subscribe(() => {
      this.loadSelfAndDependentTables();
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.addRowForm.patchValue({
        'name': this.specializations
          .filter(specialization => specialization.id === this.formRowId)
          .map(specialization => specialization.name)
      })
    } else {
      this.addRowForm.reset();
    }
    this.showForm = true;
  }

  onClickAddOrUpdate(): void {
    if(this.addRowForm.valid) {
      this.loading = true;
      if(this.formRowId===-1) {
        this.specializationsService.insertSpecialization({
          name: this.addRowForm.value['name']
        } as Specialization).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.specializationsService.updateSpecialization({
          name: this.addRowForm.value['name'],
          id: this.formRowId
        } as Specialization).subscribe(() => {
          this.showForm = false;
          this.formRowId = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.loadSpecializations();
    this.doctorsService.loadDoctors();
    this.operationTypesService.loadOperationTypes();
    this.appointmentTypesService.loadAppointmentTypes();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
