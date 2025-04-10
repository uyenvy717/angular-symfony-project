import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/ui/card/card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ClientComponent } from '../../client/client.component';
import { UserComponent } from '../../user/user.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerComponent } from '../../partner/partner.component';

interface PartnerReference {
  id: string;
}

interface Partner {
  id?: string;
  name: string;
  email: string;
  startDate?: string;
  endDate?: string;
  clients: PartnerReference[];
  users: PartnerReference[];
  '@type': string;
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
    PartnerComponent,
  ],
  standalone: true,
  templateUrl: './inside-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService],
})
export class InsideDashboardComponent implements OnInit {
  partnerData: Partner | null = null;
  loading = false;

  constructor(private router: Router, private message: NzMessageService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.partnerData = (
        navigation.extras.state as { partner: Partner }
      ).partner;
      console.log('Partner Data:', this.partnerData);
    }
  }

  ngOnInit(): void {
    if (!this.partnerData) {
      console.warn('No partner data available');
      this.message.warning('No partner data available');
      return;
    }
  }

  get isGrowthPartner(): boolean {
    return this.partnerData?.['@type'] === 'GrowthPartner';
  }
}
