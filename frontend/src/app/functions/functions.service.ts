import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Function} from "./function.model";


@Injectable()
export class FunctionsService {

  readonly FUNCTIONS_API_URL: string = '/api/functions';

  constructor(private http: HttpClient) {
  }

  getFunctions(): Observable<Function []> {
    return this.http.get<Function []>(this.FUNCTIONS_API_URL);
  }

  deleteFunction(functionId: number): Observable<Function> {
    return this.http.delete<Function>(this.FUNCTIONS_API_URL + `/${functionId}`);
  }
}
