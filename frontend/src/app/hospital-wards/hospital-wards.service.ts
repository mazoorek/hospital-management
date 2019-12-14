import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HospitalWard} from "./hospital-ward.model";


@Injectable()
export class HospitalWardsService {

  constructor(private http: HttpClient) {
  }

  getHospitalWards(): Observable<HospitalWard []> {
    return this.http.get<HospitalWard []>('/api/hospital-wards');
  }

  deleteHospitalWard(wardId: number): Observable<HospitalWard>  {
    return this.http.delete<HospitalWard>('/api/hospital-wards'+String(wardId));
  }
}
