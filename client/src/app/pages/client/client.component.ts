import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/ui/table/table.component';
import { ClientService } from '../../services/client.service';
import { PartnerService } from '../../services/partner.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { forkJoin, map } from 'rxjs';

interface Client {
  '@id': string;
  '@type': string;
  active: boolean;
  email: string;
  name: string;
  partner: string;
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
      key: 'partnerName',
      render: (data: Client) => data.partnerName || 'Loading...'
    }
  ];
  clients: Client[] = [];
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(
    private clientService: ClientService,
    private partnerService: PartnerService,
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
        const clients = data.member as Client[];
        
        // Create an array of observables to fetch partner information
        const partnerRequests = clients.map((client: Client) => {
          // Extract partner ID from the partner URL
          const partnerId = client.partner.split('/').pop() ?? '';
          // Determine partner type from the URL
          const partnerType = client.partner.includes('solution_partners') ? 'solution' : 
                            client.partner.includes('growth_partners') ? 'growth' :
                            client.partner.includes('solution_providers') ? 'provider' : 'affiliate';
          
          return this.partnerService.getPartner(partnerType, partnerId).pipe(
            map(partner => ({
              ...client,
              partnerName: partner.name
            }))
          );
        });

        // Use forkJoin to fetch all partner information in parallel
        forkJoin(partnerRequests).subscribe({
          next: (clientsWithPartners) => {
            this.clients = clientsWithPartners;
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Error loading partner information:', error);
            this.error.set('Failed to load partner information');
            this.loading.set(false);
            this.message.error(this.error() ?? '');
          }
        });
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
