import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {LeaveOfAbsence} from "./leave-of-absence.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class LeavesOfAbsenceService {

  readonly LEAVES_API_URL: string = '/api/leaves-of-absence';

  loadLeavesOfAbsenceSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getLeavesOfAbsence(): Observable<LeaveOfAbsence []> {
    return this.http.get<LeaveOfAbsence []>(this.LEAVES_API_URL);
  }

  deleteLeaveOfAbsence(leaveId: number): Observable<LeaveOfAbsence> {
    return this.http.delete<LeaveOfAbsence>(this.LEAVES_API_URL + `/${leaveId}`);
  }

  loadLeavesOfAbsence(): void {
    this.loadLeavesOfAbsenceSubject.next();
  }
}
