import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {SessionDto, StudentDto} from "../../pages/check-presence/check-presence.component";
import {StatusEnum} from "../enum";
import {LastSessionActiveOfProgramDto} from "../models";



@Injectable({
  providedIn: 'root'
})
export class ProgramSessionService {
  private apiUrl = environment.apiUrl+'program-sessions';
  private refreshProgramSession$ = new Subject<void>();

  constructor(private http: HttpClient) { }
  get refreshProgramSession(): Observable<void> {
    return this.refreshProgramSession$.asObservable();
  }
  triggerRefreshProgramSession(): void {
    this.refreshProgramSession$.next();
  }
  getAllSessionOfProgram(pageIndex: number, pageSize: number, programId: string,status:StatusEnum,dateOpen?:Date,dateClose?:Date): Observable<any> {
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('programId', programId)
      .set('status', status)
    ;
    if (dateOpen && dateClose){
      params = params
        .set('dateOpen', dateOpen.toString())
        .set('dateClose', dateClose.toString())
    }
    return this.http.get(`${this.apiUrl}/${programId}/sessions`, { params });
  }
  getLastSessionActive(programId:string): Observable<LastSessionActiveOfProgramDto|null> {
    return this.http.get<LastSessionActiveOfProgramDto|null>(`${this.apiUrl}/${programId}/last-session/active`);
  }
  createProgramSession(programId:String): Observable<LastSessionActiveOfProgramDto> {
    return this.http.post<LastSessionActiveOfProgramDto>(`${this.apiUrl}/${programId}`,null);
  }
  deactivateSession(sessionId:String): Observable<any> {
    return this.http.post(`${this.apiUrl}/deactivate/${sessionId}`,null);
  }
  checkStudent(programSessionId: string,studentId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${programSessionId}/check-student/${studentId}`,null);
  }
  getStudentsNotCheck(sessionId:string): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(`${this.apiUrl}/${sessionId}/studentsNotCheck`);
  }
  getSession(sessionId:string): Observable<SessionDto> {
    return this.http.get<SessionDto>(`${this.apiUrl}/${sessionId}`);
  }
}
