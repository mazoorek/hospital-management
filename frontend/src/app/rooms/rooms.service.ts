import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Room} from "./room.model";

@Injectable()
export class RoomsService {
  getRooms(): Observable<Room []> {
    // return this.http.get<Room []>('/rooms');
    return of([
      {
        number: 1,
        hospitalWard: 'Oddział Anestezjologii'
      },
      {
        number: 2,
        hospitalWard: 'Oddział Anestezjologii'
      },
      {
        number: 3,
        hospitalWard: 'Oddział Anestezjologii'
      },
    ]);
  }
}
