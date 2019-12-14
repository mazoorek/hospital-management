import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ListContent, Row} from "./ListContent/list-content.model";

const MAX_ROW_WIDTH: number = 170;

@Component({
  selector: 'list',
  template: `
    <div class="list-header"
         [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
      <div class="list-header-item" *ngFor="let headerColumn of headerColumns">
        {{headerColumn}}
      </div>
      <action-button [hidden]="true"></action-button>
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

  ngOnInit(): void {
    this.headerColumns = this.getHeaderColumns();
    this.rows = this.listContent.rows;
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
}
