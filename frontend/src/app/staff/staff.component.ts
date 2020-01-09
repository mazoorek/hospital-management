import {Component, OnInit} from "@angular/core";
import {StaffService} from "./staff.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Staff} from "./staff.model";
import {EmployeesService} from "../employees/employees.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FunctionsService} from "../functions/functions.service";
import {Function} from "../functions/function.model";

@Component({
  selector: 'staff',
  template: `
    <h1 class="section-header">PERSONEL</h1>
    <spinner *ngIf="loading"></spinner>
    <div class="section-body" *ngIf="!loading">
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
            <div class="validation-error" *ngIf="formStaffMemberName.errors?.pattern">
              Pole może zawierać małe/duże litery oraz znaki spacji
            </div>
            <div class="validation-error" *ngIf="formStaffMemberName.errors?.required && formStaffMemberName.touched">
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
            <div class="validation-error" *ngIf="formStaffMemberSurname.errors?.pattern">
              Pole może zawierać małe/duże litery oraz znaki spacji
            </div>
            <div class="validation-error"
                 *ngIf="formStaffMemberSurname.errors?.required && formStaffMemberSurname.touched">
              Pole nie może być puste
            </div>
            <div class="form-row">
              <label for="function">Nazwa Funkcji</label>
              <select id="function" class="select-field" (change)="changeFunction($event)"
                      formControlName="function">
                <option value="null" disabled [selected]="true" *ngIf="this.formRowId===-1">Wybierz Funkcję
                </option>
                <option *ngFor="let hospitalFunction of functions"
                        [ngValue]="hospitalFunction">{{hospitalFunction}}</option>
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
            (removeRowChange)="deleteStaffMember($event)"
            [listContent]="listContent"></list>
    </div>
  `,
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  staff: Staff[];
  loading: boolean = true;
  showForm: boolean = false;
  formRowId: number = -1;
  functions: string[];
  hospitalWards: string[];
  addRowForm: FormGroup;
  listContent: ListContent;

  constructor(private staffService: StaffService,
              private functionsService: FunctionsService,
              private employeeService: EmployeesService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.loadStaff();
    this.staffService.loadStaffSubject.subscribe(() => {
      this.loadStaff();
    });
    this.staffService.addNewStaffMemberSubject.subscribe(() => {
      this.loadForm(-1);
    })
  }

  get formStaffMemberName() {
    return this.addRowForm.get('name');
  }

  get formStaffMemberSurname() {
    return this.addRowForm.get('surname');
  }

  changeFunction(event): void {
    this.addRowForm.patchValue({
      'function': event.target.value
    })
  }

  private loadStaff() {
    this.loading = true;
    this.staffService.getStaff().subscribe(staff => {
      this.staff = staff;
      this.loadListContent();
      this.loadFormData();
    });
  }

  private loadFormData() {
    this.loading = true;
    this.functionsService.getFunctions().subscribe(functions => {
      this.functions = (functions as Function []).map(func => func.name);
      this.loading = false;
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
      'function': new FormControl('', Validators.required)
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko', 'id pracownika', 'funkcja'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let staff of this.staff) {
      rows.push({
        row: [
          String(staff.id),
          staff.name,
          staff.surname,
          String(staff.employeeId),
          staff.functionName
        ]
      })
    }
    return rows;
  }

  deleteStaffMember(staffMemberId: number): void {
    this.loading = true;
    this.staffService.deleteStaffMember(staffMemberId).subscribe(() => {
     this.loadSelfAndDependentTables()
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.addRowForm.patchValue({
        'name': this.staff.filter(staffMember => staffMember.id === this.formRowId).map(staffMember => staffMember.name)[0],
        'surname': this.staff.filter(staffMember => staffMember.id === this.formRowId).map(staffMember => staffMember.surname)[0],
        'function': this.staff.filter(staffMember => staffMember.id === this.formRowId).map(staffMember => staffMember.functionName)[0]
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
        this.staffService.insertStaff({
          name: this.addRowForm.value['name'],
          surname: this.addRowForm.value['surname'],
          functionName: this.addRowForm.value['function'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
        } as Staff).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.staffService.updateStaff({
          name: this.addRowForm.value['name'],
          surname: this.addRowForm.value['surname'],
          functionName: this.addRowForm.value['function'].split(" ").filter(word => word.match(filterByRegex)).join(" "),
          employeeId: this.staff.filter(staffMember => staffMember.id ===this.formRowId).map(staffMember => staffMember.employeeId)[0],
          id: this.formRowId
        } as Staff).subscribe(() => {
          this.showForm = false;
          this.formRowId = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.loadStaff();
    this.employeeService.loadEmployees();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
