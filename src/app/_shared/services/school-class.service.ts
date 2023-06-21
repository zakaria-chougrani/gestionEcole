import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SchoolClass} from "../models/school-class";
import {Page} from "../models/page";
import {ContactInfo} from "../models/contact-info";

@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {
  private apiUrl = environment.apiUrl+'classes';

  private refreshSchoolClass$ = new Subject<void>();

  get refreshSchoolClass(): Observable<void> {
    return this.refreshSchoolClass$.asObservable();
  }
  triggerRefreshSchoolClass(): void {
    this.refreshSchoolClass$.next();
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
}
