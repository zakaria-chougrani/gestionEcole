import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ProgramDto} from "../../_shared/models";
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
import {ContactInfo} from "../../_shared/models";
import {ContactService} from "../../_shared/services/contact.service";
import {Router} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";
import {StatusEnum} from "../../_shared/enum";
import {MatSelectModule} from "@angular/material/select";
import {MatExpansionModule} from "@angular/material/expansion";
import {Observable} from "rxjs";

@Component({
  selector: 'ec-programs',
  standalone: true,
  imports: [CommonModule, FlexModule, MatButtonModule, MatDividerModule, MatIconModule, MatPaginatorModule, MatProgressBarModule, MatDialogModule, MatCardModule, FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatTooltipModule, MatSelectModule, MatExpansionModule],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {
  programs: ProgramDto[] = [];
  totalPrograms = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 15, 25, 50];
  isLoading: boolean = false;
  teacherSearch: string = '';
  levelId!: string;
  title!: string;
  teachers: ContactInfo[] = [];
  statusList: StatusEnum[] = [StatusEnum.ACTIVE, StatusEnum.DEL, StatusEnum.ALL];
  statusOption: StatusEnum = StatusEnum.ACTIVE;
  isError: Boolean = false;
  protected readonly StatusEnum = StatusEnum;

  constructor(
    private programService: ProgramService,
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
    this.isError = false;
    this.isLoading = true;
    let teacher = (this.teacherSearch as ContactInfo).id;
    this.programs = [];
    this.programService.getAllPrograms(this.currentPage, this.pageSize, this.title || '', this.levelId, teacher || '', this.statusOption)
      .subscribe({
        next: (page) => {
          this.programs = page.content;
          this.totalPrograms = page.totalElements;
        },
        error: () => {
          this.isLoading = false;
          this.isError = true;
        },
        complete: () => {
          this.isLoading = false;
          if (!this.isError && this.programs.length){
            this.programs.map(program => {
              this.contactService.getImage(program.teacherId).subscribe({
                next: (imageDto) => {
                  if (imageDto.imageByte != null) {
                    program.teacherImageByte = imageDto.imageByte;
                  }
                }
              });
            });
          }
        }
      });
  }

  loadTeachers(): void {
    this.teachers = [];
    this.contactService.getActiveTeachersBySearchValue(0, 20, this.teacherSearch || '')
      .subscribe({
        next: (page) => {
          this.teachers = page.content;
        },
        error: () => {},
        complete:() => {
          if (this.teachers.length){
            this.teachers.map(teacher => {
              if (teacher.id) {
                this.contactService.getImage(teacher.id).subscribe({
                  next: (imageDto) => teacher.imageByte = imageDto.imageByte
                });
              }
            });
          }
        }
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
          error: () => {
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  recoverItem(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, recover it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.programService.recoverProgram(id).subscribe({
          next: () => {
            this.programService.triggerRefreshProgram();
            Swal.fire('Success', 'Class recover successfully', 'success').then();
          },
          error: () => {
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
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
      disableClose: true
    });
  }

  displayTeacherFn(teacher: ContactInfo): string {
    return teacher && teacher.lastName && teacher.firstName ? teacher.lastName.toUpperCase() + ' ' + teacher.firstName.toLowerCase() : '';
  }

  search() {
    this.programService.triggerRefreshProgram();
  }

  navigateToStudents(program: ProgramDto) {
    this.router.navigateByUrl(`/programs/${program.id}`).then();
  }

  navigateToSessions(program: ProgramDto) {
    this.router.navigateByUrl(`/sessions/${program.id}`).then();
  }

  navigateToHistoryOfSession(program: ProgramDto) {
    this.router.navigateByUrl(`/history-sessions/${program.id}`).then();

  }

}
