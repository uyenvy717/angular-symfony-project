import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  imports: [CommonModule, ButtonComponent],
  standalone: true,
  templateUrl: './panel.component.html',
  styles: `
    :host {
      grid-area: navpanel;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  buttonLabels: string[] = ['Dashboard', 'Partner', 'Client', 'User'];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate(['/' + route.toLowerCase()]);
  }
}
