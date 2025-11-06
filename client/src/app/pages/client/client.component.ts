import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/ui/table/table.component';
import { ClientService } from '../../services/client.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ClientJsonldClientApiRead } from '../../api/models';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ButtonComponent } from '../../components/ui/button/button.component';
import {
  FormComponent,
  FormField,
} from '../../components/ui/form/form.component';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { OptionType } from '../../services/options.service';

type ModalMode = 'create' | 'edit';

interface Client {
  '@id': string;
  '@type': string;
  active: boolean;
  email: string;
  name: string;
  partner: {
    '@id': string;
    '@type': string;
    registeredPartner?: string;
    registeredPartnerName?: string;
    name: string;
  };
  startDate: string;
  partnerName?: string;
}

@Component({
  selector: 'app-client',
  imports: [
    CommonModule,
    TableComponent,
    NzSpinModule,
    ReactiveFormsModule,
    NzModalModule,
    NzButtonModule,
    ButtonComponent,
    FormComponent,
  ],
  standalone: true,
  templateUrl: './client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService],
})
export class ClientComponent implements OnInit {
  partnerId = input<string>('');

  columns = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Email',
      key: 'email',
    },
    {
      title: 'Start Date',
      key: 'startDate',
      render: (data: ClientJsonldClientApiRead) =>
        data.startDate
          ? new Date(data.startDate).toLocaleDateString()
          : 'No data',
    },
    {
      title: 'Registered Partner',
      key: 'partner.name',
      render: (data: ClientJsonldClientApiRead) => {
        if (data.partner?.['@type'] === 'GrowthPartner') {
          return '';
        }
        return data.partner?.name || '';
      },
    },
    {
      title: 'Registered Growth Partner',
      key: 'partner.registeredPartnerName',
      render: (data: Client) => {
        if (data.partner?.['@type'] === 'GrowthPartner') {
          return data.partner.name || '';
        }
        return data.partner?.registeredPartnerName || '';
      },
    },
  ];
  clients = signal<ClientJsonldClientApiRead[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  router = inject(Router);
  private clientService = inject(ClientService);
  protected authService = inject(AuthService);
  private partnerService = inject(PartnerService);

  canManageClients = computed(() => this.authService.isNotAdmin());
  isModalVisible = signal<boolean>(false);
  modalMode = signal<ModalMode>('create');
  selectedClient = signal<ClientJsonldClientApiRead | null>(null);

  createForm: FormGroup;
  private fb = inject(FormBuilder);

  partnerOptions = signal<OptionType[]>([]);

  formFields = computed<FormField[]>(() => [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      errorMessages: {
        required: 'Name is required',
        email: ''
      }
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      errorMessages: {
        required: 'Email is required',
        email: 'Invalid email format'
      }
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Start Date',
      required: false
    },
    {
      name: 'partner',
      type: 'select',
      label: 'Partner',
      required: true,
      options: this.partnerOptions()
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      required: false
    }
  ]);
  firstPartnerOption = computed(() => this.partnerOptions()[0]?.value || null);
  currentPartner = computed(() => this.partnerOptions().find(f => f.value === this.selectedClient()?.partner?.['@id'])?.value || null);

  constructor(private message: NzMessageService) {
    this.createForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      startDate: [null],
      partner: [this.firstPartnerOption(), [Validators.required]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadRelatedPartners();
  }

  loadClients(): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.partnerId()) {
      this.clientService.fetchByRegisteredPartner(this.partnerId()).subscribe({
        next: (clients) => {
          this.clients.set(clients.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading clients:', err);
          this.loading.set(false);
          this.error.set('Failed to load clients');
          this.message.error('Failed to load clients');
        },
      });
    } else {
      this.clientService.fetchClients().subscribe({
        next: (clients) => {
          this.clients.set(clients.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading clients:', err);
          this.loading.set(false);
          this.error.set('Failed to load clients');
          this.message.error('Failed to load clients');
        },
      });
    }
  }

  loadRelatedPartners() {
    if (this.authService.isSuperAdmin()) {
      this.partnerService.fetchPartners().subscribe({
        next: (response) => {
          const options = response.member.map((partner: any) => ({
            label: partner.name,
            value: partner['@id']
          }));
          this.partnerOptions.set(options);
        }
      });
    } else {
      const options: OptionType[] = [];

      this.partnerService.fetchPartner(this.authService.getPartnerId()).subscribe({
        next: (response) => {
          options.push({
            label: response?.name || '',
            value: response['@id'] || ''
          });
        }
      });

      if (this.authService.isGrowthPartner()) {
        this.partnerService.fetchAllTypes().subscribe({
          next: (response) => {
            options.push(
              ...response.map((partner: any) => ({
                label: partner.name,
                value: partner['@id']
              }))
            );
          }
        });
      }
      this.partnerOptions.set(options);
    }
  }

  onRowClick(client: ClientJsonldClientApiRead) {
    if (!client['@id']) {
      this.message.error('Invalid client ID');
      return;
    }
    const id = client['@id'].split('/').pop() || '';
    if (!id) {
      this.message.error('Invalid client ID');
      return;
    }
    this.router.navigate(['/clients', id]);
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.selectedClient.set(null);
    this.createForm.reset({
      isActive: true,
      partner: this.firstPartnerOption()
    });
    this.isModalVisible.set(true);
  }

  openEditModal(client: ClientJsonldClientApiRead): void {
    this.modalMode.set('edit');
    this.selectedClient.set(client);
    let startDate = client.startDate;
    if (startDate) {
      startDate = new Date(startDate).toISOString().split('T')[0];
    }

    this.createForm.patchValue({
      name: client.name,
      email: client.email,
      startDate: startDate,
      partner: this.currentPartner(),
      isActive: client.active,
    });
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedClient.set(null);
  }

  submitForm = (): void =>  {
    if (this.createForm.invalid) return;

    const formData = this.createForm.value;
    if (formData.startDate) {
      formData.startDate = new Date(formData.startDate).toISOString().split('T')[0];
    }

    this.loading.set(true);
    
    if (this.modalMode() === 'create') {
      this.clientService.createClient(formData).subscribe({
        next: () => {
          this.message.success('Client created successfully');
          this.loadClients();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to create client:', err);
          this.message.error('Failed to create client');
        },
      });
      this.loading.set(false);
    } else {
      // Edit mode
      const clientId = this.selectedClient()?.['@id'];
      if (!clientId) {
        this.message.error('Invalid client ID');
        return;
      }

      const id = clientId.split('/').pop() || '';
      this.clientService.updateClient(id, formData).subscribe({
        next: () => {
          this.message.success('Client updated successfully');
          this.loadClients();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to update client:', err);
          this.message.error('Failed to update client');
        },
      });
      this.loading.set(false);
    }
  };
}
