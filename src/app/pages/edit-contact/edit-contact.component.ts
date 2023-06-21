import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContactInfo, Gender} from "../../_shared/models/contact-info";
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ContactService} from "../../_shared/services/contact.service";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

@Component({
  selector: 'ec-edit-contact',
  standalone: true,
  imports: [CommonModule, FlexModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, ReactiveFormsModule, MatIconModule, MatDatepickerModule, MatProgressBarModule, MatChipsModule],
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent {
  contactForm!: FormGroup;
  isLoading: boolean = false;
  Gender = Gender;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactInfo,
    private contactService: ContactService
  ) {
    this.contactForm = this.formBuilder.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', Validators.compose([Validators.email])],
      phoneNumber: ['', Validators.required],
      scholarLevel: [''],
      dateOfBirth: [''],
      status: ['', Validators.required],
      specialties: new FormControl([])
    });

    if (this.data.id) {
      this.contactForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      alert('incorrect form');
      return;
    }
    let formFinal: ContactInfo = {
      id: this.contactForm.controls['id'].value,
      lastName: this.contactForm.controls['lastName'].value,
      firstName: this.contactForm.controls['firstName'].value,
      gender: this.contactForm.controls['gender'].value,
      phoneNumber: this.contactForm.controls['phoneNumber'].value,
      status: this.contactForm.controls['status'].value
    };
    if (this.contactForm.controls['status'].value == 'staff') {
      formFinal.email = this.contactForm.controls['email'].value;
    } else if (this.contactForm.controls['status'].value == 'teacher') {
      formFinal.email = this.contactForm.controls['email'].value;
      formFinal.specialties = this.contactForm.controls['specialties'].value;

    } else if (this.contactForm.controls['status'].value == 'student' || this.contactForm.controls['status'].value == 'stagiaire') {
      formFinal.dateOfBirth = this.contactForm.controls['dateOfBirth'].value;
      formFinal.scholarLevel = this.contactForm.controls['scholarLevel'].value;

    } else return;
    this.isLoading = true;

    this.contactService.saveContact(formFinal).subscribe({
      next: () => {
        this.contactService.triggerRefreshContacts();
        this.onCancel();
      },
      error: err => console.log(err),
      complete: () => this.isLoading = false
    })
  }

  onCancel() {
    this.dialogRef.close();
  }


  addSpecialty(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {

      const specialties = this.contactForm.get('specialties') as FormControl;
      if (!specialties.value) specialties.setValue([]);
      if (!specialties.value.includes(value)) {
        specialties.setValue([...specialties.value, value]);
      }
      event.chipInput!.clear();
    }
  }

  removeSpecialty(specialty: string): void {
    const specialties = this.contactForm.get('specialties') as FormControl;
    const index = specialties.value.indexOf(specialty);
    if (index >= 0) {
      const updatedValue = [...specialties.value];
      updatedValue.splice(index, 1);
      specialties.setValue(updatedValue);
    }
  }
}
