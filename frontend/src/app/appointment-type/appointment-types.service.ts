import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {AppointmentType} from "./appointment-types.model";


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

  loadAppointmentTypes(): void {
    this.loadAppointmentTypesSubject.next();
  }
}
