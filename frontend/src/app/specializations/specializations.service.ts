import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Specialization} from "./specialization.model";


@Injectable({providedIn: "root"})
export class SpecializationsService {

  readonly SPECIALIZATIONS_API_URL: string = '/api/specializations';

  loadSpecializationsSubject: Subject<void> = new Subject<void>();


  constructor(private http: HttpClient) {
  }

  getSpecializations(): Observable<Specialization []> {
    return this.http.get<Specialization []>(this.SPECIALIZATIONS_API_URL);
  }

  deleteSpecialization(specializationId: number): Observable<Specialization> {
    return this.http.delete<Specialization>(this.SPECIALIZATIONS_API_URL + `/${specializationId}`);
  }

  insertSpecialization(specialization: Specialization): Observable<Specialization> {
    return this.http.post<Specialization>(this.SPECIALIZATIONS_API_URL, specialization);
  }

  updateSpecialization(specialization: Specialization): Observable<Specialization> {
    return this.http.put<Specialization>(this.SPECIALIZATIONS_API_URL, specialization);
  }

  loadSpecializations(): void {
    this.loadSpecializationsSubject.next();
  }
}
