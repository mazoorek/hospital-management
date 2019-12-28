import {Component, OnInit} from "@angular/core";
import {OperationTypesService} from "./operation-types.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {OperationType} from "./operation-types.model";
import {AppointmentsService} from "../appointments/appointments.service";


@Component({
  selector: 'operation-types',
  template: `
    <h1 class="section-header">TYPY OPERACJI</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteOperationTypes($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./operation-types.component.scss']
})
export class OperationTypesComponent implements OnInit{
  operationTypes: OperationType[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private operationTypesService: OperationTypesService,
              private appointmentsService: AppointmentsService) {
  }

  ngOnInit(): void {
    this.loadOperationTypes();
    this.operationTypesService.loadOperationTypesSubject.subscribe(() => {
      this.loadOperationTypes();
    });
  }

  private loadOperationTypes() {
    this.loading = true;
    this.operationTypesService.getOperationTypes().subscribe(operationTypes => {
      this.operationTypes = operationTypes;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'typy operacji', 'nazwa specjalizacji'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let operationType of this.operationTypes) {
      rows.push({
        row: [
          String(operationType.id),
          operationType.type,
          operationType.specializationName,
        ]
      })
    }
    return rows;
  }

  deleteOperationTypes(operationTypesId: number): void {
    this.loading = true;
    this.operationTypesService.deleteOperationType(operationTypesId).subscribe(() => {
      this.loadOperationTypes();
      this.appointmentsService.loadAppointments();
    });
  }
}
