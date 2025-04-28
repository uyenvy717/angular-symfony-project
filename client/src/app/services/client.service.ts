import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiClientService } from '../api/services';
import { ClientJsonldClientApiRead } from '../api/models';
import { PartnerType } from './partner.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly service = inject(ApiClientService);
  private clients = signal<ClientJsonldClientApiRead[]>([]);
  selectedClient = signal<ClientJsonldClientApiRead | null>(null);

  fetchClients() {
    return this.service
      .apiClientsGetCollection()
      .pipe(tap((response) => this.clients.set(response.member)));
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

  setSelectedClient(client: ClientJsonldClientApiRead) {
    this.selectedClient.set(client);
  }

  getSelectedClient = computed(() => this.selectedClient());

  getTotalClients = computed(() => this.clients()?.length);
}