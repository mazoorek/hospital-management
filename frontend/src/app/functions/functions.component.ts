import {Component} from "@angular/core";
import {FunctionsService} from "./functions.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Function} from "./function.model";


@Component({
  selector: 'functions',
  template: `
    <h1 class="section-header">FUNKCJE</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./functions.component.scss'],
  providers: [FunctionsService]
})
export class FunctionsComponent {
  functions: Function[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private operationTypesService: FunctionsService) {
    this.operationTypesService.getFunctions().subscribe(functions => {
      this.functions = functions;
      this.loadListContent();
      this.loading = false;
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
}
