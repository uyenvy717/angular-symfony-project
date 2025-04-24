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
import { ClientService } from '../../services/client.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ClientJsonldClientApiRead } from '../../api/models';
import { ActivatedRoute, Router } from '@angular/router';

interface Client {
  '@id': string;
  '@type': string;
  active: boolean;
  email: string;
  name: string;
  partner: {
    '@id': string;
    '@type': string;
    registeredPartner?: string;
    registeredPartnerName?: string;
    name: string;
  };
  startDate: string;
  partnerName?: string;
}

@Component({
  selector: 'app-client',
  imports: [CommonModule, TableComponent, NzSpinModule],
  standalone: true,
  templateUrl: './client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService]
})
export class ClientComponent implements OnInit {
  @Input() partnerId?: string;

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
      render: (data: ClientJsonldClientApiRead) => data.startDate ? new Date(data.startDate).toLocaleDateString() : 'No data'
    },
    {
      title: 'Registered Partner',
      key: 'partner.name',
      render: (data: ClientJsonldClientApiRead) => {
        if (data.partner?.['@type'] === 'GrowthPartner') {
          return '';
        }
        return data.partner?.name || '';
      }
    },
    {
      title: 'Registered Growth Partner',
      key: 'partner.registeredPartnerName',
      render: (data: Client) => {
        if (data.partner?.['@type'] === 'GrowthPartner') {
          return data.partner.name || '';
        }
        return data.partner?.registeredPartnerName || '';
      }
    }
  ];
  clients = signal<ClientJsonldClientApiRead[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  private clientService = inject(ClientService);

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.partnerId) {
      this.clientService.fetchByRegisteredPartner(this.partnerId).subscribe({
        next: (clients) => {
          this.clients.set(clients.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading clients:', err);
          this.loading.set(false);
          this.error.set('Failed to load clients');
          this.message.error('Failed to load clients');
        }
      });
    } else {
      this.clientService.fetchClients().subscribe({
        next: (clients) => {
          this.clients.set(clients.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading clients:', err);
          this.loading.set(false);
          this.error.set('Failed to load clients');
          this.message.error('Failed to load clients');
        }
      });
    }
  }

  onRowClick(client: ClientJsonldClientApiRead) {
    this.clientService.setSelectedClient(client);
    if (!client['@id']) {
      this.message.error('Invalid client ID');
      return;
    }
    const id = client['@id'].split('/').pop() || '';
    if (!id) {
      this.message.error('Invalid client ID');
      return;
    }
    this.router.navigate(['/clients', id]);
  }
}
