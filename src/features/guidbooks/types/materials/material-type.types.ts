export enum MaterialOriginType {
	Generic = 'Generic',
	Manufacturer = 'Manufacturer',
	UserDefinedProduct = 'UserDefinedProduct',
}

export const RuMaterialOriginTypesSelectValues = [
	{ label: 'Общий', value: MaterialOriginType.Generic },
	{ label: 'Произвлдитель', value: MaterialOriginType.Manufacturer },
	{ label: 'Пользовательский продукт', value: MaterialOriginType.UserDefinedProduct },
];

export interface MaterialType {
	id: string;
	name: string;
	shortName: string;
	label: string;
	fullName: string;
}
