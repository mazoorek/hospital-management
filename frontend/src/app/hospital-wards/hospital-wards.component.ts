import {Component, OnInit} from "@angular/core";
import {HospitalWardsService} from "./hospital-wards.service";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {HospitalWard} from "./hospital-ward.model";
import {RoomsService} from "../rooms/rooms.service";
import {DoctorsService} from "../doctors/doctors.service";


@Component({
  selector: 'hospital-wards',
  template: `
    <h1 class="section-header">ODDZIAŁY</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteHospitalWard($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./hospital-wards.component.scss']
})
export class HospitalWardsComponent implements OnInit {
  hospitalWards: HospitalWard[];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private hospitalWardsService: HospitalWardsService,
              private roomsService: RoomsService,
              private doctorsService: DoctorsService) {
    this.loadHospitalWards();
  }

  ngOnInit(): void {
    this.loadHospitalWards();
    this.hospitalWardsService.loadHospitalWardsSubject.subscribe(() => {
      this.loadHospitalWards();
    });
  }

  loadHospitalWards() {
    this.hospitalWardsService.getHospitalWards().subscribe(hospitalWards => {
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

  deleteHospitalWard(wardId: number): void {
    this.loading = true;
    this.hospitalWardsService.deleteHospitalWard(wardId).subscribe(() => {
      this.loadHospitalWards();
      this.roomsService.loadRooms();
      this.doctorsService.loadDoctors();
    });
  }
}
