import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Staff} from "./staff.model";


@Injectable({providedIn: "root"})
export class StaffService {

  readonly OPERATION_TYPES_API_URL: string = '/api/staff';

  loadStaffSubject: Subject<void> = new Subject<void>();


  constructor(private http: HttpClient) {
  }

  getStaff(): Observable<Staff []> {
    return this.http.get<Staff []>(this.OPERATION_TYPES_API_URL);
  }

  deleteStaffMember(staffId: number): Observable<Staff> {
    return this.http.delete<Staff>(this.OPERATION_TYPES_API_URL + `/${staffId}`);
  }

  loadStaff(): void {
    this.loadStaffSubject.next();
  }
}
