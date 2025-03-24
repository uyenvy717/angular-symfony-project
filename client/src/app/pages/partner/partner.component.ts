import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TableComponent } from '../../components/ui/table/table.component';

@Component({
  selector: 'app-partner',
  imports: [CommonModule, NzTabsModule, TableComponent],
  standalone: true,
  templateUrl: './partner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerComponent {}
