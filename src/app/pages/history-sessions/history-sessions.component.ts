import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {ProgramSessionService} from "../../_shared/services/program-session.service";
import {StatusEnum} from "../../_shared/enum";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {HistorySessionDataSourceService} from "../../_shared/datasource/history-session-data-source.service";
import {tap} from "rxjs";
import * as moment from 'moment';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ProgramService} from "../../_shared/services/program.service";
import {ProgramDto} from "../../_shared/models";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
  StudentPresenceListDialogComponent
} from "../../dialog/student-presence-list-dialog/student-presence-list-dialog.component";

@Component({
  selector: 'ec-history-sessions',
  standalone: true,
  imports: [CommonModule, FlexModule, MatButtonModule, MatChipsModule, MatDividerModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, ReactiveFormsModule, FormsModule,
    MatTableModule, MatSortModule, MatDatepickerModule, RouterLink,MatDialogModule],
  providers: [DatePipe],
  templateUrl: './history-sessions.component.html',
  styleUrls: ['./history-sessions.component.scss']
})
export class HistorySessionsComponent implements OnInit, AfterViewInit {
  programDto!:ProgramDto;

  displayedColumns: string[] = ['createdAt', 'closedAt', 'stdPresent', 'stdAbsent', 'percentOfPresence', 'status'];
  dataSource!: HistorySessionDataSourceService;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSizeOptions: number[] = [5, 10, 25, 50];

  programId: string | null = null;
  status: StatusEnum = StatusEnum.ALL;

  dateFilter = new FormGroup({
    dateOpen: new FormControl<any>(this.getMonthStartAndEndDates().start),
    dateClose: new FormControl<any>(this.getMonthStartAndEndDates().end),
  });
  constructor(
    private programSessionService: ProgramSessionService,
    private programService: ProgramService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
    });
  }

  ngOnInit(): void {
    this.dataSource = new HistorySessionDataSourceService(this.programSessionService);
    this.loadDataSource();
    this.loadProgram();
  }

  ngAfterViewInit(): void {
    this.dataSource.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap(() => this.loadDataSource())
      )
      .subscribe();
  }

  loadDataSource(): void {
    if (this.programId){
      this.dateFilter.get('dateOpen')?.patchValue(this.formatDate(this.dateFilter.value.dateOpen));
      this.dateFilter.get('dateClose')?.patchValue(this.formatDate(this.dateFilter.value.dateClose));
      let dateOpen = this.dateFilter.value.dateOpen;
      let dateClose = this.dateFilter.value.dateClose;
      this.dataSource.loadAllSessionOfProgram(this.paginator?.pageIndex, this.paginator?.pageSize, this.programId, this.status, dateOpen, dateClose);
    }
  }
  loadProgram(){
    if (this.programId){
      this.programService.getProgramById(this.programId).subscribe({
        next:value => {
          this.programDto = value;
        }
      })
    }
  }
  formatDate(date: Date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }
  getMonthStartAndEndDates(): { start: Date, end: Date } {
    const currentDate = moment();
    const startOfMonth = currentDate.clone().startOf('month');
    const endOfMonth = currentDate.clone().endOf('month');

    return {
      start: startOfMonth.toDate(),
      end: endOfMonth.toDate()
    };
  }

  showStudentDialog(id:string,present:boolean) {
    this.dialog.open(StudentPresenceListDialogComponent, {
      data: { sessionId: id,present:present },
    });
  }
}
