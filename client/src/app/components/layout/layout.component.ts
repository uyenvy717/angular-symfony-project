import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../modules/header/header.component';
import { PanelComponent } from '../modules/panel/panel.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, PanelComponent, RouterModule],
  templateUrl: './layout.component.html',
  standalone: true,
  styles: `
    main {
      grid-area: main;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
