import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Page} from "../models/page";
import {ContactInfo} from "../models/contact-info";
import {Program} from "../models/program";
import {StatusEnum} from "../enum";

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private apiUrl = environment.apiUrl+'programs';
  private refreshPrograms$ = new Subject<void>();
  private refreshStudentsInPrograms$ = new Subject<void>();
  private refreshStudentsNotInPrograms$ = new Subject<void>();

  get refreshProgram(): Observable<void> {
    return this.refreshPrograms$.asObservable();
  }
  get refreshStudentsInProgram(): Observable<void> {
    return this.refreshStudentsInPrograms$.asObservable();
  }
  get refreshStudentsNotInProgram(): Observable<void> {
    return this.refreshStudentsNotInPrograms$.asObservable();
  }
  triggerRefreshProgram(): void {
    this.refreshPrograms$.next();
  }
  triggerRefreshStudentsInProgram(): void {
    this.refreshStudentsInPrograms$.next();
  }
  triggerRefreshStudentsNotInProgram(): void {
    this.refreshStudentsNotInPrograms$.next();
  }
  constructor(private http: HttpClient) { }

  getAllPrograms(pageIndex: number, pageSize: number,title:string,levelId:string,teacherId:string,status:StatusEnum): Observable<Page<Program>> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('title', title)
      .set('levelId', levelId)
      .set('teacherId', teacherId)
      .set('status', status)
    ;

    return this.http.get<Page<Program>>(this.apiUrl, { params });
  }
  getProgramById(programId:string): Observable<Program> {
    return this.http.get<Program>(`${this.apiUrl}/${programId}`);
  }
  deleteProgram(id: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/delete/${id}`,null);
  }
  recoverProgram(id: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/recover/${id}`,null);
  }
  addProgram(program: Program): Observable<Program> {
    return this.http.post<Program>(this.apiUrl, program);
  }
  getStudentsInProgram(programId:string): Observable<ContactInfo[]> {
    return this.http.get<ContactInfo[]>(`${this.apiUrl}/${programId}/students`);
  }
  getStudentsNotInProgram(pageIndex: number, pageSize: number, programId: string,searchValue: string): Observable<Page<ContactInfo>> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('search', searchValue)
    ;

    return this.http.get<Page<ContactInfo>>(`${this.apiUrl}/${programId}/studentsNotIn`, { params });
  }
  addStudentToProgram(student:ContactInfo,programId:String): Observable<Program> {
    return this.http.post<Program>(`${this.apiUrl}/${programId}/students`, student);
  }

  deleteStudent(programId: string,studentId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${programId}/students/${studentId}`);
  }
}
