import { MaterialParametrs } from '@api-gen';
import type { UseFormSetValue } from 'react-hook-form';

type MaterialTypeValueEntry = {
	materialParameters?: string;
	value?: string;
};

type MaterialThicknessDensitySource = {
	thickness?: string;
	density?: string;
} | null | undefined;

/** Проставляет толщину/плотность по типу параметра, а не по индексу (порядок с API бывает разный). */
export const applySelectedMaterialThicknessDensity = (
	setValue: UseFormSetValue<any>,
	basePath: string,
	materialTypeValue: MaterialTypeValueEntry[] | undefined,
	material: MaterialThicknessDensitySource,
) => {
	if (!material || !materialTypeValue?.length) return;

	materialTypeValue.forEach((entry, index) => {
		if (entry.materialParameters === MaterialParametrs.Thickness) {
			setValue(`${basePath}.materialTypeValue.${index}.value`, material.thickness ?? '');
		}
		if (entry.materialParameters === MaterialParametrs.Density) {
			setValue(`${basePath}.materialTypeValue.${index}.value`, material.density ?? '');
		}
	});
};
