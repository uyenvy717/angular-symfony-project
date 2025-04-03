import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/ui/card/card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ClientComponent } from '../../client/client.component';
import { UserComponent } from '../../user/user.component';
import { TableComponent } from '../../../components/ui/table/table.component';
import { ClientService } from '../../../services/client.service';
import { UserService } from '../../../services/user.service';
import { forkJoin } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';

interface Client {
  id: string;
  name: string;
  email: string;
  startDate?: string;
}

interface User {
  id: string;
  name: string;
  active: boolean;
  lastLoggedIn?: string;
}

interface PartnerReference {
  id: string;
}

interface Partner {
  id: string;
  name: string;
  email: string;
  type: string;
  clients: PartnerReference[];
  users: PartnerReference[];
}

@Component({
  selector: 'app-inside-dashboard',
  imports: [
    CommonModule, 
    CardComponent, 
    NzButtonModule,
    NzTabsModule,
    NzSpinModule,
    ClientComponent,
    UserComponent,
    TableComponent
  ],
  standalone: true,
  templateUrl: './inside-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsideDashboardComponent implements OnInit {
  partnerData: Partner | null = null;
  clients: Client[] = [];
  users: User[] = [];
  loading = false;

  clientColumns = [
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
    }
  ];

  userColumns = [
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'Account Status',
      key: 'active',
      render: (data: User) => data.active ? 'Active' : 'Inactive'
    },
    {
      title: 'Last Seen',
      key: 'lastLoggedIn',
      render: (data: User) => data.lastLoggedIn ? new Date(data.lastLoggedIn).toLocaleDateString() : 'Never'
    }
  ];

  constructor(
    private router: Router, 
    private clientService: ClientService, 
    private userService: UserService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.partnerData = (navigation.extras.state as { partner: Partner }).partner;
    }
  }

  ngOnInit(): void {
    if (!this.partnerData) {
      console.warn('No partner data available');
      return;
    }

    this.loading = true;
    const clientIds = this.partnerData.clients?.map((client: PartnerReference) => client.id.split('/').pop()).filter((id): id is string => id !== undefined) || [];
    const userIds = this.partnerData.users?.map((user: PartnerReference) => user.id.split('/').pop()).filter((id): id is string => id !== undefined) || [];

    // Fetch all client and user data in parallel
    const clientRequests = clientIds.map((id: string) => this.clientService.getClient(id));
    const userRequests = userIds.map((id: string) => this.userService.getUser(id));

    forkJoin({
      clients: forkJoin(clientRequests),
      users: forkJoin(userRequests)
    }).subscribe({
      next: (results) => {
        this.clients = results.clients as Client[];
        this.users = results.users as User[];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    });
  }
}
