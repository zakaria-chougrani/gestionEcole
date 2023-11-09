import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ProgramSessionService} from "../../_shared/services/program-session.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {StudentSessionDto} from "../../_shared/models";


@Component({
  selector: 'ec-student-presence-list-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './student-presence-list-dialog.component.html',
  styles: []
})
export class StudentPresenceListDialogComponent implements OnInit{
  isLoading: boolean = false;
  studentsPresence: StudentSessionDto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sessionId: string, present: boolean },
    private programSessionService: ProgramSessionService
  ) {
  }
  ngOnInit(): void {
    this.loadStudents();
  }
  loadStudents() {
    this.isLoading = true;
    this.programSessionService.getSessionStudent(this.data.sessionId).subscribe({
      next: data => {
        this.studentsPresence = data;
        this.studentsPresence = this.studentsPresence.filter(value => value.present === this.data.present);
        this.isLoading = false;
      },
      error: () => this.isLoading = false,
    })
  }


}
