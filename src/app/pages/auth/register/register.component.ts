import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  private _AuthService = inject(AuthService);
  private currentUser$!: Observable<User | null>;
  private _Router = inject(Router);
  private spinner = inject(NgxSpinnerService)
  private toaster = inject(ToastrService);

  ngOnInit(): void {
    this.currentUser$ = this._AuthService.currentUser$;
    this.currentUser$.subscribe(res => {
      if(res) this._Router.navigate(['/']);
    });
  }

  registerForm: FormGroup = new FormGroup({
    email: new FormControl('',[ Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    password: new FormControl( '',[ Validators.required, Validators.minLength(6)]),
    rePassword:  new FormControl('', [ Validators.required]),
  }, {validators: this.rePasswordMatch})

  rePasswordMatch(registerForm: AbstractControl): ValidationErrors | null {
    let password = registerForm.get('password');
    let rePassword = registerForm.get('rePassword');
    if(password?.value === rePassword?.value) {
      return null;
    } else {
      rePassword?.setErrors({rePasswordMatch: "password and rePassword are not matching"});
      return {rePasswordMatch: "password and rePassword are not matching"}
    }
  }

  get email(): AbstractControl {
    return this.registerForm.get('email')!;
  }
  get password(): AbstractControl {
    return this.registerForm.get('password')!;
  }
  get rePassword(): AbstractControl {
    return this.registerForm.get('rePassword')!;
  }

  async onSubmit() {
    this.spinner.show();
    let email = this.registerForm.value.email;
    let password = this.registerForm.value.password;
    try {
      await this._AuthService.register(email, password);
      this.toaster.success("Register success");
      this._Router.navigate(['/']);
      this.spinner.hide();
    }catch (err) {
      console.log(err);
      this.toaster.error("There is an error!");
      this.spinner.hide();
    }
  }

}
