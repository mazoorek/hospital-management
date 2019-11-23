import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Appointment} from "./appointment.model";

@Injectable()
export class AppointmentsService {
  getAppointments(): Observable<Appointment []> {
    // return this.http.get<Appointment []>('/appointments');
    return of([
      {
        startDate: '01.01.2019-16:00',
        endDate: '01.01.2019-17:00',
        room: 1,
        patientId: 2,
        doctorId: 3,
        character: 'usg'
      },
      {
        startDate: '01.01.2019-16:00',
        endDate: '01.01.2019-17:00',
        room: 1,
        patientId: 2,
        doctorId: 3,
        character: 'usg'
      },
      {
        startDate: '01.01.2019-16:00',
        endDate: '01.01.2019-17:00',
        room: 1,
        patientId: 2,
        doctorId: 3,
        character: 'operacja',
        operationType: 'operacja kolana'
      },
    ]);
  }
}
