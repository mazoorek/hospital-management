import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Doctor} from "./doctor.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class DoctorsService {

  readonly DOCTORS_API_URL: string = '/api/doctors';

  loadDoctorsSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getDoctors(): Observable<Doctor []> {
    return this.http.get<Doctor []>(this.DOCTORS_API_URL);
  }

  deleteDoctor(doctorId: number): Observable<Doctor> {
    return this.http.delete<Doctor>(this.DOCTORS_API_URL + `/${doctorId}`);
  }

  loadDoctors(): void {
    this.loadDoctorsSubject.next();
  }
}
