import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Room} from "./room.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class RoomsService {

  readonly ROOMS_API_URL: string = '/api/rooms';

  constructor(private http: HttpClient) {
  }

  getRooms(): Observable<Room []> {
    return this.http.get<Room []>(this.ROOMS_API_URL);
  }

  deleteRoom(roomId: number): Observable<Room> {
    return this.http.delete<Room>(this.ROOMS_API_URL + `/${roomId}`);
  }
}
