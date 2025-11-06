import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, Observable, tap } from 'rxjs';
import {
  ApiAffiliatePartnerService,
  ApiGrowthPartnerService,
  ApiPartnerService,
  ApiSolutionPartnerService,
  ApiSolutionProviderService,
} from '../api/services';
import {
  AffiliatePartnerApiJsonldPost,
  AffiliatePartnerApiJsonldRead,
  GrowthPartnerApiJsonldRead,
  PartnerApiJsonld,
  SolutionPartnerApiJsonldRead,
  SolutionProviderApiJsonldRead,
} from '../api/models';
import { map } from 'rxjs/operators';

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
  contactPerson?: string;
  registeredPartnerName?: string;
  registeredPartner?: string;
  renewalInterval?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private readonly service = inject(ApiPartnerService);
  private readonly gService = inject(ApiGrowthPartnerService);
  private readonly spaService = inject(ApiSolutionPartnerService);
  private readonly sprService = inject(ApiSolutionProviderService);
  private readonly aService = inject(ApiAffiliatePartnerService);
  private partners = signal<ExtendedPartnerDto[]>([]);

  // For SUPER_ADMIN
  fetchPartners() {
    return this.service.apiPartnersGetCollection().pipe(
      tap(response => this.partners.set(response.member as ExtendedPartnerDto[]))
    );
  }

  // For SUPER_ADMIN and the partner's users
  fetchPartner(id: ExtendedPartnerDto['id']) {
    if (!id) throw new Error('Partner ID is required');
    return this.service.apiPartnersIdGet({ id: id });
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
    if (type === PartnerTypeEnum.GROWTH) {
      request$ = this.service.apiGrowthPartnersGetCollection() as Observable<{ member: Array<ExtendedPartnerDto> }>;
    } else if (type === PartnerTypeEnum.SOLUTION) {
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

  fetchAllTypes() {
    const solution$ = this.service.apiSolutionPartnersGetCollection() as Observable<{ member: Array<ExtendedPartnerDto> }>;
    const provider$ = this.service.apiSolutionProvidersGetCollection() as Observable<{ member: Array<ExtendedPartnerDto> }>;
    const affiliate$ = this.service.apiAffiliatePartnersGetCollection() as Observable<{ member: Array<ExtendedPartnerDto> }>;

    return forkJoin([solution$, provider$, affiliate$]).pipe(
      map(([solution, provider, affiliate]) => [
        ...solution.member,
        ...provider.member,
        ...affiliate.member
      ]),
      tap(allPartners => {
        this.partners.set(allPartners);
      })
    );
  }

  getPartnerByType(type: PartnerType) {
    return this.partners().filter((partner) => partner['@type'] === type);
  }

  getPartnerById(id: ExtendedPartnerDto['id']) {
    return this.partners().find((partner) => partner.id === id);
  }

  createPartner(type: PartnerType, partner: AffiliatePartnerApiJsonldPost) {
    if (type === PartnerTypeEnum.GROWTH) {
      return this.gService.apiGrowthPartnersPost({ body: partner });
    } else if (type === PartnerTypeEnum.SOLUTION) {
      return this.spaService.apiSolutionPartnersPost({ body: partner });
    } else if (type === PartnerTypeEnum.PROVIDER) {
      return this.sprService.apiSolutionProvidersPost({ body: partner });
    } else {
      return this.aService.apiAffiliatePartnersPost({ body: partner });
    }
  }

  updatePartner(type: PartnerType, id: string, partner: AffiliatePartnerApiJsonldPost) {
    if (type === PartnerTypeEnum.GROWTH) {
      return this.gService.apiGrowthPartnersIdPatch({ id: id, body: partner });
    } else if (type === PartnerTypeEnum.SOLUTION) {
      return this.spaService.apiSolutionPartnersIdPatch({ id: id, body: partner });
    } else if (type === PartnerTypeEnum.PROVIDER) {
      return this.sprService.apiSolutionProvidersIdPatch({ id: id, body: partner });
    } else {
      return this.aService.apiAffiliatePartnersIdPatch({ id: id, body: partner });
    }
  }
} 