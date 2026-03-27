import type {
	ExportMaterialsQuery,
	ExportRequirementQuery,
	GetPalacementRoomVariantsWithTypesQuery,
	GetPlacementRoomVariantByAllParametersQuery,
} from '@api-gen';
import { fetchApi } from '@api-gen';
import type { PaginationState } from '@core';
import type { GuideBooksCreateDataTypes, GuidebooksFiltersDataTypes } from '../types';
import { Guidebooks } from '../types';

type BaseProps = {
	guidebookType: Guidebooks;
	// converter: (result: GuidebooksType) => GuidebooksType; Идея есть как сделать нет
};

type PaginatedProps = BaseProps & {
	data: GuidebooksFiltersDataTypes;
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>;
};

type CreateAndEditProps = BaseProps & { data: GuideBooksCreateDataTypes };

type DeleteProps = BaseProps & { data: { id: string } };

type DetailProps = BaseProps & { id: string };

const getGuidebooksPaginatedApiMap = {
	[Guidebooks.ISSUER]: fetchApi.api.issuerGetPaginatedCreate,
	[Guidebooks.CONSTRUCTION]: fetchApi.api.constructionGetPaginatedCreate,
	[Guidebooks.MATERIAL]: fetchApi.api.materialGetPaginatedCreate,
	[Guidebooks.REQUIREMENT]: fetchApi.api.requirementGetPaginatedCreate,
};

const getGuidebooksDetailApiMap = {
	[Guidebooks.ISSUER]: fetchApi.api.issuerDetail,
	[Guidebooks.CONSTRUCTION]: fetchApi.api.constructionDetail,
	[Guidebooks.MATERIAL]: fetchApi.api.materialDetail,
	[Guidebooks.REQUIREMENT]: fetchApi.api.requirementDetail,
};

const getGuidebooksCreateApiMap = {
	[Guidebooks.ISSUER]: fetchApi.api.issuerCreate,
	[Guidebooks.CONSTRUCTION]: fetchApi.api.constructionCreate,
	[Guidebooks.MATERIAL]: fetchApi.api.materialCreate,
	[Guidebooks.REQUIREMENT]: fetchApi.api.requirementCreate,
};

const getGuidebooksEditApiMap = {
	[Guidebooks.ISSUER]: fetchApi.api.issuerUpdate,
	[Guidebooks.CONSTRUCTION]: fetchApi.api.constructionUpdate,
	[Guidebooks.MATERIAL]: fetchApi.api.materialUpdate,
	[Guidebooks.REQUIREMENT]: fetchApi.api.requirementUpdate,
};

const getGuidebooksDeleteApiMap = {
	[Guidebooks.ISSUER]: fetchApi.api.issuerDelete,
	[Guidebooks.CONSTRUCTION]: fetchApi.api.constructionDelete,
	[Guidebooks.MATERIAL]: fetchApi.api.materialDelete,
	[Guidebooks.REQUIREMENT]: fetchApi.api.requirementDelete,
};

export const getGuidebooksPaginated = async ({
	data,
	guidebookType,
	pagination,
}: PaginatedProps) => {
	return await getGuidebooksPaginatedApiMap[guidebookType]({
		...data,
		pageNumber: pagination.pageNumber,
		pageSize: pagination.pageSize,
	});
};

export const getGuidebooksDetail = async ({ id, guidebookType }: DetailProps) => {
	return await getGuidebooksDetailApiMap[guidebookType](id);
};

export const getGuidebooksCreate = async ({ data, guidebookType }: CreateAndEditProps) => {
	return await getGuidebooksCreateApiMap[guidebookType](data);
};

export const getGuidebooksEdit = async ({ data, guidebookType }: CreateAndEditProps) => {
	return await getGuidebooksEditApiMap[guidebookType](data);
};

export const getGuidebooksDelete = async ({ data, guidebookType }: DeleteProps) => {
	return await getGuidebooksDeleteApiMap[guidebookType](data);
};

export const getGuidebooksMaterialTypes = async () => {
	return await fetchApi.api.materialTypeList();
};

export const getGuidebooksConstructionTypes = async () => {
	return await fetchApi.api.constructionConstructionTypesList();
};

export const getRegulatoryRequirementDocuments = async () => {
	return await fetchApi.api.regulatoryRequirementDocumentList();
};

export const getCalculationRequirementDocuments = async () => {
	return await fetchApi.api.calculationRequirementDocumentList();
};

export const getFirstPlacementRoomVariant = async (
	data: GetPalacementRoomVariantsWithTypesQuery,
) => {
	return await fetchApi.api.placementRoomVariantsCreate(data);
};

export const getSecondRoomVariant = async (data: GetPlacementRoomVariantByAllParametersQuery) => {
	return await fetchApi.api.placementRoomVariantsGetSecondRoomCreate(data);
};

export const importMaterials = async (data: { formFile: File }) => {
	return await fetchApi.api.importExcelFileCreate(data);
};

export const exportMaterials = async (data: ExportMaterialsQuery) => {
	return await fetchApi.api.materialExportCreate(data, { format: 'blob' });
};

export const exportRequirements = async (data: ExportRequirementQuery) => {
	return await fetchApi.api.requirementExportCreate(data, { format: 'blob' });
};
