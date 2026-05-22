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
	return family.base ?? family.oneSide;
};

const hasCladdingRows = (layers?: unknown[] | null): boolean =>
	Array.isArray(layers) && layers.length > 0;

/**
 * Односторонняя облицовка в UI хранится на «своей» стороне:
 * - многослойная — Left (сверху);
 * - однослойная горизонтальная — Right.
 */
const alignOneSideCladdingToUiSide = <
	T extends {
		constructionTypeObject?: {
			constructionTypeEnum?: string;
			leftConstruction?: unknown[] | null;
			rightConstruction?: unknown[] | null;
		};
	},
>(
	data: T,
	resolvedEnum: string,
): T => {
	const layers = data.constructionTypeObject ?? {};
	let left = layers.leftConstruction;
	let right = layers.rightConstruction;

	if (
		resolvedEnum === ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide &&
		!hasCladdingRows(left) &&
		hasCladdingRows(right)
	) {
		left = right;
		right = [];
	}

	if (
		resolvedEnum === ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide &&
		!hasCladdingRows(right) &&
		hasCladdingRows(left)
	) {
		right = left;
		left = [];
	}

	if (left === layers.leftConstruction && right === layers.rightConstruction) {
		return data;
	}

	return {
		...data,
		constructionTypeObject: {
			...layers,
			leftConstruction: left,
			rightConstruction: right,
		},
	};
};

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
