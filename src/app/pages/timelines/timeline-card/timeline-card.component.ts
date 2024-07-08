import { Component, Input, OnInit, inject } from '@angular/core';
import { Timeline } from '../../../core/models/timeline';
import { CommonModule } from '@angular/common';
import { FormControlComponent } from '../form-control/form-control.component';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timeline-card',
  standalone: true,
  imports: [CommonModule, FormControlComponent],
  templateUrl: './timeline-card.component.html',
  styleUrl: './timeline-card.component.scss'
})
export class TimelineCardComponent implements OnInit{
  @Input() timeline!: Timeline;

  private _AuthService = inject(AuthService);
  private currentUser$!: Observable<User | null>;
  private _Router = inject(Router);
  private spinner = inject(NgxSpinnerService)
  private toaster = inject(ToastrService);
  isLogin: boolean = false;

  ngOnInit(): void {
    this.currentUser$ = this._AuthService.currentUser$
    this.currentUser$.subscribe(res => {
      if(res) this.isLogin = true;
      else this.isLogin = false;
    });
  }


  handleAuth() {
    if(!this.isLogin) {
      this.toaster.info("Your need to Login");
      this._Router.navigate(['/login'])
    }
  }
}
