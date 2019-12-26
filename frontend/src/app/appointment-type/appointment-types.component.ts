import {Component} from "@angular/core";
import {AppointmentTypesService} from "./appointment-types.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {AppointmentType} from "./appointment-types.model";


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
  appointmentTypes: AppointmentType[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private operationTypesService: AppointmentTypesService) {
    this.operationTypesService.getAppointmentTypes().subscribe(operationTypes => {
      this.appointmentTypes = operationTypes;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'charakter wizyty', 'nazwa specjalizacji'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let appointmentType of this.appointmentTypes) {
      rows.push({
        row: [
          String(appointmentType.id),
          appointmentType.type,
          String(appointmentType.specializationName),
        ]
      })
    }
    return rows;
  }
}
