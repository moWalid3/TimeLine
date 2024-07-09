import { Component, inject, OnInit } from '@angular/core';
import { TimelineCardComponent } from '../timeline-card/timeline-card.component';
import { FormControlComponent } from '../form-control/form-control.component';
import { Timeline } from '../../../core/models/timeline';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TimelineService } from '../../../core/services/timeline.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TimelineCardComponent, FormControlComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnInit{
  private _AuthService = inject(AuthService);
  private _TimelineService = inject(TimelineService);
  private _Router = inject(Router);
  private spinner = inject(NgxSpinnerService)
  private toaster = inject(ToastrService);
  private currentUser$!: Observable<User | null>;
  isLogin: boolean = false;
  timelines!: Timeline[];

  ngOnInit(): void {
    this.checkingAuth();
  }
  
  checkingAuth() {    
    this.currentUser$ = this._AuthService.currentUser$
    this.currentUser$.subscribe(res => {
      if(res) this.isLogin = true;
      else this.isLogin = false;
      this.getTimelines();
    });
  }

  getTimelines() {
    if(this.isLogin) {
      this.spinner.show();
      this._TimelineService.getTimelines().subscribe({
        next: res => {
          this.timelines = res;
          this.timelines.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          this.spinner.hide();
        },
        error: err => {
          console.log(err)
          this.spinner.hide();
        }
      });

    } else {
      this.timelines = [
        {
          title: "Website Redesign Project (2024)",
          description: "A step-by-step outline of a project to redesign a corporate website. It covers initial planning, stakeholder meetings, design mock-ups, development phases, user testing, and the final launch. Each phase includes goals, key deliverables, and timelines to ensure the project stays on track.",
          createdAt: "2024-01-15",
          imageUrl: 'images/t1.jpg'
        },
        {
          title: "Expansion of XYZ Corp (2023 - 2022)",
          description: "A decade-long journey of XYZ Corporation's growth from a small startup to a global enterprise. This includes major milestones like securing initial funding, launching the first product, entering international markets, acquiring competitors, and expanding their product line. Each milestone reflects strategic decisions and significant achievements.",
          createdAt: "2023-03-01",
          imageUrl: 'images/t2.jpg'
        },
        {
          title: "Launch of the iPhone (2022 - 2020)",
          description: "The timeline from the initial concept to the release of the first iPhone. It includes Steve Jobs' vision for the device, the secretive development process at Apple, the design and technology challenges, and the revolutionary launch event that changed the smartphone industry forever.",
          createdAt: "2022-01-01",
          imageUrl: 'images/t3.jpg'
        },
        {
          title: "John Doe's Academic Journey (2019 - 2011)",
          description: "Key milestones in John Doe's educational career, starting from elementary school, moving through high school achievements, his undergraduate studies in Computer Science, and culminating with his Ph.D. in Artificial Intelligence. Highlights include significant awards, publications, and graduation ceremonies.",
          createdAt: "2019-09-01",
          imageUrl: 'images/t4.jpg'
        },
        {
          title: "The Industrial Revolution (2010 - 2003)",
          description: "A period of major industrialization and innovation that transformed largely agrarian, rural societies in Europe and America into industrialized, urban ones. Significant advancements included the development of machinery, the rise of factories, and improvements in transportation and communication.",
          createdAt: "2010-01-01",
          imageUrl: 'images/t5.jpg'
        },
      ]
    }
  }

  handleAuth() {
    if(!this.isLogin) {
      this.toaster.info("Your need to login");
      this._Router.navigate(['/login'])
    }
  }

}
