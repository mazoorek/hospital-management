import {Component, Input, OnInit} from "@angular/core";
import {ListContent, Row} from "./ListContent/list-content.model";


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
  @Input() listContent: ListContent;

  headerColumns: string [];
  rows: Row [];

  ngOnInit(): void {
    this.headerColumns = this.getHeaderColumn();
    this.rows = this.listContent.rows;
  }

  getHeaderColumn(): string[] {
    return this.listContent.columns.map(column => column.toUpperCase());
  }
}
