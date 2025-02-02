import {Component, OnInit} from "@angular/core";
import {SpecializationsService} from "./specializations.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Specialization} from "./specialization.model";
import {DoctorsService} from "../doctors/doctors.service";
import {OperationTypesService} from "../operation-types/operation-types.service";
import {AppointmentTypesService} from "../appointment-types/appointment-types.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppointmentsService} from "../appointments/appointments.service";

@Component({
  selector: 'specializations',
  template: `
    <div class="section-container">
      <h1 class="section-header">SPECJALIZACJE</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item form-flex-item"
             [ngClass]="{'collapsed': !showForm}">
          <div *ngIf="showForm" class="form-container">
            <form class="form-body" [formGroup]="addRowForm">
              <div class="form-row">
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
              <div class="validation-error"
                   *ngIf="addRowForm.get('name').hasError('forbiddenName')">
                Nazwa specjalizacji jest już zajęta
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
                [showIdColumn]="false"
                (removeRowChange)="deleteSpecializations($event)"
                (selectedRowChange)="selectedRow=$event"
                [listContent]="listContent"></list>
          <div class="selected-row-buttons-container" *ngIf="selectedRow>-1">
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowSpecializationDoctors()"
              text="doktorzy specjalizacji"></action-button>
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowSpecializationAppointmentTypes()"
              text="typy wizyt specjalizacji"></action-button>
            <action-button
              [aquamarine]="true"
              [width]="120"
              [height]="100"
              *ngIf="selectedRow>-1"
              (click)="onShowSpecializationOperationTypes()"
              text="typy operacji specjalizacji"></action-button>
          </div>
        </div>
      </div>
    </div>
    <div class="display-list" *ngIf="showSpecializationDoctors">
      <list [listContent]="doctorsListContent"
            (closeListChange)="closeSpecializationDoctors()"
            [editable]="false"></list>
    </div>
    <div class="display-list" *ngIf="showSpecializationAppointmentTypes">
      <list [listContent]="appointmentTypesListContent"
            (closeListChange)="closeSpecializationAppointments()"
            [editable]="false"></list>
    </div>
    <div class="display-list" *ngIf="showSpecializationOperationTypes">
      <list [listContent]="operationTypesListContent"
            (closeListChange)="closeSpecializationOperationTypes()"
            [editable]="false"></list>
    </div>
  `,
  styleUrls: ['./specializations.component.scss']
})
export class SpecializationsComponent implements OnInit {
  specializations: Specialization[];
  editedSpecializationName: string;
  loading: boolean = true;
  showForm: boolean = false;
  showSpecializationDoctors = false;
  showSpecializationAppointmentTypes = false;
  showSpecializationOperationTypes = false;
  selectedRow: number = -1;
  formRowId: number = -1;
  addRowForm: FormGroup;
  listContent: ListContent;
  doctorsListContent: ListContent;
  appointmentTypesListContent: ListContent;
  operationTypesListContent: ListContent;

  constructor(
    private specializationsService: SpecializationsService,
    private doctorsService: DoctorsService,
    private operationTypesService: OperationTypesService,
    private appointmentsService: AppointmentsService,
    private appointmentTypesService: AppointmentTypesService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadSpecializations();
    this.specializationsService.loadSpecializationsSubject.subscribe(() => {
      this.loadSpecializations();
    });
  }

  onShowSpecializationOperationTypes() {
    this.loading = true;
    this.specializationsService.getSpecializationAppointmentTypes(this.selectedRow).subscribe(operationTypes => {
      let rows: Row[] = [];
      for (let operationType of operationTypes) {
        rows.push({
          row: [
            operationType.type
          ]
        })
      }
      this.operationTypesListContent = {
        columns: ['typ operacji'],
        rows: rows
      };
      this.loading = false;
      this.showSpecializationOperationTypes = true;
    });
  }

  onShowSpecializationAppointmentTypes() {
    this.loading = true;
    this.specializationsService.getSpecializationAppointmentTypes(this.selectedRow).subscribe(appointmentTypes => {
      let rows: Row[] = [];
      for (let appointmentType of appointmentTypes) {
        rows.push({
          row: [
            appointmentType.type
          ]
        })
      }
      this.appointmentTypesListContent = {
        columns: ['charakter wizyty'],
        rows: rows
      };
      this.loading = false;
      this.showSpecializationAppointmentTypes = true;
    });
  }

  onShowSpecializationDoctors() {
    this.loading = true;
    this.specializationsService.getSpecializationDoctors(this.selectedRow).subscribe(doctors => {
      let rows: Row[] = [];
      for (let doctor of doctors) {
        rows.push({
          row: [
            String(doctor.id),
            doctor.name,
            doctor.surname,
            String(doctor.employeeId),
            doctor.wardName
          ]
        })
      }
      this.doctorsListContent = {
        columns: ['id', 'imię', 'nazwisko', 'id pracownika', 'nazwa oddzialu'],
        rows: rows
      };
      this.loading = false;
      this.showSpecializationDoctors = true;
    });
  }

  closeSpecializationDoctors() {
    this.showSpecializationDoctors = false;
    this.selectedRow = -1;
  }

  closeSpecializationAppointments() {
    this.showSpecializationAppointmentTypes = false;
    this.selectedRow = -1;
  }

  closeSpecializationOperationTypes() {
    this.showSpecializationOperationTypes = false;
    this.selectedRow = -1;
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
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$'),
        this.forbiddenName.bind(this)
      ])
    });
  }

  forbiddenName(control: FormControl): { [s: string]: boolean } {
    let controlValue = String(control.value).replace(new RegExp("\\s+", "g"),' ').trim();
    if (control.value) {
      if(this.formRowId === -1 || this.editedSpecializationName!== controlValue) {
        if (this.specializations.filter(specialization => (specialization.name == controlValue)).length) {
          return {'forbiddenName': true};
        }
      }
    }
    return null;
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['nazwa'],
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
      this.editedSpecializationName = this.specializations.filter(specialization => specialization.id === this.formRowId).map(specialization => specialization.name)[0];
      this.addRowForm.patchValue({
        'name': this.editedSpecializationName.replace(new RegExp("\\s+", "g"),' ').trim(),
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
        this.specializationsService.insertSpecialization({
          name: String(this.addRowForm.value['name']).replace(new RegExp("\\s+", "g"),' ').trim()
        } as Specialization).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.specializationsService.updateSpecialization({
          name: String(this.addRowForm.value['name']).replace(new RegExp("\\s+", "g"),' ').trim(),
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
    this.appointmentsService.loadAppointments();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
