import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/ui/card/card.component';
import { NzStatisticComponent } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import type { EChartsCoreOption } from 'echarts';
import { ChartModule } from './chart.module';
import { ClientService } from '../../../services/client.service';
import {
  PartnerService,
  PartnerTypeEnum,
} from '../../../services/partner.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CardComponent,
    NzStatisticComponent,
    NzButtonModule,
    ChartModule,
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private clientService = inject(ClientService);
  private partnerService = inject(PartnerService);
  protected authService = inject(AuthService);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  totalClients = signal<number>(0);
  avgDealSize = signal<number>(215);
  totalRevenue = computed(() => this.totalClients() * 225);

  partnerData = signal<Array<{ value: number; name: string }>>([]);
  partnerPieChart = computed<EChartsCoreOption>(() => ({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'No. Of',
        type: 'pie',
        stillShowZeroSum: false,
        radius: '50%',
        data: this.partnerData(),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }));

  clientData = signal<Array<{ value: number; name: string }>>([]);
  clientPieChart = computed<EChartsCoreOption>(() => ({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Clients Of',
        type: 'pie',
        stillShowZeroSum: false,
        radius: '50%',
        data: this.clientData(),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }));

  lineChartOption: EChartsCoreOption = {
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'March', 'Apr', 'May', 'June'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [183, 165, 274, 281, 267, 180],
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  barChartOption: EChartsCoreOption = {
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'March', 'Apr', 'May', 'June'],
    },
    yAxis: {
      type: 'value',
      max: 4,
      interval: 1,
      minInterval: 1,
    },
    series: [
      {
        data: [1, 1, 1, 3, 0, 0],
        type: 'bar',
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  commissionData: EChartsCoreOption = {
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'March', 'Apr', 'May', 'June'],
    },
    yAxis: {
      type: 'value',
    },
    legend: {
      orient: 'horizontal',
      top: 'bottom',
    },
    series: [
      {
        name: 'Growth Partners',
        data: [20, 20, 10, 15, 25, 10],
        type: 'bar',
        stack: 'x',
      },
      {
        name: 'Other Partners',
        data: [5, 3, 5, 10, 11, 3],
        type: 'bar',
        stack: 'x',
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  ngOnInit() {
    this.getClients();
    this.getPartners();
  }

  getClients() {
    this.loading.set(true);
    this.error.set(null);

    this.clientService.fetchClients().subscribe({
      next: () => {
        this.loading.set(false);
        this.totalClients.set(this.clientService.getTotalClients());

        const growthClients =
          this.clientService.getClientByPartner(PartnerTypeEnum.GROWTH)
            ?.length || 0;
        const sparClients =
          this.clientService.getClientByPartner(PartnerTypeEnum.SOLUTION)
            ?.length || 0;
        const sProvClients =
          this.clientService.getClientByPartner(PartnerTypeEnum.PROVIDER)
            ?.length || 0;
        const afflClients =
          this.clientService.getClientByPartner(PartnerTypeEnum.AFFILIATE)
            ?.length || 0;

        const newData = [
          ...(growthClients > 0 ? [{ value: growthClients, name: 'GP' }] : []),
          ...(sparClients > 0 ? [{ value: sparClients, name: 'Spar' }] : []),
          ...(sProvClients > 0 ? [{ value: sProvClients, name: 'SProv' }] : []),
          ...(afflClients > 0 ? [{ value: afflClients, name: 'Affl' }] : []),
        ];

        this.clientData.set(newData);
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.loading.set(false);
        this.error.set('Failed to load clients');
      },
    });
  }

  getPartners() {
    this.loading.set(true);
    this.error.set(null);

    if (this.authService.isSuperAdmin()) {
      this.partnerService.fetchPartners().subscribe({
        next: () => {
          this.loading.set(false);
          const growthPartners =
            this.partnerService.getPartnerByType(PartnerTypeEnum.GROWTH)
              ?.length || 0;
          const sparPartners =
            this.partnerService.getPartnerByType(PartnerTypeEnum.SOLUTION)
              ?.length || 0;
          const sProvPartners =
            this.partnerService.getPartnerByType(PartnerTypeEnum.PROVIDER)
              ?.length || 0;
          const afflPartners =
            this.partnerService.getPartnerByType(PartnerTypeEnum.AFFILIATE)
              ?.length || 0;

          const newData = [
            ...(growthPartners > 0
              ? [{ value: growthPartners, name: 'GP' }]
              : []),
            ...(sparPartners > 0
              ? [{ value: sparPartners, name: 'Spar' }]
              : []),
            ...(sProvPartners > 0
              ? [{ value: sProvPartners, name: 'SProv' }]
              : []),
            ...(afflPartners > 0
              ? [{ value: afflPartners, name: 'Affl' }]
              : []),
          ];

          this.partnerData.set(newData);
        },
        error: (err) => {
          console.error('Error loading partners:', err);
          this.loading.set(false);
          this.error.set('Failed to load partners');
        },
      });
    } else if (this.authService.isGrowthPartner()) {
      this.partnerService.fetchByType(PartnerTypeEnum.SOLUTION).subscribe({
        next: () => {
          const sparPartners =
            this.partnerService.getPartnerByType(PartnerTypeEnum.SOLUTION)
              ?.length || 0;

          this.partnerService.fetchByType(PartnerTypeEnum.PROVIDER).subscribe({
            next: () => {
              const sProvPartners =
                this.partnerService.getPartnerByType(PartnerTypeEnum.PROVIDER)
                  ?.length || 0;

              this.partnerService
                .fetchByType(PartnerTypeEnum.AFFILIATE)
                .subscribe({
                  next: () => {
                    const afflPartners =
                      this.partnerService.getPartnerByType(
                        PartnerTypeEnum.AFFILIATE
                      )?.length || 0;

                    const newData = [
                      ...(sparPartners > 0
                        ? [{ value: sparPartners, name: 'Spar' }]
                        : []),
                      ...(sProvPartners > 0
                        ? [{ value: sProvPartners, name: 'SProv' }]
                        : []),
                      ...(afflPartners > 0
                        ? [{ value: afflPartners, name: 'Affl' }]
                        : []),
                    ];

                    this.partnerData.set(newData);
                    this.loading.set(false);
                  },
                  error: (err) => {
                    console.error('Error loading affiliate partners:', err);
                    this.loading.set(false);
                    this.error.set('Failed to load affiliate partners');
                  },
                });
            },
            error: (err) => {
              console.error('Error loading solution providers:', err);
              this.loading.set(false);
              this.error.set('Failed to load solution providers');
            },
          });
        },
        error: (err) => {
          console.error('Error loading solution partners:', err);
          this.loading.set(false);
          this.error.set('Failed to load solution partners');
        },
      });
    }
  }
}
