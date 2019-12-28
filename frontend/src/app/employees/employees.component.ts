import {Component, OnInit} from "@angular/core";
import {EmployeesService} from "./employees.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Employee} from "./employee.model";
import {DoctorsService} from "../doctors/doctors.service";
import {StaffService} from "../staff/staff.service";
import {LeavesOfAbsenceService} from "../leaves-of-absence/leaves-of-absence.service";

@Component({
  selector: 'employees',
  template: `
    <h1 class="section-header">PRACOWNICY</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteEmployee($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  loading: boolean = true;
  listContent: ListContent;
  employees: Employee [];

  constructor(private employeeService: EmployeesService,
              private doctorsService: DoctorsService,
              private staffService: StaffService,
              private leavesOfAbsenceService: LeavesOfAbsenceService) {
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.employeeService.loadEmployeesSubject.subscribe(() => {
      this.loadEmployees();
    });
  }

  private loadEmployees() {
    this.loading = true;
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.loadListContent();
      this.loading = false;
    })
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko', 'typ stanowiska'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let employee of this.employees) {
      rows.push({
        row: [
          String(employee.id),
          employee.name,
          employee.surname,
          employee.type
        ]
      })
    }
    return rows;
  }

  deleteEmployee(employeeId: number): void {
    this.loading = true;
    this.employeeService.deleteEmployee(employeeId).subscribe(() => {
      this.loadEmployees();
      this.doctorsService.loadDoctors();
      this.staffService.loadStaff();
      this.leavesOfAbsenceService.loadLeavesOfAbsence();
    });
  }
}
