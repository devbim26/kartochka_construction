import { RuMaterialTypeEnum, type UserMaterials } from '@features/guidbooks/types';
import { RuMaterialParametrs } from '../types';

export const formatMaterial = (material: UserMaterials) => {
	const materialType =
		RuMaterialTypeEnum[material.materialType as keyof typeof RuMaterialTypeEnum] ??
		material.materialType;
	const materialParams =
		material.materialTypeValue
			?.map((val) => {
				const param =
					RuMaterialParametrs[
						val.materialParameters as keyof typeof RuMaterialParametrs
					] ?? val.materialParameters;
				return `${param}: ${val.value}`;
			})
			.join(', ') || 'нет данных';
	return `${materialType} (${materialParams})`;
};
