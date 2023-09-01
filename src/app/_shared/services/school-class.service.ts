import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SchoolClass,Page,Level} from "../models";
import {StatusEnum} from "../enum";

@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {
  private apiUrl = environment.apiUrl+'classes';

  private refreshSchoolClass$ = new Subject<void>();
  private refreshLevels$ = new Subject<void>();

  get refreshSchoolClass(): Observable<void> {
    return this.refreshSchoolClass$.asObservable();
  }
  get refreshLevels(): Observable<void> {
    return this.refreshLevels$.asObservable();
  }
  triggerRefreshSchoolClass(): void {
    this.refreshSchoolClass$.next();
  }
  triggerRefreshLevels(): void {
    this.refreshLevels$.next();
  }
  constructor(private http: HttpClient) { }

  getAllClasses(pageIndex: number, pageSize: number, searchValue: string,status:StatusEnum): Observable<Page<SchoolClass>> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('search', searchValue)
      .set('status', status);

    return this.http.get<Page<SchoolClass>>(this.apiUrl, { params });
  }
  createClass(schoolClass:SchoolClass): Observable<SchoolClass> {
    return this.http.post<SchoolClass>(this.apiUrl, schoolClass);
  }
  deleteClass(id: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/delete/${id}`,null);
  }
  recoverClass(id: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/recover/${id}`,null);
  }
  getLevelsBySchoolClass(schoolClassId: string, page: number, size: number): Observable<Page<Level>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Level>>(`${this.apiUrl}/${schoolClassId}/levels`, { params });
  }

  addLevelToSchoolClass(schoolClassId: string, levelRequest: Level): Observable<Level> {
    return this.http.post<Level>(`${this.apiUrl}/${schoolClassId}/levels`, levelRequest);
  }
}
