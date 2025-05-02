import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-page-header',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './page-header.component.html',
  styles: `
    :host {
      grid-area: quickactions;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent implements OnInit {
  private authService = inject(AuthService);
  accountName = signal<string | undefined>('');

  ngOnInit() {
    this.accountName.set(this.authService.getName());
  }

  logout() {
    this.authService.logout();
  }
}
