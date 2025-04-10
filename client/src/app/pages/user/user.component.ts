import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/ui/table/table.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

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
      key: 'name'
    },
    {
      title: 'Account Status',
      key: 'active',
      render: (data: any) => data.active ? 'Active' : 'Inactive'
    },
    {
      title: 'Last Seen',
      key: 'lastLoggedIn',
      render: (data: any) => data.lastLoggedIn ? new Date(data.lastLoggedIn).toLocaleDateString() : 'Never'
    }
  ];
  users: any[] = [];
  loading = signal<boolean>(false);
  error = signal<string | null >(null);

  constructor(
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    let request$: Observable<any>;
    if (this.partnerId) {
      request$ = this.userService.getUsersByPartner(this.partnerId);
    } else {
      request$ = this.userService.getUsers();
    }

    request$.subscribe({
      next: (data) => {
        console.log('Users data:', data);
        this.users = data.member;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error.set('Failed to load users');
        this.loading.set(false);
        this.message.error(this.error() ?? '');
      }
    });
  }
}
