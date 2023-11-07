import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'ec-student-presence-list-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-presence-list-dialog.component.html',
  styles: [
  ]
})
export class StudentPresenceListDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
  }
}
