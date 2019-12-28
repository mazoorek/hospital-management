import {Component, OnInit} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {DoctorsService} from "./doctors.service";
import {Doctor} from "./doctor.model";
import {AppointmentsService} from "../appointments/appointments.service";
import {EmployeesService} from "../employees/employees.service";

@Component({
  selector: 'doctors',
  template: `
    <h1 class="section-header">LEKARZE</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteDoctor($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {

  loading: boolean = true;
  listContent: ListContent;
  doctors: Doctor [];

  constructor(private doctorsService: DoctorsService,
              private appointmentsService: AppointmentsService,
              private employeeService: EmployeesService) {
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.doctorsService.loadDoctorsSubject.subscribe(() => {
      this.loadDoctors();
    });
  }

  private loadDoctors() {
    this.loading = true;
    this.doctorsService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
      this.loadListContent();
      this.loading = false;
    })
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko', 'id pracownika', 'specjalizacja', 'oddział'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let doctor of this.doctors) {
      rows.push({
        row: [
          String(doctor.id),
          doctor.name,
          doctor.surname,
          String(doctor.employeeId),
          doctor.specializationName,
          doctor.wardName
        ]
      })
    }
    return rows;
  }

  deleteDoctor(doctorId: number): void {
    this.loading = true;
    this.doctorsService.deleteDoctor(doctorId).subscribe(() => {
      this.loadDoctors();
      this.appointmentsService.loadAppointments();
      this.employeeService.loadEmployees();
    });
  }
}
