import { MaterialPurpose } from '@api-gen';
import {
	ConstructionClass,
	isFloorConstructionType,
	type MaterialsAddAndEditData,
} from '@features/guidbooks/types';

/** Тип применения материала по типу/классу конструкции (стена или перекрытие). */
export const resolveMaterialPurposeForConstructionType = (
	constructionType: string | undefined | null,
): MaterialPurpose | undefined => {
	if (!constructionType?.trim()) return undefined;

	if (
		constructionType === ConstructionClass.Floor ||
		isFloorConstructionType(constructionType)
	) {
		return MaterialPurpose.ForFloor;
	}

	if (constructionType === ConstructionClass.Wall) {
		return MaterialPurpose.ForWall;
	}

	return MaterialPurpose.ForWall;
};

/** Оставляет материалы с нужным применением; `Any` подходит и для стен, и для перекрытий. */
export const filterMaterialsByApplicationPurpose = (
	materials: MaterialsAddAndEditData[],
	purpose: MaterialPurpose | undefined,
): MaterialsAddAndEditData[] => {
	if (!purpose) return materials;

	return materials.filter((material) => {
		const materialPurpose = (material.materialPurpose as MaterialPurpose) || MaterialPurpose.Any;
		if (materialPurpose === MaterialPurpose.Any) return true;
		return materialPurpose === purpose;
	});
};
