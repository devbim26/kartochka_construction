import { convertToPaginatedType } from '@core';
import {
	convertToClientMaterialsAddAndEditData,
	convertToServerMaterialsFilterData,
} from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	Guidebooks,
	type MaterialTypeEnum,
	type MaterialsAddAndEditData,
	type MaterialsFilterData,
} from '@features/guidbooks/types';
import {
	filterMaterialsByApplicationPurpose,
	resolveMaterialPurposeForConstructionType,
} from '@features/guidbooks/utils/material-purpose.utils';
import { MaterialApplicationPurposeContext } from '@features/guidbooks/utils/material-application-purpose.context';
import type { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';

function buildFilter(
	materialTypeEnum: MaterialTypeEnum,
	constructionType: string | undefined,
): MaterialsFilterData {
	const materialPurpose = resolveMaterialPurposeForConstructionType(constructionType);
	return {
		name: '',
		density: '',
		thickness: '',
		materialType: materialTypeEnum as string,
		materialPurpose: materialPurpose ?? '',
	};
}

/**
 * Материалы справочника для слоя конструкции: тип материала + применение (стена/пол) по типу конструкции.
 */
export function useConstructionMaterialsCatalog(
	materialTypeEnum: MaterialTypeEnum | '',
	currentForm: UseFormReturn<{
		constructionType?: string;
		constructionTypeObject?: { constructionTypeEnum?: string };
	}>,
): MaterialsAddAndEditData[] | undefined {
	const [materials, setMaterials] = useState<MaterialsAddAndEditData[]>();
	const constructionTypeRoot = useWatch({ control: currentForm.control, name: 'constructionType' });
	const constructionTypeEnum = useWatch({
		control: currentForm.control,
		name: 'constructionTypeObject.constructionTypeEnum',
	});
	const layoutClassPurpose = useContext(MaterialApplicationPurposeContext);
	const constructionType =
		(typeof constructionTypeEnum === 'string' && constructionTypeEnum.trim()) ||
		(typeof constructionTypeRoot === 'string' && constructionTypeRoot.trim()) ||
		undefined;
	const materialPurpose =
		resolveMaterialPurposeForConstructionType(constructionType) ?? layoutClassPurpose;

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
				tap((items) => {
					const filtered = filterMaterialsByApplicationPurpose(
						items.items || [],
						materialPurpose,
					);
					setMaterials(filtered);
				}),
				catchError(() => {
					setMaterials([]);
					return from([null]);
				}),
			)
			.subscribe();
		return () => sub.unsubscribe();
	}, [materialTypeEnum, constructionType, materialPurpose, layoutClassPurpose]);

	return materials;
}
