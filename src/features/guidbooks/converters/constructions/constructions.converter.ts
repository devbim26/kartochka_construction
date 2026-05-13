import {
	ConstructionPosition,
	ConstructionPurpose,
	type ConstructionLaboratoryDataDto,
	type ConstructionTypeEnum as ServerConstructionTypeEnum,
	type CountryType,
	type CreateConstructionLaboratoryDataDto,
	type CreateConstructionTypeDto,
	type IndexType,
} from '@api-gen';
import {
	convertToClientCountryData,
	convertToClientIndexTypeData,
	convertToClientPriorityData,
	convertToServerCountryData,
	convertToServerPriorityData,
} from '@core';
import type { MaterialParametrs } from '@features/constructor';
import type {
	ConstructionsAddData,
	ConstructionsEditData,
	ConstructionsFilterData,
	ConstructionType,
	ConstructionTypeEnum,
	ConstructionTypeTemplate,
	Country,
	Priority,
} from '@features/guidbooks/types';
import { isFloorConstructionType } from '@features/guidbooks/types';
import {
	convertToClientConstructionTypeEnumData,
	convertToServerConstructionTypeEnumData,
} from './construction-type-enum.converter';

export const convertToClientConstructionTypesList = (data: any): ConstructionTypeTemplate[] => {
	return data.map((data: any) => ({
		...data,
	}));
};

const parseFilterNumber = (value: string): number | null => {
	const t = (value ?? '').trim();
	if (!t) return null;
	const n = Number(t.replace(',', '.'));
	return Number.isFinite(n) ? n : null;
};

/** Параметры пагинации конструкций; расширения сверх OpenAPI передаются как есть. */
export const convertToServerConstructionsFilterData = (data: ConstructionsFilterData): any => ({
	name: data.name || null,
	shortName: data.constructionType || null,
	countryType: (convertToServerCountryData(data.country as Country) as CountryType) || null,
	...(data.priority
		? { priority: convertToServerPriorityData(data.priority as Priority) }
		: {}),
	rw: parseFilterNumber(data.rw),
	lnw: parseFilterNumber(data.lnw),
	...(data.constructionPurpose
		? { constructionPurpose: data.constructionPurpose as ConstructionPurpose }
		: {}),
});

/** Ответ детализации может содержать r_total внутри лабораторного блока (расширение поверх OpenAPI). */
type LaboratoryReadDto = ConstructionLaboratoryDataDto & { rTotal?: number[] | null };

const mapLaboratoryBlockFromApi = (
	lab: LaboratoryReadDto | undefined | null,
	legacyRTotal?: number[] | null,
) => {
	const totals = lab?.rTotal ?? legacyRTotal;
	const labRTotal =
		Array.isArray(totals) && totals.length ? totals.map((n) => String(n)).join(', ') : '';
	return {
		labRTotal,
		labIndex:
			lab?.index != null ? ((convertToClientIndexTypeData(lab.index) as string) ?? '') : '',
		labIndexValue:
			lab?.indexValue != null && Number.isFinite(lab.indexValue) ? String(lab.indexValue) : '',
		laboratoryTestSource: lab?.laboratoryTestSource ?? '',
		laboratoryC: lab?.laboratoryC != null ? String(lab.laboratoryC) : '',
		laboratoryCtr: lab?.laboratoryCtr != null ? String(lab.laboratoryCtr) : '',
	};
};

export const convertToClientConstructionsAddData = (data: any): ConstructionsAddData => ({
	id: data.id ?? '',
	name: data.name ?? '',
	description: data.description ?? '',
	priority:
		data.priority != null && data.priority !== ''
			? (convertToClientPriorityData(data.priority) as string)
			: '',
	descriptionSource: data.descriptionSource ?? '',
	country: (convertToClientCountryData(data.countries!) as string[]) ?? [],
	maxHeight: String(data.maxHeight) ?? '',
	fireResistance: String(data.fireResistance) ?? '',
	propertySource: data.propertySource ?? '',
	airLaboratory: mapLaboratoryBlockFromApi(
		data.airNoiseLaboratoryData as LaboratoryReadDto | undefined,
		data.rTotal,
	),
	impactLaboratory: mapLaboratoryBlockFromApi(
		data.impactNoiseLaboratoryData as LaboratoryReadDto | undefined,
	),
	constructionType: convertToClientConstructionTypeEnumData(data.constructionType) ?? '',
	constructionPurpose:
		(data.constructionPurpose as string) || ConstructionPurpose.Soundproofing,
	constructionTypeObject: convertToClientConstructionType(data.constructionType!) ?? '',
	issuer: data.issuerId ?? '',
	issuerName: data.issuer?.name ?? '',
	rw: data.rw != null && data.rw !== '' ? String(data.rw) : '',
	lnw: data.lnw != null && data.lnw !== '' ? String(data.lnw) : '',
});

export const convertToClientConstructionsEditData = (data: any): ConstructionsEditData => {
	return {
		...convertToClientConstructionsAddData(data),
		constructionType: data.constructionType.constructionTypeEnum ?? '',
		RCalcs: String(data.rw) ?? '',
		estimatedIndexValue: String(data.computingIndexValue) ?? '',
	};
};

