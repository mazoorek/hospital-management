import {Component} from "@angular/core";
import {StaffService} from "./staff.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Staff} from "./staff.model";

@Component({
  selector: 'staff',
  template: `
    <h1 class="section-header">PERSONEL</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./staff.component.scss'],
  providers: [StaffService]
})
export class StaffComponent {
  staff: Staff[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private operationTypesService: StaffService) {
    this.operationTypesService.getStaff().subscribe(staff => {
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
          staff.function
        ]
      })
    }
    return rows;
  }
}
