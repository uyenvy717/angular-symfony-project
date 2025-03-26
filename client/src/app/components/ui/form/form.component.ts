import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './form.component.html'
})
export class FormComponent {
  @Input() formGroup!: FormGroup;
  @Input() onSubmit!: () => void;
  @Input() title: string = 'Form';
  @Input() submitButtonText: string = 'Submit';
}
