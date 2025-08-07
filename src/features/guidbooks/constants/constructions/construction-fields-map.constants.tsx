import { MaterialParametrs } from '@api-gen';
import {
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '@features/guidbooks/presentation';
import { MaterialTypeEnum } from '@features/guidbooks/types';
import type { UseFormReturn } from 'react-hook-form';
interface ConstructionFieldsMapProps {
	materialType: MaterialTypeEnum;
	fieldIndex: number;
	constructionIndex: number;
	currentForm: UseFormReturn<any>;
}

export const ConstructionFieldsMap = ({
	materialType,
	fieldIndex,
	constructionIndex,
	currentForm,
}: ConstructionFieldsMapProps) => {
	const componentsMap = {
		[MaterialTypeEnum.Heavy]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.AirGap]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Link]: (
			<PointConnectionsFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Frame]: (
			<WidthRacksStepFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Filler]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Board]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.AcousticTreatmentMaterials]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Membrane]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.ZPanel]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.FoamMaterials]: <></>,
		[MaterialTypeEnum.Glazing]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.GypsumBondedbBoards]: <></>,
		[MaterialTypeEnum.WoodBasedBoard]: <></>,
		[MaterialTypeEnum.Metal]: <></>,
		[MaterialTypeEnum.MasonryAndSolid]: <></>,
		[MaterialTypeEnum.PorousMaterials]: <></>,
		[MaterialTypeEnum.SandwichPanel]: <></>,
		[MaterialTypeEnum.MineralBondedBoards]: <></>,
	};

	return componentsMap[materialType] || <></>;
};

export const MaterialTypeValuesMap = {
	[MaterialTypeEnum.Heavy]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],
	[MaterialTypeEnum.AirGap]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],
	[MaterialTypeEnum.Link]: [
		{
			materialParameters: MaterialParametrs.ConnectionNumber,
			value: '',
		},
	],
	[MaterialTypeEnum.Frame]: [
		{
			materialParameters: MaterialParametrs.Width,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.RackStep,
			value: '',
		},
	],
	[MaterialTypeEnum.Filler]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],
	[MaterialTypeEnum.Board]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],
	[MaterialTypeEnum.AcousticTreatmentMaterials]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],

	[MaterialTypeEnum.Membrane]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],
	[MaterialTypeEnum.ZPanel]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],
	[MaterialTypeEnum.FoamMaterials]: [],
	[MaterialTypeEnum.Glazing]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],
	[MaterialTypeEnum.GypsumBondedbBoards]: [],
	[MaterialTypeEnum.WoodBasedBoard]: [],
	[MaterialTypeEnum.Metal]: [],
	[MaterialTypeEnum.MasonryAndSolid]: [],
	[MaterialTypeEnum.PorousMaterials]: [],
	[MaterialTypeEnum.SandwichPanel]: [],
	[MaterialTypeEnum.MineralBondedBoards]: [],
};
