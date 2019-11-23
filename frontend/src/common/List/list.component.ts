import {Component, Input, OnInit} from "@angular/core";
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
      </div>
      <div class="rows"
           [ngStyle]=" {'width':getHeaderColumns().length>1 ? getMaxRowLength() + '.px': 'unset'}">
          <div class="row" *ngFor="let row of rows">
              <div class="row-item" *ngFor="let rowItem of row.row">
                  {{rowItem}}
              </div>
          </div>
      </div>
  `,
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() listContent: ListContent;

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
    return this.getHeaderColumns().length * MAX_ROW_WIDTH;
  }
}
