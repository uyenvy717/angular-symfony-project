import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-card',
  imports: [CommonModule, NzCardModule, TableComponent],
  standalone: true,
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() showTable: boolean = false;
  @Input() showContent: boolean = false;
  @Input() partnerData: any;
}
