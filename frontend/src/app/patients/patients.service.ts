import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Patient} from "./patient.model";

@Injectable()
export class PatientsService {

  getPatients(): Observable<Patient []> {
    // return this.http.get<Patient []>('/patients');
    return of([
      {
        pesel: '65062089389',
        name: 'Jan',
        surname: 'Kowalski'
      },
      {
        pesel: '93042412373',
        name: 'Jan',
        surname: 'Kowalski'
      },
      {
        pesel: '74092097217',
        name: 'Jan',
        surname: 'Kowalski'
      },
    ]);
  }
}
