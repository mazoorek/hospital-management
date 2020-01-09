import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Appointment} from "./appointment.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class AppointmentsService {

  readonly APPOINTMENTS_API_URL: string = '/api/appointments';

  loadAppointmentsSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getAppointments(): Observable<Appointment []> {
    return this.http.get<Appointment []>(this.APPOINTMENTS_API_URL);
  }

  deleteAppointment(appointmentId: number): Observable<Appointment> {
    return this.http.delete<Appointment>(this.APPOINTMENTS_API_URL + `/${appointmentId}`);
  }

  insertAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.APPOINTMENTS_API_URL, appointment);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(this.APPOINTMENTS_API_URL, appointment);
  }

  loadAppointments(): void {
    this.loadAppointmentsSubject.next();
  }
}
