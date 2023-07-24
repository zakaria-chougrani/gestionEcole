import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Page} from "../models/page";
import {Program} from "../models/program";
import {ProgramSession} from "../models/program-session";
import {ContactInfo} from "../models/contact-info";
import {SessionDto, StudentDto} from "../../pages/check-presence/check-presence.component";

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

  getLastSessionActive(programId:string): Observable<ProgramSession|null> {
    return this.http.get<ProgramSession|null>(`${this.apiUrl}/${programId}/last-session/active`);
  }
  createProgramSession(programId:String): Observable<ProgramSession> {
    return this.http.post<ProgramSession>(`${this.apiUrl}/${programId}`,null);
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
