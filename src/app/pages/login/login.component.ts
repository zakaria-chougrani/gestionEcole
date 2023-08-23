import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AuthService} from "../../_shared/services/auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'ec-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, FlexModule, MatFormFieldModule, RouterLink, ReactiveFormsModule, MatInputModule, MatButtonModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup;
  formErrors = {
    'username': '',
    'password': ''
  };
  message!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      'usernameOrEmail': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      // 'password': ['', [Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6), Validators.maxLength(25)]],
    });
  }


  login() {
    if (this.userForm.invalid)
      return;
    this.http.post<any>(environment.apiUrl+'v1/auth/signin', this.userForm.value)
      .subscribe({
        next: response => {
          const token = response.access_token;
          this.authService.saveToken(token);
          this.router.navigate(['/']).then();
        },
        error: () => {
          this.message = "Invalid username or password.";
        }
      });

  }
}
