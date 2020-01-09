import {Component, OnInit} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {DoctorsService} from "./doctors.service";
import {Doctor} from "./doctor.model";
import {AppointmentsService} from "../appointments/appointments.service";
import {EmployeesService} from "../employees/employees.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Specialization} from "../specializations/specialization.model";
import {SpecializationsService} from "../specializations/specializations.service";
import {HospitalWardsService} from "../hospital-wards/hospital-wards.service";
import {HospitalWard} from "../hospital-wards/hospital-ward.model";

@Component({
  selector: 'doctors',
  template: `
    <h1 class="section-header">LEKARZE</h1>
    <spinner *ngIf="loading"></spinner>
    <div class="section-body" *ngIf="!loading">
      <list class="flex-item list-flex-item"
            (addOrUpdateRowChange)="loadForm($event)"
            (removeRowChange)="deleteDoctor($event)"
            [listContent]="listContent"></list>
      <div class="flex-item form-flex-item"
           [ngClass]="{'collapsed': !showForm}">
        <div *ngIf="showForm" class="form-container">
          <form class="form-body" [formGroup]="addRowForm">
            <div class="form-row">
              <label for="name">Imię</label>
              <input type="text"
                     placeholder="wpisz imię"
                     class="form-control"
                     formControlName="name"
                     id="name">
            </div>
            <div class="validation-error form-row" *ngIf="formDoctorName.errors?.pattern">
              Pole może zawierać małe/duże litery oraz znaki spacji
            </div>
            <div class="validation-error form-row" *ngIf="formDoctorName.errors?.required && formDoctorName.touched">
              Pole nie może być puste
            </div>
            <div class="form-row">
              <label for="surname">Nazwisko</label>
              <input type="text"
                     placeholder="wpisz nazwisko"
                     class="form-control"
                     formControlName="surname"
                     id="surname">
            </div>
            <div class="validation-error form-row" *ngIf="formDoctorSurname.errors?.pattern">
              Pole może zawierać małe/duże litery oraz znaki spacji
            </div>
            <div class="validation-error form-row" *ngIf="formDoctorSurname.errors?.required && formDoctorSurname.touched">
              Pole nie może być puste
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
            <div class="form-row">
              <label for="hospitalWard">Nazwa oddziału</label>
              <select id="hospitalWard" class="select-field" (change)="changeHospitalWard($event)"
                      formControlName="hospitalWard">
                <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz nazwę
                  oddziału
                </option>
                <option *ngFor="let hospitalWard of hospitalWards"
                        [ngValue]="hospitalWard">{{hospitalWard}}</option>
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
    </div>
  `,
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {

  loading: boolean = true;
  listContent: ListContent;
  showForm: boolean = false;
  formRowId: number = -1;
  specializations: string[];
  hospitalWards: string[];
  addRowForm: FormGroup;
  doctors: Doctor [];

  constructor(private doctorsService: DoctorsService,
              private appointmentsService: AppointmentsService,
              private specializationsService: SpecializationsService,
              private hospitalWardsService: HospitalWardsService,
              private employeeService: EmployeesService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadDoctors();
    this.doctorsService.loadDoctorsSubject.subscribe(() => {
      this.loadDoctors();
    });
    this.doctorsService.addNewDoctorSubject.subscribe(() => {
      this.loadForm(-1);
    })
  }

  get formDoctorName() {
    return this.addRowForm.get('name');
  }

  get formDoctorSurname() {
    return this.addRowForm.get('surname');
  }

  changeSpecialization(event): void {
    this.addRowForm.patchValue({
      'specialization': event.target.value
    })
  }

  changeHospitalWard(event): void {
    this.addRowForm.patchValue({
      'hospitalWard': event.target.value
    })
  }

  private loadDoctors() {
    this.loading = true;
    this.doctorsService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
      this.loadListContent();
      this.loadFormData();
    })
  }

  private loadFormData() {
    this.loading = true;
    this.specializationsService.getSpecializations().subscribe(specializations => {
      this.specializations = (specializations as Specialization []).map(specialization => specialization.name);
      this.hospitalWardsService.getHospitalWards().subscribe(hospitalWards => {
        this.hospitalWards = (hospitalWards as HospitalWard []).map(hospitalWard => hospitalWard.name);
        this.loading = false;
      });
    });
  }

  setupForm(): void {
    this.addRowForm = new FormGroup({
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]),
      'surname': new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]),
      'specialization': new FormControl('', Validators.required),
      'hospitalWard': new FormControl('', Validators.required)
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko', 'id pracownika', 'specjalizacja', 'oddział'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let doctor of this.doctors) {
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
    return rows;
  }

  deleteDoctor(doctorId: number): void {
    this.loading = true;
    this.doctorsService.deleteDoctor(doctorId).subscribe(() => {
      this.loadSelfAndDependentTables()
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.addRowForm.patchValue({
        'name': this.doctors.filter(doctor => doctor.id === this.formRowId).map(doctor => doctor.name)[0],
        'surname': this.doctors.filter(doctor => doctor.id === this.formRowId).map(doctor => doctor.surname)[0],
        'specialization': this.doctors.filter(doctor => doctor.id === this.formRowId).map(doctor => doctor.specializationName)[0],
        'hospitalWard': this.doctors.filter(doctor => doctor.id === this.formRowId).map(doctor => doctor.wardName)[0],
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
        this.doctorsService.insertDoctor({
          name: this.addRowForm.value['name'],
          surname: this.addRowForm.value['surname'],
          specializationName: this.addRowForm.value['specialization'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
          wardName: this.addRowForm.value['hospitalWard'].split(" ").filter(word => word.match(filterByRegex)).join(" ")
        } as Doctor).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.doctorsService.updateDoctor({
          name: this.addRowForm.value['name'],
          surname: this.addRowForm.value['surname'],
          specializationName: this.addRowForm.value['specialization'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
          wardName: this.addRowForm.value['hospitalWard'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
          employeeId: this.doctors.filter(doctor => doctor.id ===this.formRowId).map(doctor => doctor.employeeId)[0],
          id: this.formRowId
        } as Doctor).subscribe(() => {
          this.showForm = false;
          this.formRowId = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.loadDoctors();
    this.appointmentsService.loadAppointments();
    this.employeeService.loadEmployees();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
