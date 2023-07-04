import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SchoolClass} from "../models/school-class";
import {Page} from "../models/page";
import {ContactInfo} from "../models/contact-info";
import {Level} from "../models/level";

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

  getAllClasses(pageIndex: number, pageSize: number): Observable<Page<SchoolClass>> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());

    return this.http.get<Page<SchoolClass>>(this.apiUrl, { params });
  }
  createClass(name: string, image: File): Observable<SchoolClass> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    return this.http.post<SchoolClass>(this.apiUrl, formData);
  }
  deleteClass(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
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
