import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {HospitalWard} from "./hospital-ward.model";

@Injectable()
export class HospitalWardsComponentService {

  constructor(private http: HttpClient) {
  }

  getHospitalWards(): Observable<HospitalWard []> {
    return this.http.get<HospitalWard []>('/api/hospital-wards');
    // return of([
    //   'Oddział Anestezjologii',
    //   'Oddział Chirurgii Ogólnej',
    //   'Oddział Onkologiczny',
    //   'Oddział Kardiologiczny',
    //   'Oddział Pediatryczny'
    // ]);
  }
}
