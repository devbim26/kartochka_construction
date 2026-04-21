import { MaterialParametrs } from '../types';

type ConstructionMaterialLayer = {
	materialTypeValue?: Array<{ materialParameters: string; value: string }> | null;
};

/** Суммарная толщина слоёв, мм. */
export const getTotalThicknessMmFromMaterials = (
	materials: ConstructionMaterialLayer[],
): number => {
	let sum = 0;
	for (const m of materials) {
		const values = m.materialTypeValue || [];
		const tMm =
			Number(
				values.find((v) => v.materialParameters === MaterialParametrs.Thickness)?.value,
			) || 0;
		sum += tMm;
	}
	return sum;
};

/**
 * Поверхностная масса конструкции, кг/м²: Σ(ρ·t)/1000 по слоям
 * (ρ — кг/м³, t — мм).
 */
export const getSurfaceMassKgPerM2FromMaterials = (
	materials: ConstructionMaterialLayer[],
): number => {
	let sum = 0;
	for (const m of materials) {
		const values = m.materialTypeValue || [];
		const tMm =
			Number(
				values.find((v) => v.materialParameters === MaterialParametrs.Thickness)?.value,
			) || 0;
		const density =
			Number(
				values.find((v) => v.materialParameters === MaterialParametrs.Density)?.value,
			) || 0;
		sum += (density * tMm) / 1000;
	}
	return sum;
};
