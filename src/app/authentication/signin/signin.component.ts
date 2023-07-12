import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UntypedFormBuilder,UntypedFormGroup,Validators,} from '@angular/forms';
import { Role } from 'app/models/role';
import { AuthService } from 'app/services/auth.service';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['admin@software.com',Validators.required],
      password: [ 'admin@123',Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      console.log(this.authForm);
      this.subs.sink = this.authService
        .login(this.f['username'].value, this.f['password'].value)
        .subscribe(
          (res) => {
            if (res) {
              setTimeout(() => {
                const role = this.authService.currentUserValue.role;
                if (role === Role.All || role === Role.Admin) {
                  this.router.navigate(['/admin/dashboard/main']);
                } else if (role === Role.Employee) {
                  this.router.navigate(['/employee/dashboard']);
                } else if (role === Role.Client) {
                  this.router.navigate(['/client/dashboard']);
                } else {
                  this.router.navigate(['/authentication/signin']);
                }
                this.loading = false;
              }, 1000);
            } else {
              this.error = 'Invalid Login';
            }
          },
          (error) => {
            this.error = error;
            this.submitted = false;
            this.loading = false;
          }
        );
    }
  }
}
