import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService, PartnerType } from '../../services/partner.service';
import { AuthService } from '../../services/auth.service';
import { TableComponent } from '../../components/ui/table/table.component';

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
  partners: any[] = [];
  loading = false;
  error: string | null = null;
  currentTab: PartnerType;
  isSuperAdmin = false;

  constructor(
    private partnerService: PartnerService,
    private authService: AuthService,
    private message: NzMessageService
  ) {
    // Check if user is super admin
    this.isSuperAdmin = this.authService.hasRole('ROLE_SUPER_ADMIN');
    this.currentTab = this.isSuperAdmin ? 'growth' : 'solution';
  }

  ngOnInit(): void {
    this.loadPartners();
  }

  onTabChange(index: number): void {
    let partnerTypes: PartnerType[] = [];
    // Map tab index to partner type
    if (this.isSuperAdmin) {
      partnerTypes = ['growth', 'solution', 'provider', 'affiliate'];
    } else {
      partnerTypes = ['solution', 'provider', 'affiliate'];
    }
    this.currentTab = partnerTypes[index];
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading = true;
    this.error = null;

    this.partnerService.getPartners(this.currentTab).subscribe({
      next: (data) => {
        this.partners = data.member;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading partners:', error);
        this.error = 'Failed to load partners';
        this.loading = false;
        this.message.error('Failed to load partners');
      }
    });
  }
}
