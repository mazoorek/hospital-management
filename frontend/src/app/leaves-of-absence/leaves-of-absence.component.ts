import {Component, OnInit} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {LeavesOfAbsenceService} from "./leaves-of-absence.service";
import {LeaveOfAbsence} from "./leave-of-absence.model";

@Component({
  selector: 'leaves-of-absence',
  template: `
    <h1 class="section-header">URLOPY</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteLeaveOfAbsence($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./leaves-of-absence.component.scss']
})
export class LeavesOfAbsenceComponent implements OnInit {
  loading: boolean = true;
  listContent: ListContent;
  leavesOfAbsence: LeaveOfAbsence [];

  constructor(private leavesOfAbsenceService: LeavesOfAbsenceService) {
  }

  ngOnInit(): void {
    this.loadLeavesOfAbsence();
    this.leavesOfAbsenceService.loadLeavesOfAbsenceSubject.subscribe(() => {
      this.loadLeavesOfAbsence();
    });
  }

  private loadLeavesOfAbsence() {
    this.loading = true;
    this.leavesOfAbsenceService.getLeavesOfAbsence().subscribe(leaves => {
      this.leavesOfAbsence = leaves.map(leave => ({
        ...leave,
        startDate: new Date(leave.startDate).toLocaleString(),
        endDate: new Date(leave.endDate).toLocaleString()
      }));
      this.loadListContent();
      this.loading = false;
    })
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'id pracownika', 'imię', 'nazwisko', 'początek', 'koniec'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let leaveOfAbsence of this.leavesOfAbsence) {
      rows.push({
        row: [
          leaveOfAbsence.id,
          leaveOfAbsence.employeeId,
          leaveOfAbsence.name,
          leaveOfAbsence.surname,
          leaveOfAbsence.startDate,
          leaveOfAbsence.endDate
        ]
      })
    }
    return rows;
  }

  deleteLeaveOfAbsence(leaveOfAbsence: number): void {
    this.loading = true;
    this.leavesOfAbsenceService.deleteLeaveOfAbsence(leaveOfAbsence).subscribe(() => {
      this.loadLeavesOfAbsence();
    });
  }
}
