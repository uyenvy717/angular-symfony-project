import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ExtendedPartnerDto,
  PartnerService,
  PartnerType,
  PartnerTypeEnum,
} from '../../services/partner.service';
import { AuthService } from '../../services/auth.service';
import { TableComponent } from '../../components/ui/table/table.component';

@Component({
  selector: 'app-partner',
  imports: [
    CommonModule,
    NzTabsModule,
    NzSpinModule,
    TableComponent,
    RouterOutlet,
  ],
  standalone: true,
  templateUrl: './partner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService],
})
export class PartnerComponent implements OnInit {
  partnerId = input<string>('');

  columns = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Email',
      key: 'email',
    },
    {
      title: 'Start Date',
      key: 'startDate',
      render: (data: ExtendedPartnerDto) =>
        data.startDate
          ? new Date(data.startDate).toLocaleDateString()
          : 'No data',
    },
    {
      title: 'End Date',
      key: 'endDate',
      render: (data: ExtendedPartnerDto) =>
        data.endDate ? new Date(data.endDate).toLocaleDateString() : 'No data',
    },
  ];
  partners = signal<ExtendedPartnerDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  currentTab = signal<PartnerType>(PartnerTypeEnum.SOLUTION);
  private partnerService = inject(PartnerService);
  private authService = inject(AuthService);
  adminViewMode = computed(
    () => this.partnerId() === '' && this.authService.isSuperAdmin()
  );
  partnerTabs = computed(() => [
    { title: 'Growth Partner', isTabVisible: this.adminViewMode() },
    { title: 'Solution Partner', isTabVisible: true },
    { title: 'Solution Provider', isTabVisible: true },
    { title: 'Affiliate Partner', isTabVisible: true },
  ]);

  constructor(
    private message: NzMessageService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentTab.set(
      this.adminViewMode() ? PartnerTypeEnum.GROWTH : PartnerTypeEnum.SOLUTION
    );
    this.loadPartners();
  }

  onTabChange(index: number): void {
    // Map tab index to partner type
    const partnerTypes = [
      PartnerTypeEnum.SOLUTION,
      PartnerTypeEnum.PROVIDER,
      PartnerTypeEnum.AFFILIATE,
    ];
    if (this.adminViewMode()) {
      partnerTypes.unshift(PartnerTypeEnum.GROWTH);
    }

    this.currentTab.set(partnerTypes[index]);
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.authService.isSuperAdmin() && this.adminViewMode()) {
      this.partnerService.fetchPartners().subscribe({
        next: () => {
          const filtered = this.partnerService.getPartnerByType(
            this.currentTab()
          );
          this.partners.set(filtered);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load partners:', err);
          this.loading.set(false);
          this.error.set('Failed to load partners');
          this.message.error('Failed to load partners');
        },
      });
    } else if (this.authService.isSuperAdmin() && !this.adminViewMode()) {
      this.partnerService
        .fetchByRegisteredPartner(this.currentTab(), this.partnerId())
        .subscribe({
          next: (partners) => {
            this.partners.set(partners.member);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Failed to load partners:', err);
            this.loading.set(false);
            this.error.set('Failed to load partners');
            this.message.error('Failed to load partners');
          },
        });
    } else {
      this.partnerService.fetchByType(this.currentTab()).subscribe({
        next: (partners) => {
          this.partners.set(partners.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load partners:', err);
          this.loading.set(false);
          this.error.set('Failed to load partners');
          this.message.error('Failed to load partners');
        },
      });
    }
  }

  onRowClick(partner: ExtendedPartnerDto): void {
    this.partnerService.setSelectedPartner(partner);
    this.router.navigate([partner.id], { relativeTo: this.route });
  }
}
