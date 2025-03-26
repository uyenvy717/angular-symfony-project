import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormComponent } from '../../components/ui/form/form.component';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
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
