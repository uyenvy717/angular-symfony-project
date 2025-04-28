import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  ApiAffiliatePartnerService,
  ApiPartnerService,
  ApiSolutionPartnerService,
  ApiSolutionProviderService,
} from '../api/services';
import {
  AffiliatePartnerApiJsonldRead,
  GrowthPartnerApiJsonldRead,
  PartnerApiJsonld,
  SolutionPartnerApiJsonldRead,
  SolutionProviderApiJsonldRead,
} from '../api/models';

export type PartnerType =
  | 'GrowthPartner'
  | 'SolutionPartner'
  | 'SolutionProvider'
  | 'AffiliatePartner';

export enum PartnerTypeEnum {
  GROWTH = 'GrowthPartner',
  SOLUTION = 'SolutionPartner',
  PROVIDER = 'SolutionProvider',
  AFFILIATE = 'AffiliatePartner',
}

export type PartnerDto = PartnerApiJsonld;

export type ResponsePartnerType = 
  | GrowthPartnerApiJsonldRead
  | SolutionPartnerApiJsonldRead
  | SolutionProviderApiJsonldRead
  | AffiliatePartnerApiJsonldRead;

export interface ExtendedPartnerDto extends PartnerDto {
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private readonly service = inject(ApiPartnerService);
  private readonly spaService = inject(ApiSolutionPartnerService);
  private readonly sprService = inject(ApiSolutionProviderService);
  private readonly aService = inject(ApiAffiliatePartnerService);
  private partners = signal<ExtendedPartnerDto[]>([]);
  selectedPartner = signal<ExtendedPartnerDto | null>(null);

  fetchPartners() {
    return this.service.apiPartnersGetCollection().pipe(
      tap(response => this.partners.set(response.member as ExtendedPartnerDto[]))
    );
  }

  fetchByRegisteredPartner(type: PartnerType, id: string) {
    let request$: Observable<{ member: Array<ExtendedPartnerDto> }>;
    if (type === PartnerTypeEnum.SOLUTION) {
      request$ = this.spaService.getSolutionPartnersByRegisteredPartner({ registeredPartnerId: id }) as Observable<{ member: Array<ExtendedPartnerDto> }>;
    } else if (type === PartnerTypeEnum.PROVIDER) {
      request$ = this.sprService.getSolutionProvidersByRegisteredPartner({ registeredPartnerId: id }) as Observable<{ member: Array<ExtendedPartnerDto> }>;
    } else {
      request$ = this.aService.getAffiliatePartnersByRegisteredPartner({ registeredPartnerId: id }) as Observable<{ member: Array<ExtendedPartnerDto> }>;
    }

    return request$.pipe(
      tap(response => {
        // Update the partners signal with the filtered results
        this.partners.set(response.member);
      })
    );
  }

  fetchByType(type: PartnerType) {
    let request$: Observable<{ member: Array<ExtendedPartnerDto> }>;
    if (type === PartnerTypeEnum.SOLUTION) {
      request$ = this.service.apiSolutionPartnersGetCollection() as Observable<{ member: Array<ExtendedPartnerDto> }>;
    } else if (type === PartnerTypeEnum.PROVIDER) {
      request$ = this.service.apiSolutionProvidersGetCollection() as Observable<{ member: Array<ExtendedPartnerDto> }>;
    } else {
      request$ = this.service.apiAffiliatePartnersGetCollection() as Observable<{ member: Array<ExtendedPartnerDto> }>;
    }

    return request$.pipe(
      tap(response => {
        // Update the partners signal with the filtered results
        this.partners.set(response.member);
      })
    );
  }

  getPartnerByType(type: PartnerType) {
    return this.partners().filter((partner) => partner['@type'] === type);
  }

  setSelectedPartner(partner: ExtendedPartnerDto) {
    this.selectedPartner.set(partner);
  }

  getSelectedPartner = computed(() => this.selectedPartner());
} 