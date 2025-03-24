import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/ui/card/card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-inside-dashboard',
  imports: [CommonModule, CardComponent, NzButtonModule],
  standalone: true,
  templateUrl: './inside-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsideDashboardComponent {}
