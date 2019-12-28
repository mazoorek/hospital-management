import {Component, OnInit} from "@angular/core";
import {FunctionsService} from "./functions.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Function} from "./function.model";
import {StaffService} from "../staff/staff.service";


@Component({
  selector: 'functions',
  template: `
    <h1 class="section-header">FUNKCJE</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteFunctions($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./functions.component.scss']
})
export class FunctionsComponent implements OnInit{
  functions: Function[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private functionsService: FunctionsService,
              private staffService: StaffService) {
  }

  ngOnInit(): void {
   this.loadFunctions();
    this.functionsService.loadFunctionsSubject.subscribe(() => {
      this.loadFunctions();
    });
  }

  private loadFunctions() {
    this.loading = true;
    this.functionsService.getFunctions().subscribe(functions => {
      this.functions = functions;
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
    for (let hospitalFunction of this.functions) {
      rows.push({
        row: [
          String(hospitalFunction.id),
          hospitalFunction.name,
        ]
      })
    }
    return rows;
  }

  deleteFunctions(functionsId: number): void {
    this.loading = true;
    this.functionsService.deleteFunction(functionsId).subscribe(() => {
      this.loadFunctions();
      this.staffService.loadStaff();
    });
  }
}
