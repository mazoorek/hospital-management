import {Component, OnInit} from "@angular/core";
import {ListContent, Row} from "../../common/List/ListContent/list-content.model";
import {RoomsService} from "./rooms.service";
import {Room} from "./room.model";

@Component({
  selector: 'rooms',
  template: `
    <h1 class="section-header">POKOJE</h1>
    <spinner *ngIf="loading"></spinner>
    <list *ngIf="!loading"
          (removeRowChange)="deleteRoom($event)"
          [listContent]="listContent"></list>
  `,
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  rooms: Room [];
  loading: boolean = true;
  listContent: ListContent;

  constructor(private roomsService: RoomsService) {
  }

  ngOnInit(): void {
    this.getRooms();
    this.roomsService.loadRoomsSubject.subscribe(() => {
      this.getRooms();
    });
  }

  loadListContent(): void {
    this.listContent = {
      columns: ['id', 'numer', 'oddziały'],
      rows: this.loadRows()
    }
  }

  loadRows(): Row [] {
    let rows: Row[] = [];
    for (let room of this.rooms) {
      rows.push({
        row: [
          String(room.id),
          String(room.number),
          room.wardName
        ]
      })
    }
    return rows;
  }

  getRooms(): void {
    this.loading = true;
    this.roomsService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
      this.loadListContent();
      this.loading = false;
    });
  }

  deleteRoom(roomId: number): void {
    this.loading = true;
    this.roomsService.deleteRoom(roomId).subscribe(() => {
      this.getRooms();
    });
  }
}
