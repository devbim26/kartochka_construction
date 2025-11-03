import type { SelectOption } from '@core';

export enum RequirementType {
	Calculation = 'Calculation',
	Regulatory = 'Regulatory',
}

export const RequirementTypeSelectValues: SelectOption[] = [
	{ label: 'Расчетные', value: RequirementType.Calculation },
	{ label: 'Нормативные', value: RequirementType.Regulatory },
];
