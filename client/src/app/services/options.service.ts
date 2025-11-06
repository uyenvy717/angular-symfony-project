import { computed, Injectable, signal } from '@angular/core';

export interface OptionType {
  label: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class OptionsService {
  private _role = signal<string | null>(null);
  // private _partnerOptions = signal<any[]>([]);
  private _roleOptions = signal<OptionType[]>([]);
  // private _partnerTabs = signal<any[]>([]);

  // Called after login or when role changes
  setRole(role: string) {
    this._role.set(role);
    this.loadOptionsForRole(role);
    console.log(this._role());
  }

  private loadOptionsForRole(role: string) {
    // if (role === 'ROLE_SUPER_ADMIN') {
    //   this._roleOptions.set([
    //     { label: 'Super Admin', value: 'ROLE_SUPER_ADMIN' },
    //     { label: 'Admin', value: 'ROLE_ADMIN' },
    //     { label: 'User', value: 'ROLE_USER' }
    //   ]);
    //   // this._partnerOptions.set([
    //   //   { label: 'Partner A', value: 'a' },
    //   //   { label: 'Partner B', value: 'b' }
    //   // ]);
    //   // this._partnerTabs.set(['Tab1', 'Tab2']);
    // } else if (role === 'ROLE_ADMIN') {
      this._roleOptions.set([
        { label: 'Admin', value: 'ROLE_ADMIN' },
        { label: 'User', value: 'ROLE_USER' }
      ]);
    // }
  }

  // Getters
  role = computed(() => this._role());
  // partnerOptions = computed(() => this._partnerOptions());
  roleOptions = computed(() => this._roleOptions());
  // partnerTabs = computed(() => this._partnerTabs());
}