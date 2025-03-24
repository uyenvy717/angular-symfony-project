import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { TableComponent } from '../../components/ui/table/table.component';
import { PartnerService } from '../../services/partner.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-partner',
  imports: [CommonModule, NzTabsModule, NzSpinModule, NzMessageModule, TableComponent],
  standalone: true,
  templateUrl: './partner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerComponent implements OnInit {
  partners: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private partnerService: PartnerService,
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    console.log('PartnerComponent initialized');
    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated, loading partners...');
      this.loadPartners();
    } else {
      console.log('User is not authenticated, attempting login...');
      this.login();
    }
  }

  private login(): void {
    this.loading = true;
    console.log('Attempting login with credentials:', {
      email: 'admin@user',
      password: 'testpassword'
    });
    
    this.authService.login({
      email: 'admin@user',
      password: 'testpassword'
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loadPartners();
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.error = 'Authentication failed. Please check your credentials.';
        this.loading = false;
        this.message.error('Login failed');
      }
    });
  }

  loadPartners(): void {
    this.loading = true;
    this.error = null;
    console.log('Starting to load partners...');
    
    this.partnerService.getPartners().subscribe({
      next: (response) => {
        console.log('Partners API Response:', response);
        if (response && response.member) {
          console.log('Setting partners data:', response.member);
          this.partners = response.member;
        } else {
          console.error('Invalid response format:', response);
          this.error = 'Invalid data format received from server';
          this.message.error('Invalid data format');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading partners:', error);
        this.error = 'Failed to load partners. Please try again later.';
        this.loading = false;
        this.message.error('Failed to load partners');
      }
    });
  }
}
