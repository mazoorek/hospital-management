import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Function} from "./function.model";


@Injectable({providedIn: "root"})
export class FunctionsService {

  readonly FUNCTIONS_API_URL: string = '/api/functions';

  loadFunctionsSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getFunctions(): Observable<Function []> {
    return this.http.get<Function []>(this.FUNCTIONS_API_URL);
  }

  deleteFunction(functionId: number): Observable<Function> {
    return this.http.delete<Function>(this.FUNCTIONS_API_URL + `/${functionId}`);
  }

  insertFunction(func: Function): Observable<Function> {
    return this.http.post<Function>(this.FUNCTIONS_API_URL, func);
  }

  updateFunction(func: Function): Observable<Function> {
    return this.http.put<Function>(this.FUNCTIONS_API_URL, func);
  }

  loadFunctions(): void {
    this.loadFunctionsSubject.next();
  }
}
