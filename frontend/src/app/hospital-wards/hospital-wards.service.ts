import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {HospitalWard, HospitalWardDoctorRequest, HospitalWardRoomRequest} from "./hospital-ward.model";
import {Appointment} from "../appointments/appointment.model";


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

  insertHospitalWard(hospitalWard: HospitalWard): Observable<HospitalWard> {
    return this.http.post<HospitalWard>(this.HOSPITAL_WARD_API_URL, hospitalWard);
  }

  updateHospitalWard(hospitalWard: HospitalWard): Observable<HospitalWard> {
    return this.http.put<HospitalWard>(this.HOSPITAL_WARD_API_URL, hospitalWard);
  }

  getHospitalWardAppointments(wardId: number): Observable<Appointment []> {
    return this.http.get<Appointment []>(this.HOSPITAL_WARD_API_URL + `/${wardId}` + '/appointments');
  }

  getHospitalWardRooms(wardId: number): Observable<HospitalWardRoomRequest []> {
    return this.http.get<HospitalWardRoomRequest []>(this.HOSPITAL_WARD_API_URL + `/${wardId}` + '/rooms');
  }

  getHospitalWardDoctors(wardId: number): Observable<HospitalWardDoctorRequest []> {
    return this.http.get<HospitalWardDoctorRequest []>(this.HOSPITAL_WARD_API_URL + `/${wardId}` + '/doctors');
  }

  loadHospitalWards(): void {
    this.loadHospitalWardsSubject.next();
  }
}
