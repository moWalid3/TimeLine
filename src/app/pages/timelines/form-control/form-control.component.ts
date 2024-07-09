import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Timeline } from '../../../core/models/timeline';
import { CommonModule } from '@angular/common';
import { TimelineService } from '../../../core/services/timeline.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.scss',
})
export class FormControlComponent implements OnInit{
  @Input() editTimeline!: Timeline;
  @Input() modalId: string = 'addTimelineModal';

  private _TimelineService = inject(TimelineService);
  private spinner = inject(NgxSpinnerService)
  private toaster = inject(ToastrService);
  _FormBuilder = inject(FormBuilder);
  imageSrc = new BehaviorSubject<string | ArrayBuffer | null>(null);
  editChangedData: boolean = false;
  timelineForm!:FormGroup;
  selectedFile!: File;

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.timelineForm = this._FormBuilder.group({
      title: [null, Validators.required],
      description: [''],
      createdAt: [null, Validators.required],
    });

    if(this.modalId !== 'addTimelineModal') {
      this.setEditDataToForm();
    }
  }

  setEditDataToForm() {
    this.title.setValue(this.editTimeline.title);
    this.description.setValue(this.editTimeline.description);
    this.createdAt.setValue(this.editTimeline.createdAt);
    this.selectedFile = undefined!;
    this.imageSrc.next(this.editTimeline.imageUrl);
    this.hasEnyEditDataChanged();
  }

  hasEnyEditDataChanged() {
    this.timelineForm.valueChanges.subscribe(res => {
      const titleChanged = res.title === this.editTimeline.title;
      const descriptionChanged = res.description === this.editTimeline.description;
      const dateChanged = new Date(res.createdAt).getTime() === new Date(this.editTimeline.createdAt).getTime();
      let imageUrlChanged;
      this.imageSrc.subscribe(res => {
        imageUrlChanged = res === this.editTimeline.imageUrl;
        this.editChangedData = !(titleChanged && descriptionChanged && dateChanged && imageUrlChanged);
      }) 
    });
  }

  handleFile(event: any) {
    this.selectedFile = event.target.files[0];
    
    if (this.selectedFile) { // to display the img instead of input
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageSrc.next(e.target?.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async addTimeline() {
    this.spinner.show();
    try {
      await this._TimelineService.createTimeline(this.selectedFile, this.title.value, this.description.value, this.createdAt.value);
      this.spinner.hide();
      this.toaster.success("Timeline added successfully");
    } catch(err) {
      console.log(err);
      this.spinner.hide();
      this.toaster.error("There is an error!")
    }
    this.resetModal();
  }
  
  async updateTimeline() {
    try {
      this.spinner.show();
      await this._TimelineService.updateTimeline(this.editTimeline.id!, {...this.timelineForm.value}, this.selectedFile);
      this.spinner.hide();
      this.toaster.success("Timeline updated successfully")
    } catch(err) {
      this.spinner.hide();
    }
  }

  async deleteTimeline() {
    this.spinner.show();
    try {
      await this._TimelineService.deleteTimeline(this.editTimeline);
      this.spinner.hide();
      this.toaster.success("Timeline deleted successfully");
    } catch (err) {
      console.log(err);
      this.spinner.hide();
    }
  }

  resetModal() {
    if(this.modalId !== 'addTimelineModal') {
      this.setEditDataToForm();
    } else {
      this.timelineForm.reset();
      this.selectedFile = undefined!;
    }
  }

  get title (): AbstractControl {
    return this.timelineForm.get('title')!;
  }

  get description (): AbstractControl {
    return this.timelineForm.get('description')!;
  }

  get createdAt (): AbstractControl {
    return this.timelineForm.get('createdAt')!;
  }
  
}
