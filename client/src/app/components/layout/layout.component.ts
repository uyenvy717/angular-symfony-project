import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../modules/page-header/page-header.component';
import { NavPanelComponent } from '../modules/nav-panel/nav-panel.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [PageHeaderComponent, NavPanelComponent, RouterModule],
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
