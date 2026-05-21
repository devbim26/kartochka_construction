import type { UserMaterials } from '@features/guidbooks/types';

type ConstructionLayers = {
	leftConstruction?: UserMaterials[] | null;
	centerConstruction?: UserMaterials[] | null;
	rightConstruction?: UserMaterials[] | null;
};

const byPositionId = (a: UserMaterials, b: UserMaterials) =>
	Number(a.positionId) - Number(b.positionId);

/**
 * Порядок слоёв в разрезе сверху вниз: Left (облицовка сверху) → Center → Right (снизу).
 * Внутри каждой группы — по positionId (у обеих облицовок воздушный зазор у базы: сверху pos.4, снизу pos.0).
 */
export const flattenConstructionMaterialsTopToBottom = (
	obj: ConstructionLayers | null | undefined,
): UserMaterials[] => {
	if (!obj) return [];
	return [
		...(obj.leftConstruction ?? []).slice().sort(byPositionId),
		...(obj.centerConstruction ?? []).slice().sort(byPositionId),
		...(obj.rightConstruction ?? []).slice().sort(byPositionId),
	];
};
