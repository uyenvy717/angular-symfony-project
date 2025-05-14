import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiUserService } from '../api/services';
import { UserApiJsonld, UserJsonldUserApiPost } from '../api/models';

interface UserPostData {
  name?: string;
  email?: string;
  password?: string;
  partner?: string;
  isActive?: boolean;
}

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

  createUser(user: UserJsonldUserApiPost) {
    return this.service.apiUsersPost({
      body: user
    });
  }

  updateUser(id: string, user: UserJsonldUserApiPost) {
    return this.service.apiUsersIdPatch({
      id: id,
      body: user
    });
  }
}