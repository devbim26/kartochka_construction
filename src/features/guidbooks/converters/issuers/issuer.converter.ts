import { IssuerDto } from '@api-gen';
import { countryMap } from '@core';
import type { FormIssuer, Issuer } from '@features/guidbooks/types';
import { Country as ClientCountry } from '@features/guidbooks/types';

export const convertToServerIssuerData = (data: Issuer) => ({
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
