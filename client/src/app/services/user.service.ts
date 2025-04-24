import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiUserService } from '../api/services';
import { UserApiJsonld } from '../api/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly service = inject(ApiUserService);
  private users = signal<UserApiJsonld[]>([]);
  selectedUser = signal<UserApiJsonld | null>(null);

  fetchUsers() {
    return this.service
      .apiUsersGetCollection()
      .pipe(tap((response) => this.users.set(response.member)));
  }

  fetchByRegisteredPartner(id: string) {
    return this.service
      .getUsersByRegisteredPartner({ registeredPartnerId: id })
      .pipe(tap((response) => this.users.set(response.member)));
  }

  setSelectedUser(user: UserApiJsonld) {
    this.selectedUser.set(user);
  }

  getSelectedUser = computed(() => this.selectedUser());
}