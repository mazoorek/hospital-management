import {Component, OnInit} from "@angular/core";
import {StaffService} from "./staff.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Staff} from "./staff.model";
import {EmployeesService} from "../employees/employees.service";

@Component({
  selector: 'staff',
  template: `
    <h1 class="section-header">PERSONEL</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteStaffMember($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  staff: Staff[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private staffService: StaffService,
              private employeeService: EmployeesService) {
  }

  ngOnInit(): void {
    this.loadStaff();
    this.staffService.loadStaffSubject.subscribe(() => {
      this.loadStaff();
    });
  }

  private loadStaff() {
    this.loading = true;
    this.staffService.getStaff().subscribe(staff => {
      this.staff = staff;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko', 'id pracownika', 'funkcja'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let staff of this.staff) {
      rows.push({
        row: [
          String(staff.id),
          staff.name,
          staff.surname,
          String(staff.employeeId),
          staff.functionName
        ]
      })
    }
    return rows;
  }

  deleteStaffMember(staffMemberId: number): void {
    this.loading = true;
    this.staffService.deleteStaffMember(staffMemberId).subscribe(() => {
      this.loadStaff();
      this.employeeService.loadEmployees();
    });
  }
}
