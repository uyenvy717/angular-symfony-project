import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/ui/card/card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ClientComponent } from '../../client/client.component';
import { UserComponent } from '../../user/user.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerComponent } from '../../partner/partner.component';
import {
  ExtendedPartnerDto,
  PartnerTypeEnum,
} from 'src/app/services/partner.service';
import { ClientJsonldClientApiRead, UserApiJsonld } from '../../../api/models';

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
    RouterOutlet,
  ],
  standalone: true,
  templateUrl: './inside-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService],
})
export class InsideDashboardComponent implements OnInit {
  partnerData = signal<ExtendedPartnerDto | null>(null);
  partnerId = computed(() => this.partnerData()?.id ?? '');
  isGrowthPartner = computed(
    () => this.partnerData()?.['@type'] === PartnerTypeEnum.GROWTH
  );
  clientData = signal<ClientJsonldClientApiRead | null>(null);
  userData = signal<UserApiJsonld | null>(null);

  constructor(
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partner, client, user }) => {
      if (partner) {
        this.partnerData.set(partner);
        if (!this.partnerData()) {
          this.message.warning('No partner data found');
        }
      }

      if (client) {
        this.clientData.set(client);
        if (!this.clientData()) {
          this.message.warning('No client data found');
        }
      }

      if (user) {
        this.userData.set(user);
        if (!this.userData()) {
          this.message.warning('No user data found');
        }
      }
    });
  }
}
