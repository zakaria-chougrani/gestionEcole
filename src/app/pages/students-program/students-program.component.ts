import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {FlexModule} from "@angular/flex-layout";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ContactInfo} from "../../_shared/models/contact-info";
import {ProgramService} from "../../_shared/services/program.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import Swal from 'sweetalert2';

@Component({
  selector: 'ec-students-program',
  standalone: true,
  imports: [CommonModule, FlexModule, MatAutocompleteModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule, ReactiveFormsModule, FormsModule, MatTableModule, NgOptimizedImage],
  templateUrl: './students-program.component.html',
  styleUrls: ['./students-program.component.scss']
})
export class StudentsProgramComponent implements OnInit {
  isLoading: boolean = false;
  studentSearch: string = '';
  studentsNotInProgram: ContactInfo[] = [];
  programId: string | null = null;

  displayedColumns: string[] = ['position', 'name', 'gender', 'phoneNumber', 'scholarLevel', 'age', 'del'];
  dataSource!: MatTableDataSource<ContactInfo>;

  constructor(
    private programService: ProgramService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
    });
  }

  ngOnInit(): void {
    if (this.programId) {
      this.loadStudentsNotInProgram();
      this.loadStudentsInProgram();
      this.programService.refreshStudentsInProgram.subscribe(() => {
        this.loadStudentsInProgram();
      });
      this.programService.refreshStudentsNotInProgram.subscribe(() => {
        this.loadStudentsNotInProgram();
      });
    }
  }

  loadStudentsNotInProgram(): void {
    this.isLoading = true;
    this.studentsNotInProgram = [];
    this.programService.getStudentsNotInProgram(0, 10, this.programId || '', this.studentSearch || '')
      .subscribe({
        next: (page) => {
          this.studentsNotInProgram = page.content;
        },
        complete: () => this.isLoading = false
      });
  }

  loadStudentsInProgram() {
    this.isLoading = true;
    this.programService.getStudentsInProgram(this.programId || '')
      .subscribe({
        next: (data) => {
          this.dataSource = new MatTableDataSource(data);
        },
        complete: () => this.isLoading = false
      });
  }

  addStudent() {
    const student = this.studentSearch as ContactInfo;
    if (!this.programId || !student)
      return;
    this.programService.addStudentToProgram(student, this.programId).subscribe({
      next: () => {
        this.studentSearch = '';
        this.programService.triggerRefreshStudentsInProgram();
        this.programService.triggerRefreshStudentsNotInProgram();
      },
      complete: () => this.isLoading = false
    })
  }

  deleteStudent(studentId: string) {
    Swal.fire({
      title: 'Confirm Delete',
      text: 'Are you sure you want to delete this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.programId || !studentId)
          return;
        this.programService.deleteStudent(this.programId, studentId).subscribe({
          next: () => {
            this.studentSearch = '';
            this.programService.triggerRefreshStudentsInProgram();
            this.programService.triggerRefreshStudentsNotInProgram();
          },
          complete: () => this.isLoading = false
        })
      }
    });

  }

  displayStudentFn(teacher: ContactInfo): string {
    return teacher && teacher.lastName && teacher.firstName ? teacher.lastName.toUpperCase() + ' ' + teacher.firstName.toLowerCase() : '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculateAge(dateOfBirth: Date) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let years = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }

    return years;
  }
}
