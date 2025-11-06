import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, NzModalModule],
  standalone: true,
  templateUrl: './modal.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  isVisible = signal<boolean>(false);

  showModal(): void {
    this.isVisible.set(true);
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible.set(false);
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible.set(false);
  }
}
