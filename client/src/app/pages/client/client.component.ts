import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/ui/table/table.component';
import { ClientService } from '../../services/client.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-client',
  imports: [CommonModule, TableComponent, NzSpinModule],
  standalone: true,
  templateUrl: './client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService]
})
export class ClientComponent implements OnInit {
  columns = [
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'Email',
      key: 'email'
    },
    {
      title: 'Start Date',
      key: 'startDate',
      render: (data: any) => data.startDate ? new Date(data.startDate).toLocaleDateString() : 'No data'
    },
  ];
  clients: any[] = [];
  loading = signal<boolean>(false);
  error = signal<string | null >(null);

  constructor(
    private clientService: ClientService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading.set(true);
    this.error.set(null);

    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data.member;
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
