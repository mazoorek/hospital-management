import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Patient} from "./patients.model";
import {HttpClient} from "@angular/common/http";
import {Specialization} from "../specializations/specialization.model";

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

  loadPatients(): void {
    this.loadPatientsSubject.next();
  }
}
