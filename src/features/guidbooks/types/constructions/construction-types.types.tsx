export interface ConstructionTypeTemplate {
	constructionTypeTemplateId?: string | undefined;
	name?: string | null | undefined;
	shortName?: string | null | undefined;
	constructionRoot?: object | undefined;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWall = 'HeavySingleLayerWall',
	HeavySingleLaterWallSoundproofingBothSide = 'HeavySingleLaterWallSoundproofingBothSide',
}

export const RuConstructionConstructionTypeSelectValues = [
	{ label: 'Тяжелая однослойная стена', value: ConstructionTypeEnum.HeavySingleLayerWall },
	{
		label: 'Тяжелая однослойная стена + звукоизоляционная панель с двух сторон',
		value: ConstructionTypeEnum.HeavySingleLaterWallSoundproofingBothSide,
	},
];
