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
    <h1 class="section-header">ODDZIAŁY</h1>
    <spinner *ngIf="loading"></spinner>
    <div class="section-body" *ngIf="!loading">
      <div class="flex-item form-flex-item"
           [ngClass]="{'collapsed': !showForm}">
        <div *ngIf="showForm" class="form-container">
          <form [formGroup]="addRowForm">
            <div class="input-field">
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
            <div class="validation-error" *ngIf="formHospitalWardName.errors?.required && formHospitalWardName.touched">
              Pole nie może być puste
            </div>
          </form>
          <div class="buttons-container">
            <action-button
              class="form-button"
              (click)="onClickAddOrUpdate()"
              [green]="true"
              [disabled] = "addRowForm.invalid"
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
            (removeRowChange)="deleteHospitalWard($event)"
            [listContent]="listContent"></list>
    </div>
  `,
  styleUrls: ['./hospital-wards.component.scss']
})
export class HospitalWardsComponent implements OnInit {
  hospitalWards: HospitalWard[];
  loading: boolean = true;
  showForm: boolean = false;
  formRowId: number = -1;
  addRowForm: FormGroup;
  listContent: ListContent;

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
      'name': new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')])
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'oddziały'],
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
      this.addRowForm.patchValue({
        'name': this.hospitalWards.filter(ward => ward.id === this.formRowId).map(ward => ward.name)
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
