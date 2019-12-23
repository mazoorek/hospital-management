import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Staff} from "./staff.model";


@Injectable()
export class StaffService {

  readonly OPERATION_TYPES_API_URL: string = '/api/staff';

  constructor(private http: HttpClient) {
  }

  getStaff(): Observable<Staff []> {
    return this.http.get<Staff []>(this.OPERATION_TYPES_API_URL);
  }

  deleteStaffMember(staffId: number): Observable<Staff>  {
    return this.http.delete<Staff>(this.OPERATION_TYPES_API_URL+String(staffId));
  }
}
