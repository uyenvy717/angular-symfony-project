import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiClientService } from '../api/services';
import { ClientJsonldClientApiRead } from '../api/models';
import { PartnerType } from './partner.service';

interface ClientPostData {
  name?: string;
  email?: string;
  startDate?: string;
  partner?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly service = inject(ApiClientService);
  private clients = signal<ClientJsonldClientApiRead[]>([]);

  fetchClients() {
    return this.service
      .apiClientsGetCollection()
      .pipe(tap((response) => this.clients.set(response.member)));
  }

  fetchClient(id: string) {
    return this.service.apiClientsIdGet({ id : id })
      .pipe(
        tap(client => {
          this.clients.update(clients => {
            clients.push(client);
            return clients;
          });
        })
      )
  }

  fetchByRegisteredPartner(id: string) {
    return this.service
      .getClientsByRegisteredPartner({ registeredPartnerId: id })
      .pipe(tap((response) => this.clients.set(response.member)));
  }

  getClientByPartner(type: PartnerType) {
    return this.clients().filter(
      (client) => client.partner?.['@type'] === type
    );
  }

  getClientById(id: string) {
    return this.clients().find((client) => {
      if (!client['@id']) throw new Error('Invalid client ID');
      return client['@id'].split('/').pop() === id
    });
  }

  getTotalClients = computed(() => this.clients()?.length);

  createClient(client: ClientPostData) {
    return this.service.apiClientsPost({
      body: client
    });
  }

  updateClient(id: string, client: ClientJsonldClientApiRead) {
    return this.service.apiClientsIdPatch({
      id: id,
      body: client,
    });
  }
}