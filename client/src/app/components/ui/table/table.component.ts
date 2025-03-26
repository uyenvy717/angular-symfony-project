import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-table',
  imports: [CommonModule, NzTableModule, NzDividerComponent, RouterLink, ModalComponent],
  standalone: true,
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnChanges {
  @Input() data: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Table data changed:', this.data);
    }
  }

  // showModal() {
  //   ModalComponent;
  // }
}
