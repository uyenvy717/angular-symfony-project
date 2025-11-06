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
import { Router, RouterOutlet } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ExtendedPartnerDto,
  PartnerService,
  PartnerType,
  PartnerTypeEnum,
} from '../../services/partner.service';
import { AuthService } from '../../services/auth.service';
import { TableComponent } from '../../components/ui/table/table.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormComponent,
  FormField,
} from '../../components/ui/form/form.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-partner',
  imports: [
    CommonModule,
    NzTabsModule,
    NzSpinModule,
    TableComponent,
    RouterOutlet,
    ButtonComponent,
    FormComponent,
    NzModalModule,
  ],
  standalone: true,
  templateUrl: './partner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService],
})
export class PartnerComponent implements OnInit {
  private partnerService = inject(PartnerService);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  router = inject(Router);
  createForm: FormGroup;
  private fb = inject(FormBuilder);

  partnerId = input<string>('');
  adminViewMode = computed(
    () => this.partnerId() === '' && this.authService.isSuperAdmin()
  );

  currentTab = signal<PartnerType>(PartnerTypeEnum.SOLUTION);
  columns = computed(() => {
    const baseColumns: { title: string; key: string; render?: (data: ExtendedPartnerDto) => string }[] = [
      { title: 'Name', key: 'name' },
      { title: 'Email', key: 'email' },
    ];

    // Only show Registered Partner if not Growth Partner
    if (this.currentTab() !== PartnerTypeEnum.GROWTH && this.adminViewMode()) {
      baseColumns.push({
        title: 'Registered Partner',
        key: 'registeredPartnerName',
        render: (data: ExtendedPartnerDto) => data.registeredPartnerName || 'N/A',
      });
    }

    baseColumns.push(
      {
        title: 'Start Date',
        key: 'startDate',
        render: (data: ExtendedPartnerDto) =>
          data.startDate
            ? new Date(data.startDate).toLocaleDateString()
            : 'No data',
      },
      {
        title: 'End Date',
        key: 'endDate',
        render: (data: ExtendedPartnerDto) =>
          data.endDate ? new Date(data.endDate).toLocaleDateString() : 'No data',
      }
    );

    return baseColumns;
  });
  partners = signal<ExtendedPartnerDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Single source of truth for partner types
  partnerTypeOptions = computed(() => {
    const allTypes = [
      { label: 'Growth Partner', value: PartnerTypeEnum.GROWTH },
      { label: 'Solution Partner', value: PartnerTypeEnum.SOLUTION },
      { label: 'Solution Provider', value: PartnerTypeEnum.PROVIDER },
      { label: 'Affiliate Partner', value: PartnerTypeEnum.AFFILIATE },
    ];
    // If not admin, exclude Growth Partner
    return this.adminViewMode() ? allTypes : allTypes.slice(1);
  });

  // Tabs use the same array
  partnerTabs = computed(() =>
    this.partnerTypeOptions().map(opt => ({
      label: opt.label,
      isTabVisible: true,
    }))
  );

  growthPartnerOptions = signal<{ label: string; value: string }[]>([]);
  isModalVisible = signal<boolean>(false);
  modalMode = signal<ModalMode>('create');
  selectedPartner = signal<ExtendedPartnerDto | null>(null);
  selectedPartnerType = signal<string>(this.partnerTypeOptions()[0].value);

  formFields = computed<FormField[]>(() => {
    const fields: FormField[] = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        required: true,
        errorMessages: {
          required: 'Name is required',
          email: '',
        },
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        errorMessages: {
          required: 'Email is required',
          email: 'Invalid email format',
        },
      },
      {
        name: 'contactPerson',
        type: 'email',
        label: 'Email of contact person',
        required: false,
        errorMessages: {
          required: '',
          email: 'Invalid email format',
        },
      },
      {
        name: 'startDate',
        type: 'date',
        label: 'Start Date',
        required: true,
        errorMessages: {
          required: 'Start Date is required',
          email: ''
        }
      },
      {
        name: 'endDate',
        type: 'date',
        label: 'End Date',
        required: false,
      }
    ];

    // Only add partnerType field in create mode
    if (this.modalMode() === 'create') {
      fields.push({
        name: 'partnerType',
        type: 'radio',
        label: 'Partner Type',
        required: true,
        options: this.partnerTypeOptions(),
      });
    }

    // Cause only Super Admin can assign/reassign a partner
    // so only show registeredPartner
    if (
      // when Super Admin editing a regular partner
      this.modalMode() === 'edit' && this.currentTab() !== PartnerTypeEnum.GROWTH && this.authService.isSuperAdmin() ||
      // or when Super Admin creating a new regular partner and do not determine a GP yet
      this.modalMode() === 'create' && this.selectedPartnerType() && this.selectedPartnerType() !== PartnerTypeEnum.GROWTH && this.adminViewMode()
    ) {
      fields.push(
        {
          name: 'registeredPartner',
          type: 'select',
          label: 'Growth Partner',
          required: true,
          options: this.growthPartnerOptions(),
        },
      );
    }

