import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/ui/table/table.component';
import { ClientService } from '../../services/client.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Observable } from 'rxjs';

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
      render: (data: Client) => data.startDate ? new Date(data.startDate).toLocaleDateString() : 'No data'
    },
    {
      title: 'Registered Partner',
      key: 'partner.name',
      render: (data: Client) => {
        if (data.partner['@type'] === 'GrowthPartner') {
          return '';
        }
        return data.partner.name;
      }
    },
    {
      title: 'Registered Growth Partner',
      key: 'partner.registeredPartnerName',
      render: (data: Client) => {
        if (data.partner['@type'] === 'GrowthPartner') {
          return data.partner.name;
        }
        return data.partner.registeredPartnerName || '';
      }
    }
  ];
  clients: Client[] = [];
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

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

    let request$: Observable<any>;
    if (this.partnerId) {
      request$ = this.clientService.getClientsByPartner(this.partnerId);
    } else {
      request$ = this.clientService.getClients();
    }

    request$.subscribe({
      next: (data) => {
        console.log('Clients data:', data);
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
