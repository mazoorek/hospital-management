import {Injectable} from "@angular/core";
import {Employee, LeaveOfAbsenceRequest} from "./employee.model";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {OperationTypeAppointmentRequest} from "../operation-types/operation-types.model";

@Injectable({providedIn: "root"})
export class EmployeesService {

  readonly EMPLOYEES_API_URL: string = '/api/employees';

  loadEmployeesSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getEmployees(): Observable<Employee []> {
    return this.http.get<Employee []>(this.EMPLOYEES_API_URL);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.EMPLOYEES_API_URL, employee);
  }

  deleteEmployee(employeeId: number): Observable<Employee> {
    return this.http.delete<Employee>(this.EMPLOYEES_API_URL + `/${employeeId}`);
  }

  getEmployeeLeavesOfAbsence(employeeId: number): Observable<LeaveOfAbsenceRequest []> {
    return this.http.get<LeaveOfAbsenceRequest []>(this.EMPLOYEES_API_URL + `/${employeeId}`+'/leaves-of-absence');
  }

  loadEmployees(): void {
    this.loadEmployeesSubject.next();
  }
}
