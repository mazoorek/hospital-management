import {Component} from "@angular/core";
import {AppointmentTypesService} from "./appointment-types.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {VisitType} from "./appointment-types.model";


@Component({
  selector: 'appointment-types',
  template: `
    <h1 class="section-header">CHARAKTERY WIZYT</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./appointment-types.component.scss'],
  providers: [AppointmentTypesService]
})
export class AppointmentTypesComponent {
  operationTypes: VisitType[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private operationTypesService: AppointmentTypesService) {
    this.operationTypesService.getVisitTypes().subscribe(operationTypes => {
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
