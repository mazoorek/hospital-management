import {Component} from "@angular/core";
import {HospitalWardComponentService} from "./hospital-ward.component.service";
import {ListColumn} from "../../common/List/ListContent/list-content.model";


@Component({
  selector: 'hospital-ward',
  template: `
      <h1 class="section-header">ODDZIAŁY</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listColumns]="listColumns"></list>
  `,
  styleUrls: ['./hospital-ward.component.scss'],
  providers: [HospitalWardComponentService]
})
export class HospitalWardComponent {
  hospitalWards: string[];
  loading: boolean = true;
  listColumns: ListColumn [];

  constructor(private hospitalWardComponentService: HospitalWardComponentService) {
    this.hospitalWardComponentService.getHospitalWards().subscribe(hospitalWards => {
      this.hospitalWards = hospitalWards;
      this.loadListColumns();
      this.loading = false;
    });
  }

  loadListColumns(): void {
    this.listColumns = [{
      name: 'oddziały',
      content: this.hospitalWards
    }];
  }
}
