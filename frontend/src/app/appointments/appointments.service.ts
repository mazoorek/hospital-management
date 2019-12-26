import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Appointment} from "./appointment.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AppointmentsService {

  readonly APPOINTMENTS_API_URL: string = '/api/appointments';

  constructor(private http: HttpClient) {
  }

  getAppointments(): Observable<Appointment []> {
    return this.http.get<Appointment []>(this.APPOINTMENTS_API_URL);
  }

  deleteAppointment(appointmentId: number): Observable<Appointment> {
    return this.http.delete<Appointment>(this.APPOINTMENTS_API_URL + `/${appointmentId}`);
  }
}
