import type { IssuerDto } from '@api-gen';
import { convertToClientCountryData, convertToServerCountryData, resolveMediaUrl } from '@core';

import type { Country, Issuer } from '@features/guidbooks/types';

const toFormFile = (file: unknown): File | null =>
	file instanceof File && file.size > 0 ? file : null;

export const convertToServerIssuerFilterData = (data: Issuer) => ({
	name: data.name || null,
	countryType: convertToServerCountryData(data.countries as Country[]) || null,
	logoUrl: data.logoUrl || null,
	webSite: data.webSite || null,
});

export const convertToServerIssuerAddData = (data: Issuer) => ({
	name: data.name || null,
	countryTypes: convertToServerCountryData(data.countries as Country[]) || null,
	formFile: toFormFile(data.logoFile),
	webSite: data.webSite || null,
});

export const convertToServerIssuerEditData = (data: Issuer) => {
	const editFile = Boolean(data.editFile);
	return {
		id: data.id || null,
		name: data.name || null,
		countries: convertToServerCountryData(data.countries as Country[]) || null,
		webSite: data.webSite || null,
		editFile,
		formFile: editFile ? toFormFile(data.logoFile) : null,
	};
};

export const convertToClientIssuerData = (data: IssuerDto): Issuer => ({
	id: data.id ?? '',
	name: data.name ?? '',
	countries: (convertToClientCountryData(data.countries!) as []) ?? '',
	logoUrl: resolveMediaUrl(data.logoUrl) || '',
	logoFile: null,
	editFile: false,
	webSite: data.webSite ?? '',
});