    return fields;
  });

  constructor() {
    this.createForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      contactPerson: [null, [Validators.email]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      renewalInterval: [null],
    });
  }

  // Preload data of partners and assignable GPs
  ngOnInit(): void {
    this.currentTab.set(this.partnerTypeOptions()[0].value);
    this.loadPartners();
    this.fetchGrowthPartnerOptions();
  }

  // Change if one specific type of partners is chose
  onTabChange(index: number): void {
    this.currentTab.set(this.partnerTypeOptions()[index].value);
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.authService.isSuperAdmin() && this.adminViewMode()) {
      this.partnerService.fetchPartners().subscribe({
        next: () => {
          const filtered = this.partnerService.getPartnerByType(
            this.currentTab()
          );
          this.partners.set(filtered);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load partners:', err);
          this.loading.set(false);
          this.error.set('Failed to load partners');
          this.message.error('Failed to load partners');
        },
      });
    } else if (this.authService.isSuperAdmin() && !this.adminViewMode()) {
      this.partnerService
        .fetchByRegisteredPartner(this.currentTab(), this.partnerId())
        .subscribe({
          next: (partners) => {
            this.partners.set(partners.member);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Failed to load partners:', err);
            this.loading.set(false);
            this.error.set('Failed to load partners');
            this.message.error('Failed to load partners');
          },
        });
    } else {
      this.partnerService.fetchByType(this.currentTab()).subscribe({
        next: (partners) => {
          this.partners.set(partners.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load partners:', err);
          this.loading.set(false);
          this.error.set('Failed to load partners');
          this.message.error('Failed to load partners');
        },
      });
    }
  }

  // Navigate to sub-dashboard of the selected partner
  onRowClick(partner: ExtendedPartnerDto) {
    this.router.navigate(['/partners', partner.id]);
  }

  openCreateModal() {
    this.modalMode.set('create');

    const defaultType = this.partnerTypeOptions()[0]?.value;
    // Make sure the field 'partnerType' is always included in the form when creating a partner
    if (!this.createForm.contains('partnerType')) {
      this.createForm.addControl('partnerType', this.fb.control(defaultType, [Validators.required]));
    }

    // Always reset the form
    this.createForm.reset({
      partnerType: defaultType,
    });

    const partnerTypeControl = this.createForm.get('partnerType');
    partnerTypeControl?.valueChanges.subscribe((value) => {
      this.handlePartnerTypeChange(value);
    });
    // Call it once with the initial value
    this.handlePartnerTypeChange(partnerTypeControl?.value);

    this.isModalVisible.set(true);
  }

  openEditModal(partner: ExtendedPartnerDto) {
    this.modalMode.set('edit');
    this.selectedPartner.set(partner);
    console.log(this.selectedPartner());
    // Remove/add controls based on adminViewMode and tab
    if (this.currentTab() === PartnerTypeEnum.GROWTH) {
      if (this.createForm.contains('registeredPartner')) {
        this.createForm.removeControl('registeredPartner');
      }
    } else {
      if (!this.createForm.contains('registeredPartner')) {
        this.createForm.addControl(
          'registeredPartner',
          this.fb.control(partner.registeredPartner || null, [Validators.required])
        );
      }
    }

    if (this.createForm.contains('partnerType')) {
      this.createForm.removeControl('partnerType');
    }

    let startDate = partner.startDate;
    let endDate = partner.endDate;
    if (startDate) {
      startDate = new Date(startDate).toISOString().split('T')[0];
    }
    if (endDate) {
      endDate = new Date(endDate).toISOString().split('T')[0];
    }

    this.createForm.patchValue({
      name: partner.name,
      email: partner.email,
      contactPerson: partner.contactPerson || null,
      startDate: startDate,
      endDate: endDate,
      registeredPartner: partner.registeredPartner || null,
    });

    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
  }

  submitForm = (): void => {
    if (this.createForm.invalid) return;
    const formData = this.createForm.value;
    this.loading.set(true);
    console.log('FormData', formData);

    if (this.modalMode() === 'create') {
      (this.partnerService.createPartner(formData.partnerType, formData) as any).subscribe(
        () => {
          this.message.success('Create partner successfully');
          this.isModalVisible.set(false);
          this.loadPartners();
          this.closeModal();
        },
        (err: any) => {
          console.error('Failed to create partner:', err);
          this.message.error('Failed to create partners');
        }
      );
      this.loading.set(false);
    } else {
      const partnerId = this.selectedPartner()?.id;
      if (!partnerId) {
        this.message.error('Invalid partner id');
        return;
      }

      (this.partnerService.updatePartner(this.currentTab(), partnerId, formData)as any).subscribe({
        next: () => {
          this.message.success('Partner updated successfully');
          this.loadPartners();
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Failed to update partners:', err);
          this.message.error('Failed to update partners');
        }
      });
      this.loading.set(false);
    }
  }

  fetchGrowthPartnerOptions() {
    if (this.authService.isSuperAdmin()) {
      this.partnerService.fetchByType(PartnerTypeEnum.GROWTH).subscribe({
        next: (partners) => {
          const options = partners.member.map((p: any) => ({
            label: p.name,
            value: p['@id'],
          }));
          this.growthPartnerOptions.set(options);

          // Set the value after options are loaded and control exists
          if (this.createForm.contains('registeredPartner') && options.length > 0) {
            this.createForm.get('registeredPartner')!.setValue(options[0].value);
          }
        }
      });
    } else if (this.authService.isGrowthPartner()) {
      this.partnerService.fetchPartner(this.authService.getPartnerId()).subscribe({
        next: (partner) => {
          const options = [{
            label: partner?.name || '',
            value: partner?.['@id'] || '',
          }];
          this.growthPartnerOptions.set(options);

          if (this.createForm.contains('registeredPartner') && options.length > 0) {
            this.createForm.get('registeredPartner')!.setValue(options[0].value);
          }
        }
      })
    }
  }

  handlePartnerTypeChange(value: string) {
    this.selectedPartnerType.set(value);
    if (value === PartnerTypeEnum.GROWTH) {
      this.createForm.removeControl('registeredPartner');
    } else {
      let matchedOption: { label: string; value: string } | undefined = this.growthPartnerOptions()[0];
      if (this.partnerId() !== '') {
        matchedOption = this.growthPartnerOptions().find(gp => gp.value.includes(this.partnerId()));
      }
      this.createForm.addControl('registeredPartner', this.fb.control(matchedOption?.value, [Validators.required]));
    }
  }
}
