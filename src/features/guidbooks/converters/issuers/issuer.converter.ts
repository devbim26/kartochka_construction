import type { IssuerDto } from '@api-gen';
import { convertToClientCountryData, convertToServerCountryData } from '@core';

import type { Country, FilterIssuer, Issuer } from '@features/guidbooks/types';

export const convertToServerIssuerData = (data: Issuer) => ({
	name: data.name || null,
	countryType: convertToServerCountryData(data.countries as Country[]) || null,
	logoUrl: data.logoUrl || null,
	webSite: data.webSite || null,
});

export const convertToServerCreateIssuerData = (data: Issuer) => ({
	name: data.name || null,
	countryTypes: convertToServerCountryData(data.countries as Country[]) || null,
	logoUrl: data.logoUrl || null,
	webSite: data.webSite || null,
});

export const convertToClientIssuerData = (data: IssuerDto): FilterIssuer => ({
	...data,
	name: data.name ?? '',
	countries: (convertToClientCountryData(data.countries!) as []) ?? '',
	logoUrl: data.logoUrl ?? '',
	webSite: data.webSite ?? '',
});
