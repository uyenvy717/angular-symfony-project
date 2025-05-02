import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/ui/table/table.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service';
import { UserApiJsonld } from '../../api/models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [CommonModule, TableComponent, NzSpinModule],
  standalone: true,
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService],
})
export class UserComponent implements OnInit {
  @Input() partnerId?: string;

  columns = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Account Status',
      key: 'active',
      render: (data: UserApiJsonld) => (data.active ? 'Active' : 'Inactive'),
    },
    {
      title: 'Last Seen',
      key: 'lastLoggedIn',
      render: (data: UserApiJsonld) =>
        data.lastLoggedIn
          ? new Date(data.lastLoggedIn).toLocaleDateString()
          : 'Never',
    },
  ];
  users = signal<UserApiJsonld[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  private userService = inject(UserService);

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.partnerId) {
      this.userService.fetchByRegisteredPartner(this.partnerId).subscribe({
        next: (users) => {
          this.users.set(users.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.loading.set(false);
          this.error.set('Failed to load users');
          this.message.error('Failed to load users');
        },
      });
    } else {
      this.userService.fetchUsers().subscribe({
        next: (users) => {
          this.users.set(users.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.loading.set(false);
          this.error.set('Failed to load users');
          this.message.error('Failed to load users');
        },
      });
    }
  }

  onRowClick(user: UserApiJsonld) {
    this.router.navigate(['/users', user.id]);
  }
}
