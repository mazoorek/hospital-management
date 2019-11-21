import {Component} from "@angular/core";
import {EmployeeService} from "./employee.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Employee} from "./employee.model";

@Component({
  selector: 'employees',
  template: `
      <h1 class="section-header">PRACOWNICY</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./employees.component.scss'],
  providers: [EmployeeService]
})
export class EmployeesComponent {
  loading: boolean = true;
  listContent: ListContent;
  employees: Employee [];

  constructor(private employeeService:EmployeeService){
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.loadListContent();
      this.loading = false;
    })
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let employee of this.employees) {
      rows.push({
        row: [
          employee.id,
          employee.name,
          employee.surname
        ]
      })
    }
    return rows;
  }
}
