import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {VisitType} from "./appointment-types.model";


@Injectable()
export class AppointmentTypesService {

  readonly OPERATION_TYPES_API_URL: string = '/api/visit-types';

  constructor(private http: HttpClient) {
  }

  getVisitTypes(): Observable<VisitType []> {
    return this.http.get<VisitType []>(this.OPERATION_TYPES_API_URL);
  }

  deleteVisitType(wardId: number): Observable<VisitType>  {
    return this.http.delete<VisitType>(this.OPERATION_TYPES_API_URL+String(wardId));
  }
}
