import type { InputNumberType } from '@core';
import type { FieldValues } from 'react-hook-form';
import { MaterialsDataSchemaType } from '../utils/validation';

export interface IMaterialsFilterForm extends FieldValues {
	name: string;
	materialType: any;
	density: InputNumberType;
	thickness: InputNumberType;
}

export interface IMaterialsAddAndEditForm extends FieldValues {
	name: string;
	description: string;
	density: InputNumberType;
	thickness: InputNumberType;
	materialType: any;
	region: any;
	type: any;
	issuer: string;
	//image
	materialCoefficient: InputNumberType;
	velocity: InputNumberType;
	lossFactor: InputNumberType;
	youngModulus: InputNumberType;
	damping: InputNumberType;
	solid: InputNumberType;
}

export type MaterialFormTypes = IMaterialsFilterForm | IMaterialsAddAndEditForm;

export const enum MaterialsFilterFormKeys {
	Name = 'name',
	MaterialType = 'materialType',
	Density = 'density',
	Thickness = 'thickness',
}

export const enum MaterialsAddAndEditFormKeys {
	Name = 'name',
	Description = 'description',
	Density = 'density',
	Thickness = 'thickness',
	MaterialType = 'materialType',
	Region = 'region',
	Type = 'type',
	Issuer = 'issuer',
	MaterialCoefficient = 'materialCoefficient',
	Velocity = 'velocity',
	LossFactor = 'lossFactor',
	YoungModulus = 'youngModulus',
	Damping = 'damping',
	Solid = 'solid',
}

type MaterialsData = MaterialsDataSchemaType;

export { type MaterialsData };
