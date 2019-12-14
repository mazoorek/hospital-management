import {Component} from "@angular/core";
import {HospitalWardsService} from "./hospital-wards.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {HospitalWard} from "./hospital-ward.model";


@Component({
  selector: 'hospital-wards',
  template: `
    <h1 class="section-header">ODDZIAŁY</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./hospital-wards.component.scss'],
  providers: [HospitalWardsService]
})
export class HospitalWardsComponent {
  hospitalWards: HospitalWard[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private hospitalWardComponentService: HospitalWardsService) {
    this.hospitalWardComponentService.getHospitalWards().subscribe(hospitalWards => {
      this.hospitalWards = hospitalWards;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'oddziały'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let hospitalWard of this.hospitalWards) {
      rows.push({
        row: [
          String(hospitalWard.id),
          hospitalWard.name,
        ]
      })
    }
    return rows;
  }
}
