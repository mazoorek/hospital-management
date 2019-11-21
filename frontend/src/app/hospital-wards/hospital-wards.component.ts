import {Component} from "@angular/core";
import {HospitalWardsComponentService} from "./hospital-wards.component.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";


@Component({
  selector: 'hospital-wards',
  template: `
      <h1 class="section-header">ODDZIAŁY</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./hospital-wards.component.scss'],
  providers: [HospitalWardsComponentService]
})
export class HospitalWardsComponent {
  hospitalWards: string[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private hospitalWardComponentService: HospitalWardsComponentService) {
    this.hospitalWardComponentService.getHospitalWards().subscribe(hospitalWards => {
      this.hospitalWards = hospitalWards;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['oddziały'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for(let hospitalWard of this.hospitalWards) {
      rows.push({row: [hospitalWard]});
    }
    return rows;
  }
}