import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  buttonLabels: string[] = [];
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize buttons based on user role
    this.initializeButtons();
  }

  private initializeButtons(): void {
    const isGrowthPartner = this.authService.isGrowthPartner();
    
    // Always show Dashboard
    this.buttonLabels = ['Dashboard'];
    
    // Add Partner only for GrowthPartner users
    if (isGrowthPartner) {
      this.buttonLabels.push('Partner');
    }
    
    // Add other menu items
    this.buttonLabels.push('Client', 'User');
  }

  navigateTo(route: string) {
    if (route === 'Dashboard') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/' + route.toLowerCase() + 's']);
    }
  }
}
