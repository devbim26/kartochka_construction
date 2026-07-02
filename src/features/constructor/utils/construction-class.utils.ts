import { ConstructionClass, isFloorConstructionType } from '@features/guidbooks/types';

/** В формах отчёта `constructionType` — Wall/Floor; в шапке конструкции часто приходит enum типа стены. */
export const resolveConstructionClass = (
	value?: string | null,
	fallback: ConstructionClass = ConstructionClass.Wall,
): ConstructionClass => {
	if (value === ConstructionClass.Wall || value === ConstructionClass.Floor) {
		return value;
	}

	if (value && isFloorConstructionType(value)) {
		return ConstructionClass.Floor;
	}

	return fallback;
};

export const resolveLayoutClassFromTargetTab = (
	targetTab?: 'walls' | 'floors' | null,
): ConstructionClass =>
	targetTab === 'floors' ? ConstructionClass.Floor : ConstructionClass.Wall;

/** Фильтр каталога: перекрытия только HomogeneousFloor / ElasticBaseFloor. */
export const matchesConstructionClassFilter = (
	constructionTypeEnum: string | undefined | null,
	layoutClass: ConstructionClass,
): boolean => {
	if (!constructionTypeEnum) return false;
	const isFloor = isFloorConstructionType(constructionTypeEnum);
	return layoutClass === ConstructionClass.Floor ? isFloor : !isFloor;
};
