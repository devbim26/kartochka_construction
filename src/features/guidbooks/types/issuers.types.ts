import type { FieldValues } from 'react-hook-form';

export interface IIssuersFilterForm extends FieldValues {
	name: string;
	country: string;
}

export interface IIssuersAddAndEditForm extends FieldValues {
	name: string;
	country: string;
	logoUrl: File | null;
	webSite: string;
}

export type IssuerFormTypes = IIssuersFilterForm | IIssuersAddAndEditForm;

export const enum IssuersFilterFormKeys {
	Name = 'name',
	Country = 'country',
}

export const enum IssuersAddAndEditFormKeys {
	Name = 'name',
	WebSite = 'webSite',
	Country = 'country',
	LogoUrl = 'logoUrl',
}
