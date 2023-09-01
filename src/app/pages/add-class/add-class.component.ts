import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SchoolClassService} from "../../_shared/services/school-class.service";
import {ImageCropperComponent} from "../../core/image-cropper/image-cropper.component";

@Component({
  selector: 'ec-add-class',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressBarModule, FlexLayoutModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent {
  classForm!: FormGroup;
  isLoading: boolean = false;
  selectedFileDataURL: string | null = null;

constructor(private formBuilder: FormBuilder,
            private schoolClassService: SchoolClassService,
            private dialog: MatDialog,
            private dialogRef: MatDialogRef<AddClassComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any) {

  this.classForm = this.formBuilder.group({
    id: [null],
    name: ['', Validators.required],
    imageByte: [null, Validators.required]
  });

  if (this.data.id) {
    this.classForm.patchValue(this.data);
  }
}
  onSubmit() {
    if (this.classForm.invalid) {
      alert('incorrect form');
      return;
    }
    this.isLoading = true;
    this.schoolClassService.createClass(this.classForm.value).subscribe({
      next: () => {
        this.classForm.reset();
        this.schoolClassService.triggerRefreshSchoolClass();
        this.onCancel();
      },
      error: () => this.isLoading = false,
      complete: () => this.isLoading = false
    })
  }
  onCancel() {
    this.dialogRef.close();
  }


  onImageChange() {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      panelClass:'background-dialog-copper',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedFileDataURL = reader.result as string;
          this.classForm.patchValue({imageByte: this.selectedFileDataURL});

        };
        reader.readAsDataURL(result);
      }
    });
  }
}
