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

/** Контекст селектов типа/конструкции в каталоге. */
export enum ConstructionCatalogFilterContext {
	/** Экран «Расчёт»: без ZPanel и дверей; конструкции — только не брендовые. */
	Calculation = 'calculation',
	/** Модалка добавления стены: только стены, без ZPanel, дверей и перекрытий. */
	WallModal = 'wallModal',
	/** Модалка добавления пола: только перекрытия. */
	FloorModal = 'floorModal',
}

const CALCULATION_EXCLUDED_TYPES: ReadonlySet<ConstructionTypeEnum> = new Set([
	ConstructionTypeEnum.ZPanel,
	ConstructionTypeEnum.Door,
]);

const WALL_MODAL_EXCLUDED_TYPES: ReadonlySet<ConstructionTypeEnum> = new Set([
	ConstructionTypeEnum.ZPanel,
	ConstructionTypeEnum.Door,
]);

export const resolveConstructionCatalogFilterContext = (
	layoutClass: ConstructionClass,
): ConstructionCatalogFilterContext =>
	layoutClass === ConstructionClass.Floor
		? ConstructionCatalogFilterContext.FloorModal
		: ConstructionCatalogFilterContext.WallModal;

/** Допустим ли тип конструкции в данном контексте (и для фильтра, и для списка без выбранного типа). */
export const isConstructionTypeAllowedInCatalogContext = (
	constructionType: string | undefined | null,
	context: ConstructionCatalogFilterContext,
): boolean => {
	if (!constructionType) return false;

	switch (context) {
		case ConstructionCatalogFilterContext.Calculation:
			return !CALCULATION_EXCLUDED_TYPES.has(constructionType as ConstructionTypeEnum);
		case ConstructionCatalogFilterContext.WallModal:
			if (isFloorConstructionType(constructionType)) return false;
			return !WALL_MODAL_EXCLUDED_TYPES.has(constructionType as ConstructionTypeEnum);
		case ConstructionCatalogFilterContext.FloorModal:
			return isFloorConstructionType(constructionType);
		default:
			return true;
	}
};

export function filterConstructionTypeSelectOptionsByCatalogContext(
	options: ConstructionTypeSelectOption[],
	context: ConstructionCatalogFilterContext,
): ConstructionTypeSelectOption[] {
	return options.filter((option) =>
		isConstructionTypeAllowedInCatalogContext(option.value, context),
	);
}

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
