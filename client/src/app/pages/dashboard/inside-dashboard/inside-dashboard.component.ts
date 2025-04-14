import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/ui/card/card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ClientComponent } from '../../client/client.component';
import { UserComponent } from '../../user/user.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerComponent } from '../../partner/partner.component';
import { Subscription } from 'rxjs';

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
export class InsideDashboardComponent implements OnInit, OnDestroy {
  private partnerDataSignal = signal<Partner | null>(null);
  partnerData = computed(() => this.partnerDataSignal());
  private paramsSub?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // Subscribe to both params and state changes
    this.paramsSub = this.route.params.subscribe(params => {
      const id = params['subId'] || params['id'];
      const state = window.history.state;

      if (state.partner && (state.partner.id === id)
      ) {
        this.partnerDataSignal.set(state.partner);
      } else {
        this.partnerDataSignal.set(null);
        this.message.warning('No partner data found in state');
        this.router.navigate(['/partners']);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }

  get isGrowthPartner(): boolean {
    return this.partnerData()?.['@type'] === 'GrowthPartner';
  }
}
