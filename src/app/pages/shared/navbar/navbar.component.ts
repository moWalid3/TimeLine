import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private _AuthService = inject(AuthService);
  private currentUser$!: Observable<User | null>;
  private toaster = inject(ToastrService);
  isLogin: boolean = false;

  ngOnInit(): void {
    this.currentUser$ = this._AuthService.currentUser$
    this.currentUser$.subscribe(res => {
      if(res) this.isLogin = true;
      else this.isLogin = false;
      console.log(res);
    });
  }

  async logout() {
    try {
      await this._AuthService.logout();
      this.toaster.success("Logout Success");
    } catch(err) {
      console.log(err);
      this.toaster.error("There is an error!")
    }
  }
}
