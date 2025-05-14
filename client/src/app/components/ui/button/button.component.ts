import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import {
  EditOutline,
  PauseCircleOutline,
  PlayCircleOutline,
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  label = input<string>('Click me');
  buttonType = input<string>('base-btn');
  color = input<string>('magenta');
  icon = input<string>('');
  disabled = input<boolean>(false);

  private iconService = inject(NzIconService);

  constructor() {
    // Register the icons
    this.iconService.addIcon(
      ...[EditOutline, PlayCircleOutline, PauseCircleOutline]
    );
  }
}
