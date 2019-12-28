import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {HospitalWard} from "./hospital-ward.model";


@Injectable({providedIn: "root"})
export class HospitalWardsService {

  readonly HOSPITAL_WARD_API_URL: string = '/api/hospital-wards';

  loadHospitalWardsSubject: Subject<void> = new Subject<void>();


  constructor(private http: HttpClient) {
  }

  getHospitalWards(): Observable<HospitalWard []> {
    return this.http.get<HospitalWard []>(this.HOSPITAL_WARD_API_URL);
  }

  deleteHospitalWard(wardId: number): Observable<HospitalWard> {
    return this.http.delete<HospitalWard>(this.HOSPITAL_WARD_API_URL + `/${wardId}`);
  }

  loadHospitalWards(): void {
    this.loadHospitalWardsSubject.next();
  }
}
