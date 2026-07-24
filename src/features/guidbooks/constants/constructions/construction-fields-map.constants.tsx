import { MaterialParametrs } from '@api-gen';
import {
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
	ThicknessFieldsType,
	WidthRacksStepFieldsType,
} from '@features/guidbooks/presentation';
import { MaterialTypeEnum } from '@features/guidbooks/types';
import type { UseFormReturn } from 'react-hook-form';

interface ConstructionFieldsMapProps {
	materialType: MaterialTypeEnum;
	fieldIndex: number;
	constructionPosition: 'Left' | 'Center' | 'Right';
	currentForm: UseFormReturn<any>;
}

export const ConstructionFieldsMap = ({
	materialType,
	fieldIndex,
	constructionPosition,
	currentForm,
}: ConstructionFieldsMapProps) => {
	const componentsMap = {
		[MaterialTypeEnum.Heavy]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Screed]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.AirGap]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Link]: (
			<PointConnectionsFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Frame]: (
			<WidthRacksStepFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Filler]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Board]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.AcousticTreatmentMaterials]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Membrane]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.ZPanel]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.Glazing]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.GapDistance]: (
			<ThicknessFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
		[MaterialTypeEnum.WoodBasedBoard]: <></>,
		[MaterialTypeEnum.MineralBondedBoards]: <></>,
		[MaterialTypeEnum.Plaster]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionPosition={constructionPosition}
				currentForm={currentForm}
			/>
		),
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
	[MaterialTypeEnum.Screed]: [
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
	[MaterialTypeEnum.GapDistance]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
	],
	[MaterialTypeEnum.WoodBasedBoard]: [],
	[MaterialTypeEnum.Plaster]: [
		{
			materialParameters: MaterialParametrs.Thickness,
			value: '',
		},
		{
			materialParameters: MaterialParametrs.Density,
			value: '',
		},
	],
	[MaterialTypeEnum.MineralBondedBoards]: [],
};
