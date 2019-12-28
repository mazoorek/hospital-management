import {Component, OnInit} from "@angular/core";
import {AppointmentTypesService} from "./appointment-types.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {AppointmentType} from "./appointment-types.model";
import {AppointmentsService} from "../appointments/appointments.service";


@Component({
  selector: 'appointment-types',
  template: `
    <h1 class="section-header">CHARAKTERY WIZYT</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteAppointmentType($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./appointment-types.component.scss']
})
export class AppointmentTypesComponent implements OnInit {
  appointmentTypes: AppointmentType[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private appointmentTypesService: AppointmentTypesService,
              private appointmentsService: AppointmentsService) {
    this.loadAppointmentTypes();
  }

  ngOnInit(): void {
    this.loadAppointmentTypes();
    this.appointmentTypesService.loadAppointmentTypesSubject.subscribe(() => {
      this.loadAppointmentTypes();
    });
  }

  private loadAppointmentTypes() {
    this.loading = true;
    this.appointmentTypesService.getAppointmentTypes().subscribe(operationTypes => {
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

  deleteAppointmentType(appointmentTypeId: number): void {
    this.loading = true;
    this.appointmentTypesService.deleteAppointmentType(appointmentTypeId).subscribe(() => {
      this.loadAppointmentTypes();
      this.appointmentsService.loadAppointments();
    });
  }
}
