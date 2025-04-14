import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/ui/card/card.component';
import { NzStatisticComponent } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import type { EChartsOption } from 'echarts';
import { ChartModule } from './chart.module';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    CardComponent, 
    NzStatisticComponent, 
    NzButtonModule,
    ChartModule
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  lineChartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      smooth: true
    }],
    tooltip: {
      trigger: 'axis'
    }
  };

  pieChartOption: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'SProv' },
          { value: 735, name: 'Spa' },
          { value: 580, name: 'Affl' },
          { value: 484, name: 'GP' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
}
