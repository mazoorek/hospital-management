import {Component, Input, OnInit} from "@angular/core";
import {ListColumn} from "./ListContent/list-content.model";

export interface Row {
  row: string [];
}

@Component({
  selector: 'list',
  template: `
      <div class="list-header">
          <div class="list-header-item" *ngFor="let headerColumn of headerColumns">
              {{headerColumn}}
          </div>
      </div>
      <div class="rows">
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
  @Input() listColumns: ListColumn [];

  headerColumns: string [];
  rows: Row [];

  ngOnInit(): void {
    this.headerColumns = this.getHeaderColumn();
    this.rows = this.getRows();
  }

  getHeaderColumn(): string[] {
    return this.listColumns.map(listColumn => listColumn.name.toUpperCase());
  }

  getRows(): Row[] {
    let rows: Row[] = [];
    let row: string[] = [];
    let numberOfRows = this.listColumns[0].content.length;
    for (let i = 0; i < numberOfRows; i++) {
      row = [];
      for (let j = 0; j < this.listColumns.length; j++) {
        row.push(this.listColumns[j].content[i]);
      }
      rows.push({row: row});
    }
    return rows;
  }
}
