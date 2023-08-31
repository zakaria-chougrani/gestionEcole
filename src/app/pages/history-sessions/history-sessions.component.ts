import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {Program} from "../../_shared/models/program";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";

@Component({
  selector: 'ec-history-sessions',
  standalone: true,
  imports: [CommonModule, FlexModule, MatButtonModule, MatChipsModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, ReactiveFormsModule, FormsModule, MatTableModule, MatSortModule],
  templateUrl: './history-sessions.component.html',
  styleUrls: ['./history-sessions.component.scss']
})
export class HistorySessionsComponent implements OnInit{
  isLoading: boolean = false;

  programs: Program[] = [];
  totalPrograms = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  searchValue = '';

  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  dataSource!: MatTableDataSource<Program>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor() {

  }

  ngOnInit(): void {
  }

  search(): void {
    this.loadPrograms();
  }

  private loadPrograms() {

  }
  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPrograms();
  }
}
