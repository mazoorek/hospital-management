import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {OperationType} from "./operation-types.model";
import {AppointmentType} from "../appointment-types/appointment-types.model";


@Injectable({providedIn: "root"})
export class OperationTypesService {

  readonly OPERATION_TYPES_API_URL: string = '/api/operation-types';

  loadOperationTypesSubject: Subject<void> = new Subject<void>();


  constructor(private http: HttpClient) {
  }

  getOperationTypes(): Observable<OperationType []> {
    return this.http.get<OperationType []>(this.OPERATION_TYPES_API_URL);
  }

  deleteOperationType(operationTypeId: number): Observable<OperationType> {
    return this.http.delete<OperationType>(this.OPERATION_TYPES_API_URL + `/${operationTypeId}`);
  }

  insertOperationType(operationType: OperationType): Observable<OperationType> {
    return this.http.post<OperationType>(this.OPERATION_TYPES_API_URL, operationType);
  }

  updateOperationType(operationType: OperationType): Observable<OperationType> {
    return this.http.put<OperationType>(this.OPERATION_TYPES_API_URL, operationType);
  }

  loadOperationTypes(): void {
    this.loadOperationTypesSubject.next();
  }
}
