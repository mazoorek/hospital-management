import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Room} from "./room.model";
import {HttpClient} from "@angular/common/http";

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
