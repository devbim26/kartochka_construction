import {
	MaterialTypeEnum,
	RuMaterialTypeEnum,
	type UserMaterials,
} from '@features/guidbooks/types';
import { MaterialParametrs, RuMaterialParametrs } from '../types';

export const formatMaterial = (material: UserMaterials, language: 'ru' | 'en' = 'ru') => {
	const materialTypeMap = language === 'ru' ? RuMaterialTypeEnum : MaterialTypeEnum;
	const materialParamsMap = language === 'ru' ? RuMaterialParametrs : MaterialParametrs;

	const materialType =
		materialTypeMap[material.materialType as keyof typeof materialTypeMap] ??
		material.materialType;

	const materialParams =
		material.materialTypeValue
			?.map((val) => {
				const param =
					materialParamsMap[val.materialParameters as keyof typeof materialParamsMap] ??
					val.materialParameters;
				return `${param}: ${Math.round(+val.value)}`;
			})
			.join(', ') || (language === 'ru' ? 'нет данных' : 'no data');

	const baseName = (material.materialName ?? '').trim();
	const fullMaterialName = baseName;

	return `${fullMaterialName}, ${materialParams.toLowerCase()};`;
};
