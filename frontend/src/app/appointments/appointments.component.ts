import {Component, OnInit} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {AppointmentsService} from "./appointments.service";
import {Appointment} from "./appointment.model";

@Component({
  selector: 'appointments',
  template: `
    <h1 class="section-header">WIZYTY</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteAppointment($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  loading: boolean = true;
  listContent: ListContent;
  appointments: Appointment [];

  constructor(private appointmentsService: AppointmentsService) {
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.appointmentsService.loadAppointmentsSubject.subscribe(() => {
      this.loadAppointments();
    });
  }

  private loadAppointments() {
    this.loading = true;
    this.appointmentsService.getAppointments().subscribe(doctors => {
      this.appointments = doctors;
      this.loadListContent();
      this.loading = false;
    })
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'data początku', 'data końca', 'id pokoju', 'pesel', 'id lekarza', 'charakter', 'typ operacji'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let appointment of this.appointments) {
      rows.push({
        row: [
          appointment.id,
          appointment.startDate,
          appointment.endDate,
          appointment.roomId,
          appointment.pesel,
          appointment.doctorId,
          appointment.appointmentType,
          appointment.operationType ? appointment.operationType : '',
        ]
      })
    }
    return rows;
  }

  deleteAppointment(appointmentId: number): void {
    this.loading = true;
    this.appointmentsService.deleteAppointment(appointmentId).subscribe(() => {
      this.loadAppointments();
    });
  }
}
