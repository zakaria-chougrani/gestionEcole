import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {SchoolClass} from "../../_shared/models/school-class";
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
import {ContactService} from "../../_shared/services/contact.service";
import {ProgramService} from "../../_shared/services/program.service";

@Component({
  selector: 'ec-students-program',
  standalone: true,
  imports: [CommonModule, FlexModule, MatAutocompleteModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule, ReactiveFormsModule, FormsModule],
  templateUrl: './students-program.component.html',
  styleUrls: ['./students-program.component.scss']
})
export class StudentsProgramComponent implements OnInit {
  isLoading: boolean = false;
  studentSearch: string = '';
  students: ContactInfo[] = [];
  programId: string | null = null;

  constructor(
    private contactService: ContactService,
    private programService: ProgramService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
    });
  }

  ngOnInit(): void {
    if (this.programId) {
      this.loadStudents();
      // this.schoolClassService.refreshLevels.subscribe(() => {
      //   this.loadStudents();
      // });
    }
  }

  loadStudents(): void {
    this.isLoading = true;
    this.students = [];
    this.contactService.getStudentsNotInProgram(0, 10, this.programId || '', this.studentSearch || '')
      .subscribe({
        next: (page) => {
          this.students = page.content;
        },
        complete: () => this.isLoading = false
      });
  }

  addStudent() {
    const student = this.studentSearch as ContactInfo;
    if (!this.programId || !student)
      return;
    this.programService.addStudentToProgram(student, this.programId).subscribe({
      next: value => {
        console.log(value);
        this.loadStudents();
        this.studentSearch = '';
      },
      complete: () => this.isLoading = false
    })
  }

  displayStudentFn(teacher: ContactInfo): string {
    return teacher && teacher.lastName && teacher.firstName ? teacher.lastName.toUpperCase() + ' ' + teacher.firstName.toLowerCase() : '';
  }
}
