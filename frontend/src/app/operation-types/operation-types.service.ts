import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OperationType} from "./operation-types.model";


@Injectable()
export class OperationTypesService {

  readonly OPERATION_TYPES_API_URL: string = '/api/operation-types';

  constructor(private http: HttpClient) {
  }

  getOperationTypes(): Observable<OperationType []> {
    return this.http.get<OperationType []>(this.OPERATION_TYPES_API_URL);
  }

  deleteOperationType(wardId: number): Observable<OperationType>  {
    return this.http.delete<OperationType>(this.OPERATION_TYPES_API_URL+String(wardId));
  }
}
