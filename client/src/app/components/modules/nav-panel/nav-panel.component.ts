import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-panel',
  imports: [CommonModule, ButtonComponent],
  standalone: true,
  templateUrl: './nav-panel.component.html',
  styles: `
    :host {
      grid-area: navpanel;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPanelComponent {
  buttonLabels: string[] = ['Dashboard', 'Partner', 'Client', 'User'];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    if (route === 'Dashboard') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/' + route.toLowerCase() + 's']);
    }
  }
}
