import type { IIssuersAddAndEditForm, IIssuersFilterForm } from '../../types/issuers.types';

export const IssuersFilterFormDefaultValues: IIssuersFilterForm = {
	issuer: '',
	country: '',
};

export const IssuersAddFormDefaultValues: IIssuersAddAndEditForm = {
	issuer: '',
	site: '',
	country: '',
	logo: null,
};
