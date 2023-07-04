import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Page} from "../models/page";
import {ContactInfo} from "../models/contact-info";
import {Program} from "../models/program";

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private apiUrl = environment.apiUrl+'programs';
  private refreshPrograms$ = new Subject<void>();

  get refreshProgram(): Observable<void> {
    return this.refreshPrograms$.asObservable();
  }
  triggerRefreshProgram(): void {
    this.refreshPrograms$.next();
  }
  constructor(private http: HttpClient) { }

  getAllPrograms(pageIndex: number, pageSize: number,title:string,levelId:string,teacherId:string): Observable<Page<Program>> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('title', title)
      .set('levelId', levelId)
      .set('teacherId', teacherId)
    ;

    return this.http.get<Page<Program>>(this.apiUrl, { params });
  }
  deleteProgram(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  addProgram(program: Program): Observable<Program> {
    return this.http.post<Program>(this.apiUrl, program);
  }

  addStudentToProgram(student:ContactInfo,programId:String): Observable<Program> {
    return this.http.post<Program>(`${this.apiUrl}/${programId}/students`, student);
  }
}
