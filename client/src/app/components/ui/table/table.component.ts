import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { ButtonComponent } from '../button/button.component';

interface Column {
  title: string;
  key: string;
  render?: (data: any) => string;
}

@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerComponent,
    RouterLink,
    ModalComponent,
    NzTagComponent,
    ButtonComponent,
  ],
  standalone: true,
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  data = input<any[]>([]);
  columns = input<Column[]>([]);
  showStatusButton = input<boolean>(false);
  canManageAccounts = input<boolean>(true);
  disableButtonFn = input<(row: any) => boolean>(() => false);

  handleEdit = output<any>();
  handleStatus = output<any>();
  rowClick = output<any>();
}
