import {Component} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {DoctorsService} from "./doctors.service";
import {Doctor} from "./doctor.model";

@Component({
  selector: 'doctors',
  template: `
      <h1 class="section-header">LEKARZE</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./doctors.component.scss'],
  providers: [DoctorsService]
})
export class DoctorsComponent {
  loading: boolean = true;
  listContent: ListContent;
  doctors: Doctor [];

  constructor(private doctorsService:DoctorsService){
    this.doctorsService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
      this.loadListContent();
      this.loading = false;
    })
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'imię', 'nazwisko', 'specjalizacja'],
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
          doctor.specialization
        ]
      })
    }
    return rows;
  }
}
