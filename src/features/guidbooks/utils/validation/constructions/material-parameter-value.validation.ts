import { MaterialParametrs } from '@features/constructor/types';

/** Разумные верхние пределы для числовых параметров слоя. */
export const MATERIAL_PARAMETER_MAX: Partial<Record<MaterialParametrs, number>> = {
	[MaterialParametrs.Thickness]: 1000, // мм
	[MaterialParametrs.Density]: 20000, // кг/м³
	[MaterialParametrs.RackStep]: 10000, // мм
	[MaterialParametrs.ConnectionNumber]: 10000,
};

const NUMERIC_MATERIAL_PARAMETERS = new Set<string>([
	MaterialParametrs.Thickness,
	MaterialParametrs.Density,
	MaterialParametrs.RackStep,
	MaterialParametrs.ConnectionNumber,
	'Width',
]);

export const isNumericMaterialParameter = (materialParameters?: string | null): boolean =>
	!!materialParameters && NUMERIC_MATERIAL_PARAMETERS.has(materialParameters);

export const parseMaterialParameterNumber = (value: string): number | null => {
	const trimmed = String(value ?? '').trim().replace(',', '.');
	if (!trimmed) return null;
	const num = Number(trimmed);
	return Number.isFinite(num) ? num : null;
};

/**
 * Возвращает ключ i18n ошибки или null, если значение валидно.
 * ConnectionType и прочие нечисловые параметры — только non-empty (снаружи).
 */
export const getMaterialParameterValueError = (
	materialParameters: string | undefined | null,
	value: string | undefined | null,
): string | null => {
	const raw = String(value ?? '').trim();
	if (!raw) return 'validation.required';

	if (!isNumericMaterialParameter(materialParameters)) {
		return null;
	}

	const num = parseMaterialParameterNumber(raw);
	if (num == null) return 'validation.number';
	if (num <= 0) return 'validation.positiveNumber';

	const max = MATERIAL_PARAMETER_MAX[materialParameters as MaterialParametrs];
	if (max != null && num > max) {
		if (materialParameters === MaterialParametrs.Thickness) {
			return 'validation.thicknessMax';
		}
		return 'validation.numberMax';
	}

	return null;
};
