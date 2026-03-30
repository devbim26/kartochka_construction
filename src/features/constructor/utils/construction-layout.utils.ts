import type { ConstructionsEditData } from '@features/guidbooks/types';
import { ConstructionClass, ConstructionTypeEnum } from '@features/guidbooks/types';

export type FloorPlanExplantationTab = 'walls' | 'floors' | 'rooms';

export const FLOOR_CONSTRUCTION_TYPE_ENUMS: ReadonlySet<string> = new Set([
	ConstructionTypeEnum.HomogeneousFloor,
	ConstructionTypeEnum.ElasticBaseFloor,
]);

/**
 * Maps catalog construction header to wall vs floor layout (по типу решения в справочнике).
 */
export function getLayoutClassFromConstructionHeader(
	header: ConstructionsEditData | undefined,
): ConstructionClass | null {
	const enumVal = header?.constructionTypeObject?.constructionTypeEnum;
	if (!enumVal) return null;
	return FLOOR_CONSTRUCTION_TYPE_ENUMS.has(enumVal as string)
		? ConstructionClass.Floor
		: ConstructionClass.Wall;
}
