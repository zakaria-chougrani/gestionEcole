import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'ec-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, FlexModule, MatFormFieldModule, RouterLink, ReactiveFormsModule, MatInputModule, MatButtonModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  userForm!: FormGroup;
  formErrors = {
    'email': '',
    'password': ''
  };
  validationMessages = {
    'email': {
      'required': 'Please enter your email',
      'email': 'please enter your vaild email'
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers and letters',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    }
  };
  constructor(private router: Router,
              private fb: FormBuilder) {
  }
  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    // if (!this.userForm) {
    //   return;
    // }
    // const form = this.userForm;
    // for (const field in this.formErrors) {
    //   if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
    //     this.formErrors[field] = '';
    //     const control = form.get(field);
    //     if (control && control.dirty && !control.valid) {
    //       const messages = this.validationMessages[field];
    //       for (const key in control.errors) {
    //         if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
    //           this.formErrors[field] += messages[key] + ' ';
    //         }
    //       }
    //     }
    //   }
    // }
  }
  login() {
    this.router.navigate(['/']).then();
  }
}
