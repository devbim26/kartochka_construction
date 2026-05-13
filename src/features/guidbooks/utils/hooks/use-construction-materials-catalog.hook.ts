import { convertToPaginatedType } from '@core';
import { MaterialPurpose } from '@api-gen';
import {
	convertToClientMaterialsAddAndEditData,
	convertToServerMaterialsFilterData,
} from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	ConstructionTypeEnum,
	Guidebooks,
	type MaterialTypeEnum,
	type MaterialsAddAndEditData,
	type MaterialsFilterData,
} from '@features/guidbooks/types';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';

function materialPurposeForConstructionType(
	constructionType: string | undefined,
): MaterialPurpose | undefined {
	if (!constructionType?.trim()) return undefined;
	if (
		constructionType === ConstructionTypeEnum.HomogeneousFloor ||
		constructionType === ConstructionTypeEnum.ElasticBaseFloor
	) {
		return MaterialPurpose.ForFloor;
	}
	return MaterialPurpose.ForWall;
}

function buildFilter(
	materialTypeEnum: MaterialTypeEnum,
	constructionType: string | undefined,
): MaterialsFilterData {
	const mp = materialPurposeForConstructionType(constructionType);
	return {
		name: '',
		density: '',
		thickness: '',
		materialType: materialTypeEnum as string,
		materialPurpose: mp ?? '',
	};
}

/**
 * Материалы справочника для слоя конструкции: тип материала + применение (стена/пол) по типу конструкции.
 */
export function useConstructionMaterialsCatalog(
	materialTypeEnum: MaterialTypeEnum | '',
	currentForm: UseFormReturn<{ constructionType?: string }>,
): MaterialsAddAndEditData[] | undefined {
	const [materials, setMaterials] = useState<MaterialsAddAndEditData[]>();
	const constructionType = useWatch({ control: currentForm.control, name: 'constructionType' });

	useEffect(() => {
		if (!materialTypeEnum) {
			setMaterials([]);
			return;
		}
		const filterPayload = convertToServerMaterialsFilterData(
			buildFilter(materialTypeEnum, constructionType),
		);
		const sub = from(
			getGuidebooksPaginated({
				data: filterPayload,
				pagination: { pageSize: 999999, pageNumber: 1 },
				guidebookType: Guidebooks.MATERIAL,
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const items = convertToPaginatedType(convertToClientMaterialsAddAndEditData)(
						response.data,
					);
					return from([items]);
				}),
				tap((items) => setMaterials(items.items || [])),
				catchError(() => {
					setMaterials([]);
					return from([null]);
				}),
			)
			.subscribe();
		return () => sub.unsubscribe();
	}, [materialTypeEnum, constructionType]);

	return materials;
}
