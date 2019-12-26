import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Patient} from "./patients.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class PatientsService {

  readonly PATIENTS_API_URL: string = '/api/patients';

  constructor(private http: HttpClient) {
  }

  getPatients(): Observable<Patient []> {
    return this.http.get<Patient []>(this.PATIENTS_API_URL);
  }

  deletePatient(patientId: number): Observable<Patient> {
    return this.http.delete<Patient>(this.PATIENTS_API_URL + `/${patientId}`);
  }
}
