import {Injectable} from "@angular/core";
import {Employee} from "./employee.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class EmployeesService {

  readonly EMPLOYEES_API_URL: string = '/api/employees';

  constructor(private http: HttpClient) {
  }

  getEmployees(): Observable<Employee []> {
    return this.http.get<Employee []>(this.EMPLOYEES_API_URL);
  }

  deleteEmployee(employeeId: number): Observable<Employee> {
    return this.http.delete<Employee>(this.EMPLOYEES_API_URL + `/${employeeId}`);
  }
}
