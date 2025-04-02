import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/ui/table/table.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  imports: [CommonModule, TableComponent, NzSpinModule],
  standalone: true,
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService],
})
export class UserComponent implements OnInit {
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

    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.users = data.member;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.error.set('Failed to load clients');
        this.loading.set(false);
        this.message.error(this.error() ?? '');
      }
    });
  }
}
