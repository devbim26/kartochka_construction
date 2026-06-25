import { ConstructionTypeEnum } from '@features/guidbooks/types';

type CladdingLayers = {
	leftConstruction?: unknown[] | null;
	rightConstruction?: unknown[] | null;
};

type FacingTypeFamily = {
	members: ConstructionTypeEnum[];
	base?: ConstructionTypeEnum;
	oneSide: ConstructionTypeEnum;
	bothSide: ConstructionTypeEnum;
};

/** Семейства типов с облицовкой/панелями по Left (сверху) и Right (снизу). */
const FACING_TYPE_FAMILIES: FacingTypeFamily[] = [
	{
		members: [
			ConstructionTypeEnum.HeavySingleLayerWall,
			ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
			ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
		],
		base: ConstructionTypeEnum.HeavySingleLayerWall,
		oneSide: ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
		bothSide: ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
	},
	{
		members: [
			ConstructionTypeEnum.HeavyMultiLayerWall,
			ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide,
			ConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide,
		],
		base: ConstructionTypeEnum.HeavyMultiLayerWall,
		oneSide: ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide,
		bothSide: ConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide,
	},
	{
		members: [
			ConstructionTypeEnum.ZPanel,
			ConstructionTypeEnum.HeavySingleLayerWallSoundproofingOneSide,
			ConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide,
		],
		base: ConstructionTypeEnum.ZPanel,
		oneSide: ConstructionTypeEnum.HeavySingleLayerWallSoundproofingOneSide,
		bothSide: ConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide,
	},
	{
		members: [
			ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingOneSide,
			ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide,
		],
		oneSide: ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingOneSide,
		bothSide: ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide,
	},
];

const hasCladding = (layers?: unknown[] | null): boolean =>
	Array.isArray(layers) && layers.length > 0;

const countCladdingSides = (layers: CladdingLayers): number =>
	(hasCladding(layers.leftConstruction) ? 1 : 0) + (hasCladding(layers.rightConstruction) ? 1 : 0);

const findFacingFamily = (
	enumValue: ConstructionTypeEnum | string | undefined,
): FacingTypeFamily | undefined => {
	if (!enumValue) return undefined;
	return FACING_TYPE_FAMILIES.find((family) =>
		family.members.includes(enumValue as ConstructionTypeEnum),
	);
};

/**
 * Подбирает constructionTypeEnum по фактическим облицовкам (Left/Right),
 * чтобы на бэк не уходило «+ облицовка с одной стороны» при двух облицовках и наоборот.
 */
export const resolveConstructionTypeEnumByCladding = (
	currentEnum: ConstructionTypeEnum | string | undefined,
	layers: CladdingLayers,
): ConstructionTypeEnum | string | undefined => {
	if (!currentEnum) return currentEnum;

	const family = findFacingFamily(currentEnum);
	if (!family) return currentEnum;

	const sides = countCladdingSides(layers);

	if (sides >= 2) {
		return family.bothSide;
	}
	if (sides === 1) {
		return family.oneSide;
	}
	if (currentEnum === family.bothSide) {
		return family.bothSide;
	}
	return family.base ?? family.oneSide;
};

/**
 * Односторонняя облицовка хранится на выбранной стороне (Left или Right).
 * Нормализация порядка слоёв — в normalizeVerticalCladdingForConstructionType.
 */
const alignOneSideCladdingToUiSide = <T>(data: T, _resolvedEnum: string): T => data;

export const applyResolvedConstructionTypeToEditData = <
	T extends {
		constructionType?: string;
		constructionTypeObject?: {
			constructionTypeEnum?: string;
			leftConstruction?: unknown[] | null;
			rightConstruction?: unknown[] | null;
		};
	},
>(
	data: T,
): T => {
	const layers = data.constructionTypeObject ?? {};
	const resolved = resolveConstructionTypeEnumByCladding(
		layers.constructionTypeEnum ?? data.constructionType,
		{
			leftConstruction: layers.leftConstruction,
			rightConstruction: layers.rightConstruction,
		},
	);

	const resolvedEnum = String(resolved ?? layers.constructionTypeEnum ?? '');
	const withEnum: T =
		!resolved || resolved === layers.constructionTypeEnum
			? data
			: ({
					...data,
					constructionType: resolvedEnum,
					constructionTypeObject: {
						...layers,
						constructionTypeEnum: resolvedEnum,
					},
				} as T);

	return alignOneSideCladdingToUiSide(withEnum, resolvedEnum);
};
