import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProgramDto} from "../../_shared/models";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {SessionProgramHistory} from "../../_shared/models/SessionProgramHistory";
import {ProgramSessionService} from "../../_shared/services/program-session.service";
import {StatusEnum} from "../../_shared/enum";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ec-history-sessions',
  standalone: true,
  imports: [CommonModule, FlexModule, MatButtonModule, MatChipsModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, ReactiveFormsModule, FormsModule, MatTableModule, MatSortModule],
  templateUrl: './history-sessions.component.html',
  styleUrls: ['./history-sessions.component.scss']
})
export class HistorySessionsComponent implements OnInit{
  isLoading: boolean = false;
  isError: boolean = false;
  sessionHistories:SessionProgramHistory[] = [];
  totalSessions = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  programId: string | null = null;
  status:StatusEnum = StatusEnum.ALL;
  dateOpen!:Date;
  dateClose!:Date;
  displayedColumns: string[] = ['createdAt', 'closedAt', 'stdPresent', 'stdAbsent', 'percentOfPresence', 'status', 'actionBtn'];
  dataSource!: MatTableDataSource<ProgramDto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private _location:Location,
    private programSessionService:ProgramSessionService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
    });
  }

  ngOnInit(): void {
    this.loadAllSessionOfProgram();
  }

  search(): void {
    this.loadAllSessionOfProgram();
  }

  loadAllSessionOfProgram(): void {
    this.isError = false;
    this.isLoading = true;
    this.sessionHistories = [];
    if (this.programId){
      this.programSessionService.getAllSessionOfProgram(this.currentPage, this.pageSize, this.programId,this.status,this.dateOpen,this.dateClose)
        .subscribe({
          next: (page) => {
            console.log(page);
            this.sessionHistories = page.content;
            this.totalSessions = page.totalElements;
          },
          error: () => {
            this.isError = true;
            this.isLoading = false;
          },
          complete: () => this.isLoading = false
        });
    }
  }
  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAllSessionOfProgram();
  }

  previousPage() {
    this._location.back();
  }
}
