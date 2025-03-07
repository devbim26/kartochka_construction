import type { IssuerDto } from '@api-gen';

import type { FilterIssuer, Issuer } from '@features/guidbooks/types';

export const convertToServerIssuerData = (data: Issuer) => ({
	name: data.name || null,
	countries: Array.isArray(data.countries) ? data.countries : [], // Пустой массив вместо null
	logoUrl: data.logoUrl || null,
	webSite: data.webSite || null,
});

export const convertToClientIssuerData = (data: IssuerDto): FilterIssuer => ({
	...data,
	name: data.name ?? '',
	countries: Array.isArray(data.countries)
		? data.countries
		: data.countries
			? [data.countries]
			: [],
	logoUrl: data.logoUrl ?? '',
	webSite: data.webSite ?? '',
});
