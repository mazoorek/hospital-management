import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Doctor} from "./doctor.model";

@Injectable()
export class DoctorsService {
  getDoctors(): Observable<Doctor []> {
    // return this.http.get<Doctor []>('/doctors');
    return of([
      {
        id: '1',
        specialization: 'kardiochirurgia'
      },
      {
        id: '2',
        specialization: 'kardiochirurgia'
      },
      {
        id: '3',
        specialization: 'kardiochirurgia'
      },
    ]);
  }
}
