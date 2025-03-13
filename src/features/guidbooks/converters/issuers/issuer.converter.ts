import type { IssuerDto } from '@api-gen';
import { convertToClientCountryData, convertToServerCountryData } from '@core';

import type { Country, Issuer } from '@features/guidbooks/types';

export const convertToServerIssuerFilterData = (data: Issuer) => ({
	name: data.name || null,
	countryType: convertToServerCountryData(data.countries as Country[]) || null,
	logoUrl: data.logoUrl || null,
	webSite: data.webSite || null,
});

export const convertToServerIssuerAddData = (data: Issuer) => ({
	name: data.name || null,
	countryTypes: convertToServerCountryData(data.countries as Country[]) || null,
	formFile: data.logoFile || null,
	webSite: data.webSite || null,
});

export const convertToServerIssuerEditData = (data: Issuer) => ({
	id: data.id || null,
	name: data.name || null,
	countries: convertToServerCountryData(data.countries as Country[]) || null,
	formFile: data.logoFile || null,
	webSite: data.webSite || null,
});

export const convertToClientIssuerData = (data: IssuerDto): Issuer => ({
	id: data.id ?? '',
	name: data.name ?? '',
	countries: (convertToClientCountryData(data.countries!) as []) ?? '',
	logoUrl: data.logoUrl ?? '',
	webSite: data.webSite ?? '',
});
