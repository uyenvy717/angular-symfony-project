import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/ui/table/table.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service';
import { UserApiJsonld } from '../../api/models';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/ui/button/button.component';
import {
  FormComponent,
  FormField,
} from '../../components/ui/form/form.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptionsService, OptionType } from '../../services/options.service';
import {
  ExtendedPartnerDto,
  PartnerService,
} from '../../services/partner.service';
import { AuthService } from '../../services/auth.service';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    TableComponent,
    NzSpinModule,
    ButtonComponent,
    FormComponent,
    NzModalModule,
  ],
  standalone: true,
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzMessageService],
})
export class UserComponent implements OnInit {
  partnerData = input<ExtendedPartnerDto | null>(null);
  partnerId = computed(() => this.partnerData()?.id ?? '');

  columns = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Email',
      key: 'userIdentifier',
    },
    {
      title: 'Account Status',
      key: 'active',
      render: (data: UserApiJsonld) => (data.active ? 'Active' : 'Inactive'),
    },
    {
      title: 'Last Seen',
      key: 'lastLoggedIn',
      render: (data: UserApiJsonld) =>
        data.lastLoggedIn
          ? new Date(data.lastLoggedIn).toLocaleDateString()
          : 'Never',
    },
  ];
  users = signal<UserApiJsonld[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  router = inject(Router);
  private userService = inject(UserService);
  private partnerService = inject(PartnerService);
  private authService = inject(AuthService);
  private optionService = inject(OptionsService);

  canManageAccounts = computed(() => !(!this.partnerData() && this.authService.isNotAdmin()));
  isModalVisible = signal<boolean>(false);
  modalMode = signal<ModalMode>('create');
  editingUser = signal<UserApiJsonld | null>(null);

  createForm: FormGroup;
  private fb = inject(FormBuilder);

  partnerOptions = signal<OptionType[]>([]);

  formFields = computed<FormField[]>(() => {
    const baseFields: FormField[] = [
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
        name: 'partner',
        type: 'select',
        label: 'Partner',
        required: true,
        options: this.partnerOptions()
      },
      {
        name: 'roles',
        type: 'radio',
        label: 'Role',
        required: true,
        options: this.optionService.roleOptions()
      },
      {
        name: 'isActive',
        type: 'checkbox',
        label: 'Active',
        required: false
      }
    ];

    if (this.modalMode() === 'create') {
      // Insert email and password fields for create mode
      baseFields.splice(1, 0, {
        name: 'email',
        type: 'email',
        label: 'Email',
        errorMessages: {
          required: 'Email is required',
          email: 'Invalid email format'
        }
      });
      baseFields.splice(3, 0, {
        name: 'password',
        type: 'text',
        label: 'Password',
        errorMessages: {
          required: 'Password is required',
          email: ''
        }
      });
    }

    return baseFields;
  });

  constructor(private message: NzMessageService) {
    this.createForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      partner: [this.partnerOptions()[0]?.value || null, [Validators.required]],
      password: [null, [Validators.required]],
      roles: [this.optionService.roleOptions()[0]?.value || null, [Validators.required]],
      isActive: [true],
    });

    // This effect react to partnerId changes
    effect(() => {
      if (this.partnerId()) {
        this.loadUsers();
        this.loadRelatedPartner();
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRelatedPartner();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.partnerId()) {
      this.userService.fetchByRegisteredPartner(this.partnerId()).subscribe({
        next: (users) => {
          this.users.set(users.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.loading.set(false);
          this.error.set('Failed to load users');
          this.message.error('Failed to load users');
        },
      });
    } else {
      this.userService.fetchUsers().subscribe({
        next: (users) => {
          this.users.set(users.member);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.loading.set(false);
          this.error.set('Failed to load users');
          this.message.error('Failed to load users');
        },
      });
    }
  }
  
  loadRelatedPartner() {
    if (this.partnerId()) {
      const option = [{
        label: this.partnerData()?.name || '',
        value: this.partnerData()?.['@id'] || ''
      }];
      this.partnerOptions.set(option);
    } else {
      this.partnerService.fetchPartner(this.authService.getPartnerId()).subscribe({
        next: (response) => {
          const option = [{
            label: response?.name || '',
            value: response['@id'] || ''
          }];
          this.partnerOptions.set(option);
        }
      })
    }
  }

  onRowClick(user: UserApiJsonld) {
    if (!user['@id']) {
      this.message.error('Invalid client ID');
      return;
    }
    const id = user['@id'].split('/').pop() || '';
    if (!id) {
      this.message.error('Invalid client ID');
      return;
    }
    this.router.navigate(['/users', id]);
  }

  openCreateModal(): void {
    this.modalMode.set('create');

    // Add controls if missing
    if (!this.createForm.contains('email')) {
      this.createForm.addControl('email', this.fb.control(null, [Validators.required, Validators.email]));
    }
    if (!this.createForm.contains('password')) {
      this.createForm.addControl('password', this.fb.control(null, [Validators.required]));
    }

    this.createForm.reset({
      isActive: true,
      partner: this.partnerOptions()[0]?.value || null,
      roles: this.optionService.roleOptions()[0]?.value || null,
    });

    this.isModalVisible.set(true);
  }

  openEditModal(user: UserApiJsonld): void {
    this.modalMode.set('edit');
    this.editingUser.set(user);

    // Remove controls if present
    if (this.createForm.contains('email')) {
      this.createForm.removeControl('email');
    }
    if (this.createForm.contains('password')) {
      this.createForm.removeControl('password');
    }

    let roleValue = 'ROLE_USER'; // default
    if (user.roles?.includes('ROLE_SUPER_ADMIN')) {
      roleValue = 'ROLE_SUPER_ADMIN';
    } else if (user.roles?.includes('ROLE_ADMIN')) {
      roleValue = 'ROLE_ADMIN';
    }

    this.createForm.patchValue({
      name: user.name,
      partner: this.partnerOptions()[0]?.value || null,
      roles: roleValue,
      isActive: user.active,
    });

    this.isModalVisible.set(true);
  }

  closeModal() {
    this.isModalVisible.set(false);
  }

  changeStatus(user: UserApiJsonld) {
    const userId = user?.['@id'];
    if (!userId) {
      this.message.error('Invalid user ID');
      return;
    }
    const id = userId.split('/').pop() || '';
    const editData = { isActive: !user.active };

    this.userService.updateUser(id, editData).subscribe({
      next: () => {
        this.message.success('User updated successfully');
        this.loadUsers();
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to update user:', err);
        this.message.error('Failed to update user');
      }
    });
    this.loading.set(false);
  }

  submitForm = (): void => {
    if (this.createForm.invalid) return;

    const formData = this.createForm.value;
    if (!Array.isArray(formData.roles)) {
      formData.roles = [formData.roles];
    }
    this.loading.set(true);

    if (this.modalMode() == 'create') {
      this.userService.createUser(formData).subscribe({
        next: () => {
          this.message.success('User created successfully');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to create user:', err);
          this.message.error('Failed to create user');
        }
      });
      this.loading.set(false);
    } else {
      const userId = this.editingUser()?.['@id'];
      if (!userId) {
        this.message.error('Invalid user ID');
        return;
      }
      const id = userId.split('/').pop() || '';

      this.userService.updateUser(id, formData).subscribe({
        next: (res) => {
          this.message.success('User updated successfully');
          this.authService.setRoles(res?.roles);
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to update user:', err);
          this.message.error('Failed to update user');
        }
      });
      this.loading.set(false);
    }
  }

  // This method to determine if the action buttons should be disabled for a given row
  shouldDisableButton = (row: any): boolean => {
    return !!(this.optionService.role() === 'ROLE_ADMIN' && row.roles?.includes('ROLE_SUPER_ADMIN'));
  }
}
