import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Doctor, DoctorAppointmentRequest} from "./doctor.model";
import {HttpClient} from "@angular/common/http";
import {OperationTypeAppointmentRequest} from "../operation-types/operation-types.model";

@Injectable({providedIn: "root"})
export class DoctorsService {

  readonly DOCTORS_API_URL: string = '/api/doctors';

  loadDoctorsSubject: Subject<void> = new Subject<void>();

  addNewDoctorSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getDoctors(): Observable<Doctor []> {
    return this.http.get<Doctor []>(this.DOCTORS_API_URL);
  }

  insertDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.DOCTORS_API_URL, doctor);
  }

  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(this.DOCTORS_API_URL, doctor);
  }

  deleteDoctor(doctorId: number): Observable<Doctor> {
    return this.http.delete<Doctor>(this.DOCTORS_API_URL + `/${doctorId}`);
  }

  getDoctorAppointments(doctorId: number): Observable<DoctorAppointmentRequest []> {
    return this.http.get<DoctorAppointmentRequest []>(this.DOCTORS_API_URL + `/${doctorId}`+'/appointments');
  }

  loadDoctors(): void {
    this.loadDoctorsSubject.next();
  }

  addNewDoctor(): void {
    this.addNewDoctorSubject.next();
  }
}
