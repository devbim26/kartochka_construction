import {
	multiLayerBottomCladdingInitialRows,
	multiLayerTopCladdingInitialRows,
} from '@features/guidbooks/constants/constructions/multi-layer-vertical-cladding.defaults';
import { ConstructionTypeEnum, MaterialTypeEnum } from '@features/guidbooks/types';

export type CladdingMaterialRow = {
	materialId: string;
	materialName?: string;
	additionalName?: string | null;
	positionId: string;
	materialType: string;
	materialTypeValue?: Array<{
		value: string;
		materialParameters: string;
	}> | null;
};

const OPTIONAL_CLADDING_POSITION_IDS = new Set(['5', '6']);

const partitionCladdingLayers = (materials: CladdingMaterialRow[]) => ({
	core: materials.filter((row) => !OPTIONAL_CLADDING_POSITION_IDS.has(row.positionId)),
	optional: materials
		.filter((row) => OPTIONAL_CLADDING_POSITION_IDS.has(row.positionId))
		.sort((a, b) => Number(a.positionId) - Number(b.positionId)),
});

const TOP_LAYER_TYPES = [
	MaterialTypeEnum.Board,
	MaterialTypeEnum.Filler,
	MaterialTypeEnum.Frame,
	MaterialTypeEnum.Link,
	MaterialTypeEnum.AirGap,
] as const;

const BOTTOM_LAYER_TYPES = [
	MaterialTypeEnum.AirGap,
	MaterialTypeEnum.Link,
	MaterialTypeEnum.Frame,
	MaterialTypeEnum.Filler,
	MaterialTypeEnum.Board,
] as const;

const VERTICAL_BOTH_SIDE_TYPES = new Set<string>([
	ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
	ConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide,
]);

const VERTICAL_ONE_SIDE_TYPES = new Set<string>([
	ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide,
	ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
]);

const VERTICAL_TOP_ONE_SIDE_TYPES = VERTICAL_ONE_SIDE_TYPES;

const defaultsByMaterialType = (rows: ReturnType<typeof multiLayerTopCladdingInitialRows>) =>
	new Map(rows.map((row) => [row.materialType, row.materialTypeValue]));

const topDefaults = defaultsByMaterialType(multiLayerTopCladdingInitialRows());
const bottomDefaults = defaultsByMaterialType(multiLayerBottomCladdingInitialRows());

const ensureMaterialTypeValues = (
	row: CladdingMaterialRow,
	defaults: Map<MaterialTypeEnum, CladdingMaterialRow['materialTypeValue']>,
): CladdingMaterialRow => {
	if (row.materialTypeValue?.length) {
		return row;
	}
	const fallback = defaults.get(row.materialType as MaterialTypeEnum);
	return {
		...row,
		materialTypeValue: fallback ? fallback.map((v) => ({ ...v })) : [],
	};
};

const isLegacyTopCladding = (materials: CladdingMaterialRow[]): boolean =>
	materials.some(
		(m) => m.positionId === '0' && m.materialType === MaterialTypeEnum.AirGap,
	);

const isLegacyBottomCladding = (materials: CladdingMaterialRow[]): boolean =>
	materials.some(
		(m) => m.positionId === '0' && m.materialType === MaterialTypeEnum.Board,
	);

const reorderCladdingByTypes = (
	materials: CladdingMaterialRow[],
	order: readonly MaterialTypeEnum[],
	defaults: Map<MaterialTypeEnum, CladdingMaterialRow['materialTypeValue']>,
): CladdingMaterialRow[] =>
	order
		.map((materialType, index) => {
			const row = materials.find((m) => m.materialType === materialType);
			if (!row) {
				return null;
			}
			return ensureMaterialTypeValues(
				{ ...row, positionId: String(index) },
				defaults,
			);
		})
		.filter((row): row is CladdingMaterialRow => row != null);

/** Левая облицовка (Left): плита → … → воздушный зазор у базы. */
export const normalizeTopCladdingLayers = (
	materials: CladdingMaterialRow[],
): CladdingMaterialRow[] => {
	if (!materials.length) {
		return [];
	}
	const { core, optional } = partitionCladdingLayers(materials);
	const withValues = core.map((row) => ensureMaterialTypeValues(row, topDefaults));
	const normalizedCore = !isLegacyTopCladding(withValues)
		? withValues
		: reorderCladdingByTypes(withValues, TOP_LAYER_TYPES, topDefaults);

	return [
		...normalizedCore,
		...optional.map((row) => ensureMaterialTypeValues(row, topDefaults)),
	];
};

/** Правая облицовка (Right): воздушный зазор у базы → … → плита. */
export const normalizeBottomCladdingLayers = (
	materials: CladdingMaterialRow[],
): CladdingMaterialRow[] => {
	if (!materials.length) {
		return [];
	}
	const { core, optional } = partitionCladdingLayers(materials);
	const withValues = core.map((row) => ensureMaterialTypeValues(row, bottomDefaults));
	const normalizedCore = !isLegacyBottomCladding(withValues)
		? withValues
		: reorderCladdingByTypes(withValues, BOTTOM_LAYER_TYPES, bottomDefaults);

	return [
		...normalizedCore,
		...optional.map((row) => ensureMaterialTypeValues(row, bottomDefaults)),
	];
};

export const normalizeVerticalCladdingForConstructionType = (
	constructionTypeEnum: string | undefined,
	left: CladdingMaterialRow[],
	right: CladdingMaterialRow[],
): { left: CladdingMaterialRow[]; right: CladdingMaterialRow[] } => {
	if (!constructionTypeEnum) {
		return { left, right };
	}

	if (VERTICAL_BOTH_SIDE_TYPES.has(constructionTypeEnum)) {
		return {
			left: normalizeTopCladdingLayers(left),
			right: normalizeBottomCladdingLayers(right),
		};
	}

	if (VERTICAL_TOP_ONE_SIDE_TYPES.has(constructionTypeEnum) && left.length) {
		return {
			left: normalizeTopCladdingLayers(left),
			right,
		};
	}

	if (VERTICAL_ONE_SIDE_TYPES.has(constructionTypeEnum) && right.length) {
		return {
			left,
			right: normalizeBottomCladdingLayers(right),
		};
	}

	return { left, right };
};
