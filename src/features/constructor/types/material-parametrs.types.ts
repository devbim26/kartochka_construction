import type { SelectOption } from '@core';

export enum MaterialParametrs {
	Thickness = 'Thickness',
	Density = 'Density',
	ConnectionNumber = 'ConnectionNumber',
	ConnectionType = 'ConnectionType',
	RackStep = 'RackStep',
}

export enum ConnectionType {
	Linear = 'Linear',
	Spot = 'Spot',
}

export enum RuConnectionType {
	Linear = 'Линейный',
	Spot = 'Точечный',
}

export enum RuMaterialParametrs {
	Thickness = 'Толщина, мм',
	Density = 'Плотность, кг/м³',
	ConnectionNumber = 'Количество соединений, шт.',
	ConnectionType = 'Тип связи',
	RackStep = 'Шаг стоек, мм',
}

export const ConnectionTypeSelectValues: SelectOption[] = [
	{ label: RuConnectionType.Linear, value: '0' },
	{ label: RuConnectionType.Spot, value: '1' },
];
