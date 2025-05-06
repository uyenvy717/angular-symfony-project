import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'date' | 'checkbox' | 'select';
  label: string;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  errorMessages?: { [key: string]: string };
  options?: { label: string; value: string }[];
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NzFormModule, 
    NzInputModule, 
    NzButtonModule,
    NzCheckboxModule,
    NzSelectModule,
  ],
  templateUrl: './form.component.html',
})
export class FormComponent {
  @Input() formGroup!: FormGroup;
  @Input() onSubmit!: () => void;
  @Input() fields: FormField[] = [];
  @Input() isLoginForm = false;
  title = input<string>('');
  submitButtonText = input<string>('Submit');

  handleSubmit(): void {
    if (this.formGroup.valid) {
      this.onSubmit();
    }
  }

  getErrorMessage(control: any, field: FormField): string {
    if (!control.errors) return '';
    
    const firstError = Object.keys(control.errors)[0];
    return field.errorMessages?.[firstError] || `${field.label} is invalid`;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.formGroup.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
