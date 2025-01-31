import type { FieldValues } from 'react-hook-form';
import type { InputNumberType } from '@core';

export interface IRequirementsFilterForm extends FieldValues {
	region: string;
	buildingType: string;
}

export interface IRequirementsAddAndEditForm extends FieldValues {
	region: string;
	// Вместо конструкция разделяет, делаем два инпута, каждый отвечает за помещения которые разделяет конструкция
	firstPlacementRoom: string,
	secondPlacementRoom: string,
	buildingType: string;
	standardValidityPeriod: string;
	standardShortName: string;
	standardFullName: string;
	noizeIsolationIndex: InputNumberType;
	noizeImpactIndex: InputNumberType;
	class: string;//так и не поняла, нужен класс или нет
	notice: string;
}

export type RequirementFormTypes = IRequirementsFilterForm | IRequirementsAddAndEditForm;

export const enum RequirementsFilterFormKeys {
	Region = 'region',
	BuildingType = 'buildingType',
}

export const enum RequirementsAddAndEditFormKeys {
	Region = 'region',
	FirstPlacementRoom = 'firstPlacementRoom',
	SecondPlacementRoom = 'secondPlacementRoom',
	BuildingType = 'buildingType',
	StandardValidityPeriod = 'standardValidityPeriod',
	StandardShortName = 'standardShortName',
	StandardFullName = 'standardFullName',
	NoizeIsolationIndex = 'noizeIsolationIndex',
	NoizeImpactIndex = 'noizeImpactIndex',
	Class = 'class',
	Notice = 'notice',
}
