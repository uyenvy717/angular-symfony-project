import { ChangeDetectionStrategy, Component, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService, PartnerType } from '../../services/partner.service';
import { AuthService } from '../../services/auth.service';
import { TableComponent } from '../../components/ui/table/table.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-partner',
  imports: [
    CommonModule,
    NzTabsModule,
    NzSpinModule,
    TableComponent
  ],
  standalone: true,
  templateUrl: './partner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService]
})
export class PartnerComponent implements OnInit {
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
      render: (data: any) => data.startDate ? new Date(data.startDate).toLocaleDateString() : 'No data'
    },
    {
      title: 'End Date',
      key: 'endDate',
      render: (data: any) => data.endDate ? new Date(data.endDate).toLocaleDateString() : 'No data'
    },
  ];
  partners: any[] = [];
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  currentTab!: PartnerType;
  isSuperAdmin = signal<boolean>(false);
  partnerTypes = [
    { title: 'Growth Partner', requiresSuperAdmin: true },
    { title: 'Solution Partner', requiresSuperAdmin: false },
    { title: 'Solution Provider', requiresSuperAdmin: false },
    { title: 'Affiliate Partner', requiresSuperAdmin: false },
  ];

  constructor(
    private partnerService: PartnerService,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {
    this.isSuperAdmin.set(this.authService.hasRole('ROLE_SUPER_ADMIN'));
  }

  ngOnInit(): void {
    if (this.partnerId) {
      this.isSuperAdmin.set(false);
    }
    this.currentTab = this.isSuperAdmin() ? 'growth' : 'solution';
    this.loadPartners();
  }

  onTabChange(index: number): void {
    let partnerTypes: PartnerType[];
    // Map tab index to partner type
    if (this.isSuperAdmin()) {
      partnerTypes = ['growth', 'solution', 'provider', 'affiliate'];
    } else {
      partnerTypes = ['solution', 'provider', 'affiliate'];
    }
    this.currentTab = partnerTypes[index];
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading.set(true);
    this.error.set(null);

    let request$: Observable<any>;
    if (this.partnerId) {
      request$ = this.partnerService.getByRegisteredPartner(this.currentTab, this.partnerId);
    } else {
      request$ = this.partnerService.getPartners(this.currentTab);
    }

    request$.subscribe({
      next: (data) => {
        this.partners = data.member;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading partners:', error);
        this.error.set('Failed to load partners');
        this.loading.set(false);
        this.message.error(this.error() ?? '');
      }
    });
  }

  onRowClick(partner: any): void {
    this.router.navigate(['/partner', partner.id], {
      state: { partner }
    });
  }
}
