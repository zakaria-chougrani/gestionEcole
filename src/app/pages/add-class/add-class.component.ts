import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SchoolClassService} from "../../_shared/services/school-class.service";
import {SchoolClass} from "../../_shared/models/school-class";

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
  selectedImage: File | null = null;
constructor(private formBuilder: FormBuilder,
            private schoolClassService: SchoolClassService,
            private dialogRef: MatDialogRef<AddClassComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any) {

  this.classForm = this.formBuilder.group({
    id: [null],
    name: ['', Validators.required],
    image: [null, Validators.required]
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
    const name = this.classForm.controls['name'].value;
    const image = this.classForm.controls['image'].value;

    this.isLoading = true;
    this.schoolClassService.createClass(name, image).subscribe({
      next: () => {
        this.classForm.reset();
        this.selectedImage = null;
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

  onImageChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedImage = event.target.files[0];
      this.classForm.patchValue({ image: this.selectedImage });
    }
  }
}
