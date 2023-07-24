import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {Program} from "../../_shared/models/program";
import {ProgramService} from "../../_shared/services/program.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AddProgramComponent} from "../add-program/add-program.component";
import Swal from "sweetalert2";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {ContactInfo} from "../../_shared/models/contact-info";
import {ContactService} from "../../_shared/services/contact.service";
import {Router} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'ec-programs',
  standalone: true,
  imports: [CommonModule, FlexModule, MatButtonModule, MatDividerModule, MatIconModule, MatPaginatorModule, MatProgressBarModule, MatDialogModule, MatCardModule, FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatTooltipModule],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit{
  programs: Program[] = [];
  totalPrograms = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10,15, 25, 50];
  isLoading: boolean = false;
  teacherSearch:string='';
  levelId!:string;
  title!:string;
  teachers: ContactInfo[] = [];

  constructor(
    private programService:ProgramService,
    private contactService: ContactService,
    private router: Router,
    private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.loadPrograms();
    this.loadTeachers();
    this.programService.refreshProgram.subscribe(() => {
      this.loadPrograms();
    });
  }
  loadPrograms(): void {
    let teacher = (this.teacherSearch as ContactInfo).id;
    this.programService.getAllPrograms(this.currentPage, this.pageSize,this.title||'',this.levelId,teacher||'')
      .subscribe((page) => {
        this.programs = page.content;
        this.totalPrograms = page.totalElements;
      });
  }
  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPrograms();
  }
  openAddProgramDialog(programDto: {}) {
    this.dialog.open(AddProgramComponent, {
      width: '800px',
      data: programDto,
      disableClose:true
    });
  }
  deleteItem(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.programService.deleteProgram(id).subscribe({
          next: () => {
            this.programService.triggerRefreshProgram();
            Swal.fire('Success', 'Class deleted successfully', 'success').then();
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }
  loadTeachers(): void {
    this.isLoading = true;
    this.teachers = [];
    this.contactService.getActiveTeachersBySearchValue(0, 20, this.teacherSearch || '')
      .subscribe({
        next: (page) => {
          this.teachers = page.content;
        },
        complete: () => this.isLoading = false
      });
  }
  displayTeacherFn(teacher: ContactInfo): string {
    return teacher && teacher.lastName && teacher.firstName ? teacher.lastName.toUpperCase() + ' ' + teacher.firstName.toLowerCase() : '';
  }

  search() {
    this.programService.triggerRefreshProgram();
  }

  navigateToStudents(program: Program) {
    this.router.navigateByUrl(`/programs/${program.id}`).then();
  }
  navigateToSessions(program: Program) {
    this.router.navigateByUrl(`/sessions/${program.id}`).then();
  }

  navigateToHistoryOfSession(program: Program) {

  }
}
