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
import {
	MaterialApplicationPurposeContext,
	MaterialCatalogOnlyGeneralIssuerContext,
} from '@features/guidbooks/utils/material-application-purpose.context';
import type { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';

/**
 * На сервер: тип материала + isCommonMaterials (true — только общий производитель).
 * Применение (стена/пол) фильтруем на клиенте, чтобы не отсечь `Any`.
 */
function buildFilter(
	materialTypeEnum: MaterialTypeEnum,
	onlyGeneralIssuer: boolean,
): MaterialsFilterData {
	return {
		name: '',
		density: '',
		thickness: '',
		materialType: materialTypeEnum as string,
		materialPurpose: '',
		isCommonMaterials: onlyGeneralIssuer ? true : null,
	};
}

/**
 * Материалы справочника для слоя конструкции.
 * Фильтр «Общий» (`isCommonMaterials: true`) — расчёт и проектирование; в справочнике не включается.
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
	const onlyGeneralIssuer = useContext(MaterialCatalogOnlyGeneralIssuerContext);
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
			buildFilter(materialTypeEnum, onlyGeneralIssuer),
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
					setMaterials(
						filterMaterialsByApplicationPurpose(items.items || [], materialPurpose),
					);
				}),
				catchError(() => {
					setMaterials([]);
					return from([null]);
				}),
			)
			.subscribe();
		return () => sub.unsubscribe();
	}, [
		materialTypeEnum,
		constructionType,
		materialPurpose,
		layoutClassPurpose,
		onlyGeneralIssuer,
	]);

	return materials;
}
