import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexModule} from "@angular/flex-layout";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SchoolClassService} from "../../_shared/services/school-class.service";
import {SchoolYearDirective} from "../../_shared/directive/school-year.directive";
import {SchoolClass} from "../../_shared/models/school-class";
import {Level} from "../../_shared/models/level";
import {MatSelectModule} from "@angular/material/select";
import {ContactInfo} from "../../_shared/models/contact-info";
import {ContactService} from "../../_shared/services/contact.service";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCardModule} from "@angular/material/card";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {DayEnum} from "../../_shared/models/session";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ProgramService} from "../../_shared/services/program.service";
import {Program} from "../../_shared/models/program";

@Component({
  selector: 'ec-add-program',
  standalone: true,
  imports: [CommonModule, FlexModule, FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, SchoolYearDirective, MatSelectModule, MatAutocompleteModule, MatCardModule, MatButtonToggleModule, MatIconModule, MatProgressBarModule],
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit {
  programForm!: FormGroup;
  isLoading: boolean = false;
  currentYear = new Date().getFullYear();
  classes: SchoolClass[] = [];
  levels: Level[] = [];
  teachers: ContactInfo[] = [];
  teacherSearch = new FormControl('');
  dayOptions: DayEnum[] = Object.values(DayEnum);

  constructor(private formBuilder: FormBuilder,
              private schoolClassService: SchoolClassService,
              private contactService: ContactService,
              private programService: ProgramService,
              private dialogRef: MatDialogRef<AddProgramComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Program) {
    this.programForm = this.formBuilder.group({
      id: [null],
      title: [null, Validators.required],
      schoolYear: [`${this.currentYear}-${this.currentYear + 1}`, Validators.required],
      classLevel: [null, Validators.required],
      schoolclass: [null],
      teacher: this.teacherSearch,
      sessions: this.formBuilder.array([])
    });

    if (this.data.id) {
      this.programForm.patchValue(this.data);
    }
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadTeachers();
    this.addSession();
  }

  loadClasses(): void {
    this.isLoading = true;
    this.schoolClassService.getAllClasses(0, 20)
      .subscribe({
        next: (page) => {
          this.classes = page.content;
        },
        error: () => this.isLoading = false,
        complete: () => this.isLoading = false
      });
  }

  loadLevelsByClassId(): void {
    this.isLoading = true;
    this.levels = [];
    const shoolclass = this.programForm.controls['schoolclass'].value as SchoolClass;
    this.schoolClassService.getLevelsBySchoolClass(shoolclass.id, 0, 20)
      .subscribe({
        next: (page) => {
          this.levels = page.content;
        },
        complete: () => this.isLoading = false
      });
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.teachers = [];
    this.contactService.getActiveTeachersBySearchValue(0, 20, this.teacherSearch.value || '')
      .subscribe({
        next: (page) => {
          this.teachers = page.content;
        },
        error: () => this.isLoading = false,
        complete: () => this.isLoading = false
      });
  }

  get sessionControls() {
    return this.programForm.get('sessions') as FormArray;
  }

  addSession() {
    const sessionGroup = this.formBuilder.group({
      day: [null, Validators.required],
      startOfSession: [null, Validators.required],
      endOfSession: [null, Validators.required]
    });
    this.sessionControls.push(sessionGroup);
  }

  removeSession(index: number) {
    this.sessionControls.removeAt(index);
  }

  onSubmit() {
    if (this.programForm.invalid) {
      alert('incorrect form');
      return;
    }
    this.isLoading = true;
    this.programService.addProgram(this.programForm.value).subscribe({
      next: () => {
        this.programForm.reset();
        this.programService.triggerRefreshProgram();
        this.onCancel();
      },
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    })
  }

  onCancel() {
    this.dialogRef.close();
  }

  displayTeacherFn(teacher: ContactInfo): string {
    return teacher && teacher.lastName && teacher.firstName ? teacher.lastName.toUpperCase() + ' ' + teacher.firstName.toLowerCase() : '';
  }

}
