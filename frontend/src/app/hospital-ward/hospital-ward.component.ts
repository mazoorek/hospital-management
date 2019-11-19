import {Component} from "@angular/core";
import {HospitalWardComponentService} from "./hospital-ward.component.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";


@Component({
  selector: 'hospital-ward',
  template: `
      <h1 class="section-header">ODDZIAŁY</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./hospital-ward.component.scss'],
  providers: [HospitalWardComponentService]
})
export class HospitalWardComponent {
  hospitalWards: string[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private hospitalWardComponentService: HospitalWardComponentService) {
    this.hospitalWardComponentService.getHospitalWards().subscribe(hospitalWards => {
      this.hospitalWards = hospitalWards;
      this.loadListColumns();
      this.loading = false;
    });
  }

  loadListColumns(): void {
    this.listContent = {
      columns: ['oddziały'],
      rows: this.putIntoRows()
    };
  }

  putIntoRows(): Row [] {
    let rows: Row[] = [];
    for(let hospitalWard of this.hospitalWards) {
      rows.push({row: [hospitalWard]});
    }
    return rows;
  }
}
