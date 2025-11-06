import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormComponent,
  FormField,
} from '../../components/ui/form/form.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormComponent],
  standalone: true,
  templateUrl: './login.component.html',
  providers: [NzMessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);

  formFields: FormField[] = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      icon: 'user',
      required: true,
      errorMessages: {
        required: 'Please input your email!',
        email: 'Please input a valid email!',
      },
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      icon: 'lock',
      required: true,
      errorMessages: {
        required: 'Please input your password!',
      },
    },
  ];

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  submitForm = (): void => {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.message.success('Login successful');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.message.error('Login failed: ' + error.message);
        },
      });
    }
  };
} 
