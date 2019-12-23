import {Component} from "@angular/core";
import {OperationTypesService} from "./operation-types.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {OperationType} from "./operation-types.model";


@Component({
  selector: 'operation-types',
  template: `
    <h1 class="section-header">TYPY OPERACJI</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./operation-types.component.scss'],
  providers: [OperationTypesService]
})
export class OperationTypesComponent {
  operationTypes: OperationType[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private operationTypesService: OperationTypesService) {
    this.operationTypesService.getOperationTypes().subscribe(operationTypes => {
      this.operationTypes = operationTypes;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'typy operacji, id specjalizacji'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let operationType of this.operationTypes) {
      rows.push({
        row: [
          String(operationType.id),
          operationType.name,
          String(operationType.specializationId),
        ]
      })
    }
    return rows;
  }
}
