import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ListContent, Row} from "./ListContent/list-content.model";

const MAX_ROW_WIDTH: number = 170;

@Component({
  selector: 'list',
  template: `
    <div class="list-filter"
         [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
      <div class="primary-row-item" *ngFor="let filterValue of filterValues; let i = index;  trackBy:trackByFn">
        <input class="filter-input"
               type="text"
               [(ngModel)]="filterValue"
               (ngModelChange)="applyFilter(filterValue, i)">
      </div>
      <action-button [aquamarine]="true"
                     (click)="onResetFilter()"
                     text="zresetuj filtr"></action-button>
    </div>

    <div class="list-header"
         [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
      <div class="primary-row-item"
           (click)="sortRows(headerColumn)"
           *ngFor="let headerColumn of headerColumns">
        {{headerColumn}}
        <span *ngIf="headerColumn===sortingColumn">&darr;</span>
      </div>
      <action-button [transparent]="true"></action-button>
    </div>
    <div class="rows"
         [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
      <div class="row" *ngFor="let row of filteredRows; let i = index">
        <div class="row-item" *ngFor="let rowItem of row.row">
          {{rowItem}}
        </div>
        <action-button [red]="true"
                       text="usuń"
                       (click)="removeRow(i)"
                       [ngStyle]="{'margin-left.px': 30}"></action-button>
      </div>
    </div>
  `,
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() listContent: ListContent;
  @Output() removeRowChange: EventEmitter<number> = new EventEmitter<number>();

  readonly BUTTON_SPACE: number = 90;

  headerColumns: string [];
  filterValues: string [];
  rows: Row [];
  filteredRows: Row [];
  sortingColumn: string = 'ID';

  ngOnInit(): void {
    this.headerColumns = this.getHeaderColumns();
    this.rows = this.listContent.rows;
    this.filteredRows = this.rows;
    this.filterValues = Array(this.headerColumns.length).fill("");
    this.sortRows(this.sortingColumn);
  }

  trackByFn(index: number, item: string) {
    return index;
  }

  getHeaderColumns(): string[] {
    return this.listContent.columns.map(column => column.toUpperCase());
  }

  getMaxRowLength(): number {
    return this.getHeaderColumns().length * MAX_ROW_WIDTH + this.BUTTON_SPACE;
  }

  removeRow(rowIndex: number): void {
    this.removeRowChange.emit(+this.rows[rowIndex].row[0]);
  }


  sortRows(sortingColumn: string): void {
    let indexOfSortingColumn = this.headerColumns
      .findIndex((element) => element === sortingColumn);
    this.rows
      .sort((r1, r2) => {
        let a: string = r1.row[indexOfSortingColumn];
        let b: string = r2.row[indexOfSortingColumn];
        if (isNaN(+a) && isNaN(+b)) {
          if (a > b) {
            return 1;
          }
          if (b > a) {
            return -1;
          }
          return 0;
        } else {
          return +a - +b;
        }
      });
    this.sortingColumn = sortingColumn;
  }

  applyFilter(filterValue: string, index: number): void {
    this.filteredRows = this.rows;
    this.filterValues[index] = filterValue;
    this.filterValues.forEach(filterValue => {
      if (filterValue.trim().length > 0) {
        this.filteredRows = this.filteredRows.filter(each => {
          return each.row[this.filterValues.indexOf(filterValue)].includes(filterValue);
        });
      }
    });
  }

  onResetFilter(): void {
    this.filterValues = this.filterValues.map(each => '');
    this.filteredRows = this.rows;
  }
}
