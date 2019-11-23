import {Injectable} from "@angular/core";
import {Employee} from "./employee.model";
import {Observable, of} from "rxjs";

@Injectable()
export class EmployeesService {
  getEmployees(): Observable<Employee []> {
    // return this.http.get<Employee []>('/employees');
    return of([
      {
        id: '1',
        name: 'Jan',
        surname: 'Kowalski'
      },
      {
        id: '2',
        name: 'Jan',
        surname: 'Kowalski'
      },
      {
        id: '3',
        name: 'Jan',
        surname: 'Kowalski'
      },
    ]);
  }
}
