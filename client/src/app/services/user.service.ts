import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiUserService } from '../api/services';
import { UserApiJsonld } from '../api/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly service = inject(ApiUserService);
  private users = signal<UserApiJsonld[]>([]);

  fetchUsers() {
    return this.service
      .apiUsersGetCollection()
      .pipe(tap((response) => this.users.set(response.member)));
  }

  fetchUser(id: string) {
    return this.service.apiUsersIdGet({ id: id }).pipe(
      tap((user) => {
        this.users.update((users) => {
          users.push(user);
          return users;
        });
      })
    );
  }

  fetchByRegisteredPartner(id: string) {
    return this.service
      .getUsersByRegisteredPartner({ registeredPartnerId: id })
      .pipe(tap((response) => this.users.set(response.member)));
  }

  getUserById(id: string) {
    return this.users().find((user) => user.id === id);
  }
}