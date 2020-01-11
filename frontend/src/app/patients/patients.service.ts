import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Patient, PatientAppointmentRequest} from "./patients.model";
import {HttpClient} from "@angular/common/http";
import {AppointmentTypeAppointmentRequest} from "../appointment-types/appointment-types.model";
import {Doctor} from "../doctors/doctor.model";

@Injectable({providedIn: "root"})
export class PatientsService {

  readonly PATIENTS_API_URL: string = '/api/patients';

  loadPatientsSubject: Subject<void> = new Subject<void>();


  constructor(private http: HttpClient) {
  }

  getPatients(): Observable<Patient []> {
    return this.http.get<Patient []>(this.PATIENTS_API_URL);
  }

  deletePatient(patientId: number): Observable<Patient> {
    return this.http.delete<Patient>(this.PATIENTS_API_URL + `/${patientId}`);
  }

  insertPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.PATIENTS_API_URL, patient);
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(this.PATIENTS_API_URL, patient);
  }

  getPatientAppointments(patientId: number): Observable<PatientAppointmentRequest []> {
    return this.http.get<PatientAppointmentRequest []>(this.PATIENTS_API_URL + `/${patientId}`+'/appointments');
  }

  getPatientDoctors(patientId: number): Observable<Doctor []> {
    return this.http.get<Doctor []>(this.PATIENTS_API_URL + `/${patientId}`+'/doctors');
  }

  loadPatients(): void {
    this.loadPatientsSubject.next();
  }
}
