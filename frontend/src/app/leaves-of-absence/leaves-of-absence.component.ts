import {Component} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {LeavesOfAbsenceService} from "./leaves-of-absence.service";
import {LeaveOfAbsence} from "./leave-of-absence.model";

@Component({
  selector: 'leaves-of-absence',
  template: `
      <h1 class="section-header">URLOPY</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./leaves-of-absence.component.scss'],
  providers: [LeavesOfAbsenceService]
})
export class LeavesOfAbsenceComponent {
  loading: boolean = true;
  listContent: ListContent;
  leavesOfAbsence: LeaveOfAbsence [];

  constructor(private leavesOfAbsenceService:LeavesOfAbsenceService){
    this.leavesOfAbsenceService.getLeaves().subscribe(leaves => {
      this.leavesOfAbsence = leaves;
      this.loadListContent();
      this.loading = false;
    })
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko', 'początek', 'koniec'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let leaveOfAbsence of this.leavesOfAbsence) {
      rows.push({
        row: [
          leaveOfAbsence.id,
          leaveOfAbsence.name,
          leaveOfAbsence.surname,
          leaveOfAbsence.startDate,
          leaveOfAbsence.endDate
        ]
      })
    }
    return rows;
  }
}
