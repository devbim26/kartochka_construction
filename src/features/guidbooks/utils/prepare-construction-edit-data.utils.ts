import {
	normalizeVerticalCladdingForConstructionType,
	type CladdingMaterialRow,
} from './cladding-layer-normalization.utils';
import { ensureClientMaterialTypeValues } from './ensure-client-material-type-values.utils';
import { applyResolvedConstructionTypeToEditData } from './resolve-facing-construction-type.utils';

const ensureLayersMaterialTypeValues = (
	rows: CladdingMaterialRow[] | null | undefined,
): CladdingMaterialRow[] =>
	(rows ?? []).map((row) => ({
		...row,
		materialTypeValue: ensureClientMaterialTypeValues(
			row.materialType,
			row.materialTypeValue,
		),
	}));

/**
 * Перед сохранением / после загрузки: тип по фактическим облицовкам + порядок слоёв + стороны UI.
 */
export const prepareConstructionEditDataForPersistence = <
	T extends {
		constructionType?: string;
		constructionTypeObject?: {
			constructionTypeEnum?: string;
			leftConstruction?: unknown[] | null;
			rightConstruction?: unknown[] | null;
			centerConstruction?: unknown[] | null;
		};
	},
>(
	data: T,
): T => {
	const withType = applyResolvedConstructionTypeToEditData(data);
	const layers = withType.constructionTypeObject;
	if (!layers) {
		return withType;
	}

	const { left, right } = normalizeVerticalCladdingForConstructionType(
		layers.constructionTypeEnum ?? withType.constructionType,
		(layers.leftConstruction ?? []) as CladdingMaterialRow[],
		(layers.rightConstruction ?? []) as CladdingMaterialRow[],
	);

	return {
		...withType,
		constructionType: layers.constructionTypeEnum ?? withType.constructionType,
		constructionTypeObject: {
			...layers,
			leftConstruction: ensureLayersMaterialTypeValues(left),
			centerConstruction: ensureLayersMaterialTypeValues(
				(layers.centerConstruction ?? []) as CladdingMaterialRow[],
			),
			rightConstruction: ensureLayersMaterialTypeValues(right),
		},
	} as T;
};
