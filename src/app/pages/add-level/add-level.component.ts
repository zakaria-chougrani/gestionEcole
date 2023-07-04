import {Component, Inject} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SchoolClassService} from "../../_shared/services/school-class.service";
import {SchoolClass} from "../../_shared/models/school-class";
import {FonSizeUtilsService} from "../../_shared/utils/fon-size-utils.service";
import {ColorUtilsService} from "../../_shared/utils/color-utils.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'ec-add-level',
  standalone: true,
  imports: [CommonModule, FlexModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, ReactiveFormsModule],
  templateUrl: './add-level.component.html',
  styleUrls: ['./add-level.component.scss']
})
export class AddLevelComponent {
  levelForm!: FormGroup;
  isLoading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private schoolClassService: SchoolClassService,
              private dialogRef: MatDialogRef<AddLevelComponent>,
              public fonSizeUtilsService: FonSizeUtilsService,
              public colorUtilsService: ColorUtilsService,
              @Inject(MAT_DIALOG_DATA) public data: { levelDto: any, classDto: SchoolClass }) {

    this.levelForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: [null]
    });

    if (this.data.levelDto.id) {
      this.levelForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.levelForm.invalid || !this.data.classDto.id) {
      alert('incorrect form');
      return;
    }
    this.isLoading = true;
    this.schoolClassService.addLevelToSchoolClass(this.data.classDto.id, this.levelForm.value).subscribe({
      next: () => {
        this.levelForm.reset();
        this.schoolClassService.triggerRefreshLevels();
        this.onCancel();
      },
      error: err => console.log(err),
      complete: () => this.isLoading = false
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
