import {Component} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {AppointmentsService} from "./appointments.service";
import {Appointment} from "./appointment.model";

@Component({
  selector: 'appointments',
  template: `
      <h1 class="section-header">WIZYTY</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./appointments.component.scss'],
  providers: [AppointmentsService]
})
export class AppointmentsComponent {
  loading: boolean = true;
  listContent: ListContent;
  appointments: Appointment [];

  constructor(private appointmentsService: AppointmentsService) {
    this.appointmentsService.getAppointments().subscribe(doctors => {
      this.appointments = doctors;
      this.loadListContent();
      this.loading = false;
    })
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['początek', 'koniec', 'nr pokoju', 'id pacjenta', 'id lekarza', 'charakter', 'typ operacji'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let appointment of this.appointments) {
      rows.push({
        row: [
          appointment.startDate,
          appointment.endDate,
          String(appointment.room),
          String(appointment.patientId),
          String(appointment.doctorId),
          appointment.character,
          appointment.operationType ? appointment.operationType : '',
        ]
      })
    }
    return rows;
  }
}
