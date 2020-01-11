import {Component, OnInit} from "@angular/core";
import {FunctionsService} from "./functions.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Function} from "./function.model";
import {StaffService} from "../staff/staff.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'functions',
  template: `
    <div class="section-container">
      <h1 class="section-header">FUNKCJE</h1>
      <spinner *ngIf="loading"></spinner>
      <div class="section-body" *ngIf="!loading">
        <div class="flex-item form-flex-item"
             [ngClass]="{'collapsed': !showForm}">
          <div class="form-body" *ngIf="showForm" class="form-container">
            <form [formGroup]="addRowForm">
              <div class="form-row">
                <label for="hospitalWardName">Nazwa Funkcji</label>
                <input type="text"
                       placeholder="wpisz nazwę funkcji"
                       class="form-control"
                       formControlName="name"
                       id="hospitalWardName">
              </div>
              <div class="validation-error" *ngIf="formFunctionName.errors?.pattern">
                Pole może zawierać małe/duże litery oraz znaki spacji
              </div>
              <div class="validation-error" *ngIf="formFunctionName.errors?.required && formFunctionName.touched">
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
            (selectedRowChange)="selectedRow=$event"
            (removeRowChange)="deleteFunctions($event)"
            [listContent]="listContent"></list>
          <div class="selected-row-buttons-container" *ngIf="selectedRow>-1">
            <action-button
              [aquamarine]="true"
              [width]="100"
              [height]="80"
              *ngIf="selectedRow>-1"
              (click)="onShowFunctionStaff()"
              text="pracownicy funkcji"></action-button>
          </div>
        </div>
      </div>
    </div>
    <div class="display-list" *ngIf="showFunctionStaff">
      <list [listContent]="staffListContent"
            (closeListChange)="closeFunctionStaff()"
            [editable]="false"></list>
    </div>
  `,
  styleUrls: ['./functions.component.scss']
})
export class FunctionsComponent implements OnInit{
  functions: Function[];
  loading: boolean = true;
  showForm: boolean = false;
  showFunctionStaff = false;
  formRowId: number = -1;
  selectedRow: number = -1;
  addRowForm: FormGroup;
  listContent: ListContent;
  staffListContent: ListContent;

  constructor(private functionsService: FunctionsService,
              private staffService: StaffService) {
  }

  ngOnInit(): void {
    this.setupForm();
   this.loadFunctions();
    this.functionsService.loadFunctionsSubject.subscribe(() => {
      this.loadFunctions();
    });
  }

  onShowFunctionStaff() {
    this.loading = true;
    this.functionsService.getFunctionStaff(this.selectedRow).subscribe(staff => {
      let rows: Row[] = [];
      for (let staffMember of staff) {
        rows.push({
          row: [
            String(staffMember.id),
            staffMember.name,
            staffMember.surname,
            String(staffMember.employeeId),
          ]
        })
      }
      this.staffListContent = {
        columns: ['id', 'imię', 'nazwisko', 'id pracownika'],
        rows: rows
      };
      this.loading = false;
      this.showFunctionStaff = true;
    });
  }

  closeFunctionStaff() {
    this.showFunctionStaff = false;
    this.selectedRow = -1;
  }

  get formFunctionName() {
    return this.addRowForm.get('name');
  }

  private loadFunctions() {
    this.loading = true;
    this.functionsService.getFunctions().subscribe(functions => {
      this.functions = functions;
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
    for (let hospitalFunction of this.functions) {
      rows.push({
        row: [
          String(hospitalFunction.id),
          hospitalFunction.name,
        ]
      })
    }
    return rows;
  }

  deleteFunctions(functionsId: number): void {
    this.loading = true;
    this.functionsService.deleteFunction(functionsId).subscribe(() => {
      this.loadSelfAndDependentTables()
    });
  }

  loadForm(id: number): void {
    this.formRowId = id;
    if (this.formRowId >= 0) {
      this.addRowForm.patchValue({
        'name': this.functions.filter(func => func.id === this.formRowId).map(func => func.name)
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
        this.functionsService.insertFunction({
          name: this.addRowForm.value['name']
        } as Function).subscribe(() => {
          this.showForm = false;
          this.loadSelfAndDependentTables();
        });
      } else {
        this.functionsService.updateFunction({
          name: this.addRowForm.value['name'],
          id: this.formRowId
        } as Function).subscribe(() => {
          this.showForm = false;
          this.formRowId = -1;
          this.loadSelfAndDependentTables();
        });
      }
    }
  }

  loadSelfAndDependentTables(): void {
    this.loadFunctions();
    this.staffService.loadStaff();
  }

  onClickHideForm(): void {
    this.showForm = false;
  }
}
