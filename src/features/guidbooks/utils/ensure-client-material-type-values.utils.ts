import { MaterialParametrs } from '@api-gen';
import { MaterialTypeEnum } from '@features/guidbooks/types';

type MaterialTypeValueEntry = {
	value: string;
	materialParameters: string;
};

const LINK_PARAM_ORDER = [
	MaterialParametrs.ConnectionNumber,
	MaterialParametrs.ConnectionType,
] as const;

/**
 * Для Link гарантирует ConnectionNumber + ConnectionType.
 * Значения не перекодируем — как в форме (например "1"), так и уходит на API.
 */
export const ensureClientMaterialTypeValues = (
	materialType: string | undefined | null,
	materialTypeValue: MaterialTypeValueEntry[] | null | undefined,
): MaterialTypeValueEntry[] => {
	const source = Array.isArray(materialTypeValue) ? materialTypeValue : [];
	const normalized = source
		.map((entry) => {
			const materialParameters = String(entry.materialParameters ?? '').trim();
			if (!materialParameters) return null;
			return {
				materialParameters,
				value: String(entry.value ?? ''),
			};
		})
		.filter((entry): entry is MaterialTypeValueEntry => entry != null);

	if (materialType !== MaterialTypeEnum.Link) {
		return normalized;
	}

	const byParam = new Map(
		normalized.map((entry) => [entry.materialParameters, entry] as const),
	);

	return LINK_PARAM_ORDER.map((param) => {
		const existing = byParam.get(param);
		if (existing) return existing;
		return {
			materialParameters: param,
			value: '',
		};
	});
};
