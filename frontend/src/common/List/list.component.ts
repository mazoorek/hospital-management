import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ListContent, Row} from "./ListContent/list-content.model";

@Component({
  selector: 'list',
  template: `
    <div class="list-container"
         [ngStyle]=" {'width':getHeaderColumns().length>1 ? (getMaxRowLength() + 2* LIST_PADDING) + '.px': 'unset'}">
      <div class="list-filter"
           [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
        <div class="primary-row-item" *ngFor="let filterValue of filterValues; let i = index;  trackBy:trackByFn">
          <input class="filter-input"
                 type="text"
                 [(ngModel)]="filterValue"
                 (ngModelChange)="applyFilter(filterValue, i)">
        </div>
        <action-button *ngIf="editable" [transparent]="true" [ngStyle]="{'margin-left.px': 30}"></action-button>
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
        <action-button [ngStyle]="{'margin-left.px': 30}" [transparent]="true" *ngIf="editable"></action-button>
        <action-button [transparent]="true"></action-button>
      </div>
      <div class="rows"
           [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
        <div class="row"
             [ngStyle]="{'background-color': selectedRow===rowIndex ? '#cceea1': 'unset'}"
             *ngFor="let row of filteredRows; let rowIndex = index">
          <ng-container *ngFor="let rowItem of row.row; let rowItemIndex = index">
            <div class="row-item"
                 tooltipText="{{rowItem}}"
                 (click)="onEmitSelected(rowIndex)"
                 *ngIf="showIdColumn || rowItemIndex!==0">
              {{rowItem}}
            </div>
          </ng-container>
          <action-button [aquamarine]="true"
                         text="edytuj"
                         *ngIf="editable"
                         (click)="onClickAddOrEditRow(rowIndex)"
                         [ngStyle]="{'margin-left.px': 30}"></action-button>
          <action-button [red]="true"
                         text="usuń"
                         *ngIf="editable"
                         (click)="removeRow(rowIndex)"></action-button>
          <action-button *ngIf="!editable" [transparent]="true"></action-button>
        </div>
      </div>
      <action-button class="footer-button"
                     (click)="onClickAddOrEditRow()"
                     [green]="true"
                     *ngIf="editable"
                     text="Dodaj nowy rekord"
                     [width]="200"></action-button>
      <action-button class="footer-button"
                     (click)="closeList()"
                     [red]="true"
                     *ngIf="!editable"
                     text="Zamknij"
                     [width]="200"></action-button>
    </div>
  `,
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() listContent: ListContent;
  @Input() selectedRow: number = -1;
  @Input() editable: boolean = true;
  @Input() showIdColumn: boolean = true;
  @Output() removeRowChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() addOrUpdateRowChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectedRowChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() closeListChange: EventEmitter<void> = new EventEmitter<void>();

  readonly BUTTON_SPACE: number = 90;
  readonly MAX_ROW_WIDTH: number = 170;
  readonly LIST_PADDING: number = 20;

  headerColumns: string [];
  filterValues: string [];
  rows: Row [];
  filteredRows: Row [];
  sortingColumn: string;

  ngOnInit(): void {
    this.headerColumns = this.getHeaderColumns();
    this.rows = this.listContent.rows;
    this.filteredRows = this.rows;
    this.filterValues = Array(this.headerColumns.length).fill("");
    this.sortingColumn = this.headerColumns[0];
    this.sortRows(this.sortingColumn);
  }

  trackByFn(index: number, item: string) {
    return index;
  }

  closeList(): void {
    this.closeListChange.emit();
  }

  onClickAddOrEditRow(rowIndex?: number): void {
    (rowIndex || rowIndex === 0) ? this.addOrUpdateRowChange.emit(+this.rows[rowIndex].row[0]) : this.addOrUpdateRowChange.emit(-1);
  }

  getHeaderColumns(): string[] {
    return this.listContent.columns.map(column => column.toUpperCase());
  }

  getMaxRowLength(): number {
    return this.getHeaderColumns().length * this.MAX_ROW_WIDTH + 2 * this.BUTTON_SPACE;
  }

  removeRow(rowIndex: number): void {
    if (rowIndex === this.selectedRow) {
      this.selectedRow = -1;
      this.selectedRowChange.emit(-1);
    }
    this.removeRowChange.emit(+this.rows[rowIndex].row[0]);
  }

  onEmitSelected(rowIndex: number): void {
    this.selectedRowChange.emit(+this.rows[rowIndex].row[0]);
    this.selectedRow = rowIndex;
  }


  sortRows(sortingColumn: string): void {
    let indexOfSortingColumn = this.headerColumns
      .findIndex((element) => element === sortingColumn);
    this.rows
      .sort((r1, r2) => {
        let a: string = r1.row[indexOfSortingColumn] ? r1.row[indexOfSortingColumn] : '';
        let b: string = r2.row[indexOfSortingColumn] ? r2.row[indexOfSortingColumn] : '';
        if (!isNaN(+a) && !isNaN(+b) && a.length > 0 && b.length > 0) {
          return +a - +b;
        } else {
          if (b.length > 0 && a.length == 0) {
            return 1;
          } else if (a.length > 0 && b.length == 0) {
            return -1;
          } else if (a > b) {
            return 1;
          } else if (b > a) {
            return -1;
          } else {
            return 0;
          }
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
          if (this.showIdColumn) {
            return each.row[this.filterValues.indexOf(filterValue)].includes(filterValue);
          } else {
            return each.row[this.filterValues.indexOf(filterValue) + 1].includes(filterValue);
          }
        });
      }
    });
  }

  onResetFilter(): void {
    this.filterValues = this.filterValues.map(each => '');
    this.filteredRows = this.rows;
  }
}
