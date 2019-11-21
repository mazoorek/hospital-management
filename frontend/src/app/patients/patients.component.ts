import {Component} from "@angular/core";
import {PatientsService} from "./patients.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Patient} from "./patients.model";

@Component({
  selector: 'patients',
  template: `
      <h1 class="section-header">PACJENCI</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./patients.component.scss'],
  providers: [PatientsService]
})
export class PatientsComponent {
  patients: Patient [];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private patientsService: PatientsService) {
    this.patientsService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['pesel', 'imię', 'nazwisko'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let patient of this.patients) {
      rows.push({
        row: [
          patient.pesel,
          patient.name,
          patient.surname
        ]
      })
    }
    return rows;
  }
}
