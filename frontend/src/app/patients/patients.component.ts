import {Component, OnInit} from "@angular/core";
import {PatientsService} from "./patients.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Patient} from "./patients.model";
import {AppointmentsService} from "../appointments/appointments.service";

@Component({
  selector: 'patients',
  template: `
    <h1 class="section-header">PACJENCI</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deletePatient($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients: Patient [];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private patientsService: PatientsService,
              private appointmentsService: AppointmentsService) {
  }

  ngOnInit(): void {
    this.loadPatients();
    this.patientsService.loadPatientsSubject.subscribe(() => {
      this.loadPatients();
    });
  }

  private loadPatients() {
    this.loading = true;
    this.patientsService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'pesel', 'imię', 'nazwisko'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let patient of this.patients) {
      rows.push({
        row: [
          String(patient.id),
          patient.pesel,
          patient.name,
          patient.surname
        ]
      })
    }
    return rows;
  }

  deletePatient(patientId: number): void {
    this.loading = true;
    this.patientsService.deletePatient(patientId).subscribe(() => {
      this.loadPatients();
      this.appointmentsService.loadAppointments();
    });
  }
}
