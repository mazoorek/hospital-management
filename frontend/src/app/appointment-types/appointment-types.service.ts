import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {AppointmentType} from "./appointment-types.model";
import {HospitalWard} from "../hospital-wards/hospital-ward.model";


@Injectable({providedIn: "root"})
export class AppointmentTypesService {

  readonly APPOINTMENT_TYPES_API_URL: string = '/api/appointment-types';

  loadAppointmentTypesSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getAppointmentTypes(): Observable<AppointmentType []> {
    return this.http.get<AppointmentType []>(this.APPOINTMENT_TYPES_API_URL);
  }

  deleteAppointmentType(appointmentTypeId: number): Observable<AppointmentType> {
    return this.http.delete<AppointmentType>(this.APPOINTMENT_TYPES_API_URL + `/${appointmentTypeId}`);
  }

  insertAppointmentType(appointmentType: AppointmentType): Observable<AppointmentType> {
    return this.http.post<AppointmentType>(this.APPOINTMENT_TYPES_API_URL, appointmentType);
  }

  updateAppointmentType(appointmentType: AppointmentType): Observable<AppointmentType> {
    return this.http.put<AppointmentType>(this.APPOINTMENT_TYPES_API_URL, appointmentType);
  }

  loadAppointmentTypes(): void {
    this.loadAppointmentTypesSubject.next();
  }
}
