import {Component} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {RoomsService} from "./rooms.service";
import {Room} from "./room.model";

@Component({
  selector: 'rooms',
  template: `
      <h1 class="section-header">PACJENCI</h1>
      <spinner *ngIf="loading"></spinner>
      <list *ngIf="!loading" [listContent]="listContent"></list>
  `,
  styleUrls: ['./rooms.component.scss'],
  providers: [RoomsService]
})
export class RoomsComponent {
  rooms: Room [];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private roomsService:RoomsService) {
    this.roomsService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
      this.loadListContent();
      this.loading = false;
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['numer', 'oddziały'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let room of this.rooms) {
      rows.push({
        row: [
          String(room.number),
          room.hospitalWard
        ]
      })
    }
    return rows;
  }
}
