import {
	MaterialTypeEnum,
	RuMaterialTypeEnum,
	type UserMaterials,
} from '@features/guidbooks/types';
import {
	MaterialParametrs,
	RuConnectionType,
	RuMaterialParametrs,
} from '../types';

const formatMaterialParameterValue = (
	materialParameter: string,
	rawValue: string,
	language: 'ru' | 'en',
): string => {
	if (materialParameter === MaterialParametrs.ConnectionType) {
		const connectionTypeLabelsRu: Record<string, string> = {
			'1': RuConnectionType.Linear,
			'2': RuConnectionType.Spot,
		};
		const connectionTypeLabelsEn: Record<string, string> = {
			'1': 'Linear',
			'2': 'Spot',
		};
		const labels = language === 'ru' ? connectionTypeLabelsRu : connectionTypeLabelsEn;
		return labels[String(rawValue).trim()] ?? rawValue;
	}

	const numeric = Number(String(rawValue).replace(',', '.'));
	return Number.isFinite(numeric) ? String(Math.round(numeric)) : rawValue;
};

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
				const displayValue = formatMaterialParameterValue(
					val.materialParameters,
					val.value,
					language,
				);
				return `${param}: ${displayValue}`;
			})
			.join(', ') || (language === 'ru' ? 'нет данных' : 'no data');

	const baseName = (material.materialName ?? '').trim();
	const fullMaterialName = baseName;

	return `${fullMaterialName}, ${materialParams.toLowerCase()};`;
};
