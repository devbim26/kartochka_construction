import type { ConstructionsEditData } from '@features/guidbooks/types';
import {
	ConstructionClass,
	ConstructionTypeEnum,
	isFloorConstructionType,
} from '@features/guidbooks/types';

export type FloorPlanExplantationTab = 'walls' | 'floors' | 'rooms';

export const FLOOR_CONSTRUCTION_TYPE_ENUMS: ReadonlySet<string> = new Set([
	ConstructionTypeEnum.HomogeneousFloor,
	ConstructionTypeEnum.ElasticBaseFloor,
]);

export type ConstructionTypeSelectOption = {
	label: string;
	value: ConstructionTypeEnum;
};

/**
 * Maps catalog construction header to wall vs floor layout (по типу решения в справочнике).
 */
export function getLayoutClassFromConstructionHeader(
	header: ConstructionsEditData | undefined,
): ConstructionClass | null {
	const enumVal =
		header?.constructionTypeObject?.constructionTypeEnum || header?.constructionType;
	if (!enumVal) return null;
	return isFloorConstructionType(enumVal) ? ConstructionClass.Floor : ConstructionClass.Wall;
}

/** В проектировании нельзя сменить стену на пол и наоборот (у пола нет альтернатив). */
export function filterConstructionTypeSelectOptions(
	options: ConstructionTypeSelectOption[],
	layoutClass: ConstructionClass | null,
): ConstructionTypeSelectOption[] {
	if (!layoutClass) return options;

	return options.filter((option) => {
		const isFloor = isFloorConstructionType(option.value);
		if (layoutClass === ConstructionClass.Wall) return !isFloor;
		if (layoutClass === ConstructionClass.Floor) return isFloor;
		return true;
	});
}

/** Типы, недоступные для смены в проектировании. */
const DESIGNING_EXCLUDED_CONSTRUCTION_TYPES: ReadonlySet<ConstructionTypeEnum> = new Set([
	ConstructionTypeEnum.ZPanel,
]);

/** Фильтр селекта типа конструкции на экране проектирования. */
export function filterDesigningConstructionTypeSelectOptions(
	options: ConstructionTypeSelectOption[],
	layoutClass: ConstructionClass | null,
): ConstructionTypeSelectOption[] {
	return filterConstructionTypeSelectOptions(options, layoutClass).filter(
		(option) => !DESIGNING_EXCLUDED_CONSTRUCTION_TYPES.has(option.value),
	);
}
