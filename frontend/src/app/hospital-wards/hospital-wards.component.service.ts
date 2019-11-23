import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";

@Injectable()
export class HospitalWardsComponentService {

  constructor(private http: HttpClient) {
  }

  getHospitalWards(): Observable<string []> {
    // return this.http.get<string []>('/hospital-wards');
    return of([
      'Oddział Anestezjologii',
      'Oddział Chirurgii Ogólnej',
      'Oddział Onkologiczny',
      'Oddział Kardiologiczny',
      'Oddział Pediatryczny'
    ]);
  }
}
