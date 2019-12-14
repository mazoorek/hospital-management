import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Room} from "./room.model";
import {HttpClient} from "@angular/common/http";
import {HospitalWard} from "../hospital-wards/hospital-ward.model";

@Injectable()
export class RoomsService {

  constructor(private http: HttpClient) {
  }

  getRooms(): Observable<Room []> {
    return this.http.get<Room []>('/api/rooms');
  }

  deleteRoom(roomId: number): Observable<Room>  {
    return this.http.delete<Room>('/api/rooms/'+String(roomId));
  }
}
