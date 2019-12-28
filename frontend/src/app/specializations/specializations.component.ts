import {Component, OnInit} from "@angular/core";
import {SpecializationsService} from "./specializations.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {Specialization} from "./specialization.model";
import {DoctorsService} from "../doctors/doctors.service";
import {OperationTypesService} from "../operation-types/operation-types.service";
import {AppointmentTypesService} from "../appointment-type/appointment-types.service";


@Component({
  selector: 'specializations',
  template: `
    <h1 class="section-header">SPECJALIZACJE</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteSpecializations($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./specializations.component.scss']
})
export class SpecializationsComponent implements OnInit {
  specializations: Specialization[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(
    private specializationsService: SpecializationsService,
    private doctorsService: DoctorsService,
    private operationTypesService: OperationTypesService,
    private appointmentTypesService: AppointmentTypesService) {
  }

  ngOnInit(): void {
    this.loadSpecializations();
    this.specializationsService.loadSpecializationsSubject.subscribe(() => {
      this.loadSpecializations();
    });
  }

  private loadSpecializations() {
    this.loading = true;
    this.specializationsService.getSpecializations().subscribe(specializations => {
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

  deleteSpecializations(specializationId: number): void {
    this.loading = true;
    this.specializationsService.deleteSpecialization(specializationId).subscribe(() => {
      this.loadSpecializations();
      this.doctorsService.loadDoctors();
      this.operationTypesService.loadOperationTypes();
      this.appointmentTypesService.loadAppointmentTypes();
    });
  }
}
