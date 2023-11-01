import {Injectable} from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {SessionProgramHistory} from "../models/SessionProgramHistory";
import {BehaviorSubject, catchError, finalize, Observable, of} from "rxjs";
import {ProgramSessionService} from "../services/program-session.service";
import {StatusEnum} from "../enum";

@Injectable({
  providedIn: 'root'
})
export class HistorySessionDataSourceService implements DataSource<SessionProgramHistory>, DataSource<any> {
  public sessionProgramHistorySubject = new BehaviorSubject<SessionProgramHistory[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  constructor(private programSessionService: ProgramSessionService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<SessionProgramHistory[]> {
    return this.sessionProgramHistorySubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.sessionProgramHistorySubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadAllSessionOfProgram(currentPage = 0, pageSize = 10, programId = "", status = StatusEnum.ALL, dateOpen = undefined, dateClose = undefined) {
    this.loadingSubject.next(true);
    this.programSessionService.getAllSessionOfProgram(currentPage, pageSize, programId, status, dateOpen, dateClose)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe(result => {
          this.sessionProgramHistorySubject.next(result.content);
          this.countSubject.next(result.totalElements);
        }
      );
  }
}
