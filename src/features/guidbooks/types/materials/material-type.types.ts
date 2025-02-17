export enum MaterialType {
	Generic = 'Generic',
	Manufacturer = 'Manufacturer',
	UserDefinedProduct = 'UserDefinedProduct',
}

export const RuMaterialTypeNamesSelectValues = [
	{ label: 'Общий', value: MaterialType.Generic },
	{ label: 'Произвлдитель', value: MaterialType.Manufacturer },
	{ label: 'Пользовательский продукт', value: MaterialType.UserDefinedProduct },
];
