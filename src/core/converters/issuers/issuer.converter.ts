import type { CreateIssuerCommand, IssuerDto } from '@api-gen';
import type { FormIssuer, Issuer } from '@features/guidbooks/types';
import { Country as ClientCountry } from '@features/guidbooks/types';
import { countryMap } from './counry.converter';

export const convertToServerIssuerData = (data: Issuer): CreateIssuerCommand => ({
	...data,
	name: data.name || null,
	country: data.country ? countryMap.toServer[data.country as ClientCountry] : undefined,
	logoUrl: data.logoUrl || null,
	webSite: data.webSite || null,
});

export const convertToClientIssuerData = (data: IssuerDto): FormIssuer => ({
	...data,
	name: data.name ?? '',
	country: data.country ? countryMap.toClient[data.country] : ClientCountry.None,
	logoUrl: data.logoUrl ?? '',
	webSite: data.webSite ?? '',
});
