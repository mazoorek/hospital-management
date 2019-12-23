import {Component} from "@angular/core";
import {SpecializationsService} from "./specializations.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Specialization} from "./specialization.model";


@Component({
  selector: 'specializations',
  template: `
    <h1 class="section-header">SPECJALIZACJE</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./specializations.component.scss'],
  providers: [SpecializationsService]
})
export class SpecializationsComponent {
  specializations: Specialization[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private operationTypesService: SpecializationsService) {
    this.operationTypesService.getSpecializations().subscribe(specializations => {
      this.specializations = specializations;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'nazwa'],
      rows: this.loadRows()
    };
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let specialization of this.specializations) {
      rows.push({
        row: [
          String(specialization.id),
          specialization.name,
        ]
      })
    }
    return rows;
  }
}
