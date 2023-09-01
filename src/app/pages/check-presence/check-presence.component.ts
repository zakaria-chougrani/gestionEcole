import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ProgramSessionService} from "../../_shared/services/program-session.service";
import {ActivatedRoute} from "@angular/router";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {Subscription} from "rxjs";

export interface StudentDto {
  id: string;
  name: string;
  imageByte?:string;
}

export interface SessionDto {
  id: string;
  teacherName: string;
  teacherImage: string;
  className: string;
  classImage: string;
  programTitle: string;
  levelName: string;
}

@Component({
  selector: 'ec-check-presence',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatSnackBarModule, MatToolbarModule, NgOptimizedImage, MatProgressBarModule, MatCardModule, FlexModule],
  templateUrl: './check-presence.component.html',
  styleUrls: ['./check-presence.component.scss']
})
export class CheckPresenceComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isCheckSuccess: boolean = false;
  students: StudentDto[] = [];
  sessionId: string | null = null;
  student!: StudentDto;
  session!: SessionDto;
  private subscription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private sessionService: ProgramSessionService,
    private route: ActivatedRoute,
    private _mqttService: MqttService
  ) {
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('id');
    });

    this.subscription = this._mqttService.observe(`highup/presence/${this.sessionId}`).subscribe((message: IMqttMessage) => {
      // console.log(message.payload.toString());
      this.loadStudent();
    });
  }

  ngOnInit() {
    this.loadSession();
    this.loadStudent();
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkStudent(studentId: string) {
    if (!this.sessionId)
      return;
    this.isLoading = true;
    this.sessionService.checkStudent(this.sessionId, studentId).subscribe({
      next: () => {
        this.isCheckSuccess = true;
        this._mqttService.unsafePublish(`highup/presence/${this.sessionId}`, 'true', {qos: 1, retain: true});
      },
      error: err => {
        this.isLoading = false;
        console.error('erreur checkStudent', err);
      },
      complete: () => this.isLoading = false
    })
  }

  loadSession() {
    if (!this.sessionId)
      return;
    this.isLoading = true;
    this.sessionService.getSession(this.sessionId).subscribe({
      next: session => this.session = session,
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    })
  }

  loadStudent() {
    if (!this.sessionId)
      return;
    this.isLoading = true;
    this.sessionService.getStudentsNotCheck(this.sessionId).subscribe({
      next: students => this.students = students,
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    })
  }
}
