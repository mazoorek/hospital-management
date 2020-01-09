import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Room} from "./room.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class RoomsService {

  readonly ROOMS_API_URL: string = '/api/rooms';

  loadRoomsSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getRooms(): Observable<Room []> {
    return this.http.get<Room []>(this.ROOMS_API_URL);
  }

  deleteRoom(roomId: number): Observable<Room> {
    return this.http.delete<Room>(this.ROOMS_API_URL + `/${roomId}`);
  }

  insertRoom(appointmentType: Room): Observable<Room> {
    return this.http.post<Room>(this.ROOMS_API_URL, appointmentType);
  }

  updateRoom(appointmentType: Room): Observable<Room> {
    return this.http.put<Room>(this.ROOMS_API_URL, appointmentType);
  }

  loadRooms() {
    this.loadRoomsSubject.next();
  }

}
