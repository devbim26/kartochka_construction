import { RuMaterialTypeEnum, type UserMaterials } from '@features/guidbooks/types';
import { RuMaterialParametrs } from '../types';

export const formatMaterial = (material: UserMaterials) => {
	console.log(material);
	const materialType =
		RuMaterialTypeEnum[material.materialType as keyof typeof RuMaterialTypeEnum] ??
		material.materialType;
	console.log(materialType);
	const materialParams =
		material.materialTypeValue
			?.map((val) => {
				console.log(val);
				const param =
					RuMaterialParametrs[
						val.materialParametrs as keyof typeof RuMaterialParametrs
					] ?? val.materialParametrs;
				return `${param}: ${val.value}`;
			})
			.join(', ') || 'нет данных';
	return `${materialType} (${materialParams})`;
};
