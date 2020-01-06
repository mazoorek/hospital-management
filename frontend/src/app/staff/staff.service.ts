import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Staff} from "./staff.model";


@Injectable({providedIn: "root"})
export class StaffService {

  readonly STAFF_API_URL: string = '/api/staff';

  loadStaffSubject: Subject<void> = new Subject<void>();

  addNewStaffMemberSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getStaff(): Observable<Staff []> {
    return this.http.get<Staff []>(this.STAFF_API_URL);
  }

  insertStaff(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.STAFF_API_URL, staff);
  }

  updateStaff(staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(this.STAFF_API_URL, staff);
  }

  deleteStaffMember(staffId: number): Observable<Staff> {
    return this.http.delete<Staff>(this.STAFF_API_URL + `/${staffId}`);
  }

  loadStaff(): void {
    this.loadStaffSubject.next();
  }

  addNewStaffMember(): void {
    this.addNewStaffMemberSubject.next();
  }
}
