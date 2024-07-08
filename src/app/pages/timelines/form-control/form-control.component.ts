import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Timeline } from '../../../core/models/timeline';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.scss',
})
export class FormControlComponent {

  timeline: Timeline = {} as Timeline;
  selectedFile!: File;
  imageSrc: string | ArrayBuffer | null = null;
  _FormBuilder = inject(FormBuilder);

  timelineForm:FormGroup = this._FormBuilder.group({
    title: [null, Validators.required],
    description: [''],
    date: [null, Validators.required],
  });

  handleFile(event: any) {
    this.selectedFile = event.target.files[0];
    
    if (this.selectedFile) { // to display the img instead of input
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageSrc = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    console.log(this.timelineForm.value);
  }

  get title (): AbstractControl {
    return this.timelineForm.get('title')!;
  }
  get date (): AbstractControl {
    return this.timelineForm.get('date')!;
  }
}
