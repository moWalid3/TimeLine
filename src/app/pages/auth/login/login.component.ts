import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  private currentUser$!: Observable<User | null>;
  private _AuthService = inject(AuthService);
  private _Router = inject(Router);
  private spinner = inject(NgxSpinnerService)
  private toaster = inject(ToastrService);

  ngOnInit(): void {
    this.currentUser$ = this._AuthService.currentUser$
    this.currentUser$.subscribe(res => {
      if(res) this._Router.navigate(['/']);
    });
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('',[ Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    password: new FormControl( '',[ Validators.required, Validators.minLength(6)]),
  });

  get email(): AbstractControl {
    return this.loginForm.get('email')!;
  }
  
  get password(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  async onSubmit() {
    this.spinner.show();
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    try{
      await this._AuthService.login(email, password)
      this.toaster.success("Login success");
      this._Router.navigate(['/']);
      this.spinner.hide();
    }catch (err) {
      console.log(err);
      this.toaster.error("Wrong email or password");
      this.spinner.hide();
    }
  }

  async loginWithGoogle() {
    try {
      await this._AuthService.loginWithGoogle();
      this.toaster.success("Login success");
    } catch (err) {

    }
  }

}
