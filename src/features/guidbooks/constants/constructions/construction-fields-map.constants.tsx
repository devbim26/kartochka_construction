import {
	MaterialTypeEnum,
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '@features';

interface Props {
	materialType: MaterialTypeEnum;
	fieldIndex: number;
	constructionIndex: number;
}

export const ConstructionFieldsMap = ({ materialType, fieldIndex, constructionIndex }: Props) => {
	const componentsMap = {
		[MaterialTypeEnum.Heavy]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
			/>
		),
		[MaterialTypeEnum.AirGap]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
			/>
		),
		[MaterialTypeEnum.Link]: (
			<PointConnectionsFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
			/>
		),
		[MaterialTypeEnum.Frame]: (
			<WidthRacksStepFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
			/>
		),
		[MaterialTypeEnum.Filler]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
			/>
		),
		[MaterialTypeEnum.Board]: (
			<ThicknessDensityFieldsType
				fieldIndex={fieldIndex}
				constructionIndex={constructionIndex}
			/>
		),
		[MaterialTypeEnum.AcousticTreatmentMaterials]: <></>,
		[MaterialTypeEnum.FoamMaterials]: <></>,
		[MaterialTypeEnum.Glazing]: <></>,
		[MaterialTypeEnum.GypsumBondedbBoards]: <></>,
		[MaterialTypeEnum.WoodBasedBoard]: <></>,
		[MaterialTypeEnum.Metal]: <></>,
		[MaterialTypeEnum.MasonryAndSolid]: <></>,
		[MaterialTypeEnum.PorousMaterials]: <></>,
		[MaterialTypeEnum.SandwichPanel]: <></>,
		[MaterialTypeEnum.MineralBondedBoards]: <></>,
		[MaterialTypeEnum.Membrane]: <></>,
	};

	return componentsMap[materialType] || <></>;
};
