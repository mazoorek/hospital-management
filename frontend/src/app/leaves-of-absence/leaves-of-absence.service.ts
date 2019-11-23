import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {LeaveOfAbsence} from "./leave-of-absence.model";

@Injectable()
export class LeavesOfAbsenceService {
  getLeaves(): Observable<LeaveOfAbsence []> {
    // return this.http.get<LeaveOfAbsence []>('/leaves');
    return of([
      {
        id: '1',
        name: 'Jan',
        surname: 'Kowalski',
        startDate: '01.01.2020',
        endDate: '07.01.2020'
      },
      {
        id: '2',
        name: 'Jan',
        surname: 'Kowalski',
        startDate: '01.01.2020',
        endDate: '07.01.2020'
      },
      {
        id: '3',
        name: 'Jan',
        surname: 'Kowalski',
        startDate: '01.01.2020',
        endDate: '07.01.2020'
      },
    ]);
  }
}