export const convertToServerConstructionType = (
	data: ConstructionType,
): CreateConstructionTypeDto => ({
	constructionTypeEnum: convertToServerConstructionTypeEnumData(
		data.constructionTypeEnum as ConstructionTypeEnum,
	),
	constructions: [
		...(data.leftConstruction
			? [
					{
						constructionPosition: ConstructionPosition.Left,
						userMaterials: data.leftConstruction.map((m) => ({
							materialId: m.materialId,
							materialName: m.materialName || '',
							additionalName: m.additionalName ?? '',
							positionId: Number(m.positionId),
							materialType: m.materialType,
							materialTypeValue:
								m.materialTypeValue?.map((mtv) => ({
									value: Number(mtv.value),
									materialParametrs: mtv.materialParameters as MaterialParametrs,
								})) || [],
						})),
					},
				]
			: []),
		...(data.centerConstruction
			? [
					{
						constructionPosition: ConstructionPosition.Center,
						userMaterials: data.centerConstruction.map((m) => ({
							materialId: m.materialId,
							materialName: m.materialName || '',
							additionalName: m.additionalName ?? '',
							positionId: Number(m.positionId),
							materialType: m.materialType,
							materialTypeValue:
								m.materialTypeValue?.map((mtv) => ({
									value: Number(mtv.value),
									materialParametrs: mtv.materialParameters as MaterialParametrs,
								})) || [],
						})),
					},
				]
			: []),
		...(data.rightConstruction
			? [
					{
						constructionPosition: ConstructionPosition.Right,
						userMaterials: data.rightConstruction.map((m) => ({
							materialId: m.materialId,
							materialName: m.materialName || '',
							additionalName: m.additionalName ?? '',
							positionId: Number(m.positionId),
							materialType: m.materialType,
							materialTypeValue:
								m.materialTypeValue?.map((mtv) => ({
									value: Number(mtv.value),
									materialParametrs: mtv.materialParameters as MaterialParametrs,
								})) || [],
						})),
					},
				]
			: []),
	],
});

export const convertToClientConstructionType = (data: any): ConstructionType => {
	const left =
		data.constructions?.find((c: any) => c.constructionPosition === 'Left')?.userMaterials ||
		[];

	const center =
		data.constructions?.find((c: any) => c.constructionPosition === 'Center')?.userMaterials ||
		[];

	const right =
		data.constructions?.find((c: any) => c.constructionPosition === 'Right')?.userMaterials ||
		[];

	return {
		constructionTypeEnum:
			convertToClientConstructionTypeEnumData(
				data.constructionTypeEnum as ServerConstructionTypeEnum,
			) ?? '',
		leftConstruction: left.map((userMaterial: any) => ({
			materialId: userMaterial.materialId ?? '',
			materialName: userMaterial.materialName || '',
			additionalName: userMaterial.additionalName ?? null,
			positionId: String(userMaterial.positionId ?? ''),
			materialType: userMaterial.materialType ?? '',
			materialTypeValue:
				userMaterial.materialTypeValue?.map((mtv: any) => ({
					value: String(mtv.value ?? ''),
					materialParameters: String(mtv.materialParametrs ?? ''),
				})) || [],
		})),
		centerConstruction: center.map((userMaterial: any) => ({
			materialId: userMaterial.materialId ?? '',
			materialName: userMaterial.materialName || '',
			additionalName: userMaterial.additionalName ?? null,
			positionId: String(userMaterial.positionId ?? ''),
			materialType: userMaterial.materialType ?? '',
			materialTypeValue:
				userMaterial.materialTypeValue?.map((mtv: any) => ({
					value: String(mtv.value ?? ''),
					materialParameters: String(mtv.materialParametrs ?? ''),
				})) || [],
		})),
		rightConstruction: right.map((userMaterial: any) => ({
			materialId: userMaterial.materialId ?? '',
			materialName: userMaterial.materialName || '',
			additionalName: userMaterial.additionalName ?? null,
			positionId: String(userMaterial.positionId ?? ''),
			materialType: userMaterial.materialType ?? '',
			materialTypeValue:
				userMaterial.materialTypeValue?.map((mtv: any) => ({
					value: String(mtv.value ?? ''),
					materialParameters: String(mtv.materialParametrs ?? ''),
				})) || [],
		})),
	};
};

const packLaboratoryCreateDto = (block: ConstructionsAddData['airLaboratory']): CreateConstructionLaboratoryDataDto => ({
	rTotal: block.labRTotal.split(',').map((split) => +String(split).trim()),
	laboratoryTestSource: block.laboratoryTestSource || null,
	index: (block.labIndex as IndexType) || undefined,
});

export const convertToServerConstructionsAddData = (data: ConstructionsAddData): any => ({
	name: data.name || null,
	description: data.description || null,
	priority: convertToServerPriorityData(data.priority as Priority) || null,
	descriptionSource: data.descriptionSource || null,
	countries: (convertToServerCountryData(data.country as Country[]) as CountryType[]) || null,
	issuerId: data.issuer || undefined,
	maxHeight: +data.maxHeight || undefined,
	fireResistance: data.fireResistance || null,
	propertySource: data.propertySource || null,
	airNoizeLaboratoryData: packLaboratoryCreateDto(data.airLaboratory),
	impactNoizeLaboratoryData: isFloorConstructionType(data.constructionType)
		? packLaboratoryCreateDto(data.impactLaboratory)
		: undefined,
	constructionPurpose: (data.constructionPurpose as ConstructionPurpose) || undefined,
	constructionType: convertToServerConstructionType(data.constructionTypeObject) || null,
});

export const convertToServerConstructionsEditData = (data: ConstructionsEditData): any => ({
	...convertToServerConstructionsAddData(data),
	id: data.id || null,
	rw: data.RCalcs || null,
	reportInfoId: data.reportInfoId || undefined,
	conputingIndexValue: data.estimatedIndexValue || null,
});
