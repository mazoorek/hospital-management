import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ListContent, Row} from "./ListContent/list-content.model";

const MAX_ROW_WIDTH: number = 170;

@Component({
  selector: 'list',
  template: `
    <div class="list-header"
         [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
      <div class="list-header-item"
           (click)="sortRows(headerColumn)"
           *ngFor="let headerColumn of headerColumns">
        {{headerColumn}}
        <span *ngIf="headerColumn===sortingColumn">&darr;</span>
      </div>
      <action-button [transparent]="true"></action-button>
    </div>
    <div class="rows"
         [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
      <div class="row" *ngFor="let row of rows; let i = index">
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
  rows: Row [];
  sortingColumn: string = 'ID';

  ngOnInit(): void {
    this.headerColumns = this.getHeaderColumns();
    this.rows = this.listContent.rows;
    this.sortRows(this.sortingColumn);
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
        let a: string = r1.row[indexOfSortingColumn] ? r1.row[indexOfSortingColumn] : '';
        let b: string = r2.row[indexOfSortingColumn] ? r2.row[indexOfSortingColumn] : '';
        if (!isNaN(+a) && !isNaN(+b) && a.length > 0 && b.length > 0) {
          return +a - +b;
        } else {
          if (b.length > 0 && a.length == 0) {
            return 1;
          } else if(a.length > 0 && b.length == 0) {
            return -1;
          } else if (a > b) {
            return 1;
          } else if (b > a ) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    this.sortingColumn = sortingColumn;
  }
}
