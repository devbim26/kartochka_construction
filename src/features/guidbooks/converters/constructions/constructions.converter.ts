import {
	ConstructionPosition,
	ConstructionPurpose,
	type ConstructionLaboratoryDataDto,
	type ConstructionTypeEnum as ServerConstructionTypeEnum,
	type CountryType,
	type CreateConstructionLaboratoryDataDto,
	type CreateConstructionTypeDto,
	type IndexType,
	type RTotalDto,
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
	ConstructionTypeTemplate,
	Country,
	Priority,
} from '@features/guidbooks/types';
import {
	ConstructionTypeEnum,
	isFloorConstructionType,
	MaterialTypeEnum,
} from '@features/guidbooks/types';
import { normalizeVerticalCladdingForConstructionType } from '@features/guidbooks/utils/cladding-layer-normalization.utils';
import {
	convertToClientConstructionTypeEnumData,
	convertToServerConstructionTypeEnumData,
} from './construction-type-enum.converter';

const parseMaterialNumericValue = (raw: string | undefined | null): number => {
	const text = String(raw ?? '').trim().replace(',', '.');
	if (!text) {
		return 0;
	}
	const n = Number(text);
	return Number.isFinite(n) ? n : 0;
};

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

/** Ответ детализации: rTotals (RTotalDto[]) и/или legacy rTotal: number[]. */
type LaboratoryReadDto = ConstructionLaboratoryDataDto & { rTotal?: number[] | null };

const rTotalsDtoToNumbers = (items?: RTotalDto[] | null): number[] | null => {
	if (!Array.isArray(items) || !items.length) return null;
	const rows = items
		.filter((x) => x?.value != null && Number.isFinite(Number(x.value)))
		.map((x, i) => ({ value: Number(x.value), index: x.index ?? i }));
	rows.sort((a, b) => a.index - b.index);
	return rows.map((x) => x.value);
};

const mapLaboratoryBlockFromApi = (
	lab: LaboratoryReadDto | undefined | null,
	legacyRTotal?: number[] | null,
) => {
	const fromTotals = rTotalsDtoToNumbers(lab?.rTotals);
	const totals = fromTotals ?? lab?.rTotal ?? legacyRTotal;
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

const resolveClientConstructionTypeEnum = (
	constructionTypeBlock: { constructionTypeEnum?: ServerConstructionTypeEnum } | null | undefined,
): ConstructionTypeEnum | '' => {
	if (!constructionTypeBlock?.constructionTypeEnum) return '';
	return (
		convertToClientConstructionTypeEnumData(constructionTypeBlock.constructionTypeEnum) ?? ''
	);
};

export const convertToClientConstructionsAddData = (data: any): ConstructionsAddData => {
	const constructionTypeObject = convertToClientConstructionType(data.constructionType!) ?? {
		constructionTypeEnum: '' as ConstructionTypeEnum,
	};
	const constructionType =
		constructionTypeObject.constructionTypeEnum ||
		resolveClientConstructionTypeEnum(data.constructionType);

	return {
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
		constructionType,
		constructionPurpose:
			(data.constructionPurpose as string) || ConstructionPurpose.Soundproofing,
		constructionTypeObject,
		issuer: data.issuerId ?? '',
		issuerName: data.issuer?.name ?? '',
		rw: data.rw != null && data.rw !== '' ? String(data.rw) : '',
		lnw: data.lnw != null && data.lnw !== '' ? String(data.lnw) : '',
	};
};

export const convertToClientConstructionsEditData = (data: any): ConstructionsEditData => {
	const base = convertToClientConstructionsAddData(data);
	return {
		...base,
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
									value: parseMaterialNumericValue(mtv.value),
									materialParametrs: mtv.materialParameters as MaterialParametrs,
								})) ?? [],
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
									value: parseMaterialNumericValue(mtv.value),
									materialParametrs: mtv.materialParameters as MaterialParametrs,
								})) ?? [],
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
									value: parseMaterialNumericValue(mtv.value),
									materialParametrs: mtv.materialParameters as MaterialParametrs,
								})) ?? [],
						})),
					},
				]
			: []),
	],
});

const FACING_ONE_SIDE_LAYER_ORDER: MaterialTypeEnum[] = [
	MaterialTypeEnum.AirGap,
	MaterialTypeEnum.Link,
	MaterialTypeEnum.Frame,
	MaterialTypeEnum.Filler,
	MaterialTypeEnum.Board,
];

const mapUserMaterialFromApi = (userMaterial: any) => ({
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
});

/** Облицовка справа, порядок positionId 0…4 от стены кнаружи. */
const normalizeFacingOneSideCladding = (
	materials: ReturnType<typeof mapUserMaterialFromApi>[],
) =>
	FACING_ONE_SIDE_LAYER_ORDER.map((materialType, index) => {
		const row = materials.find((m) => m.materialType === materialType);
		if (!row) return null;
		return { ...row, positionId: String(index) };
	}).filter((row): row is NonNullable<typeof row> => row != null);

export const convertToClientConstructionType = (data: any): ConstructionType => {
	const constructionTypeEnum =
		convertToClientConstructionTypeEnumData(
			data.constructionTypeEnum as ServerConstructionTypeEnum,
		) ?? '';

	let left =
		data.constructions?.find((c: any) => c.constructionPosition === 'Left')?.userMaterials ||
		[];

	let center =
		data.constructions?.find((c: any) => c.constructionPosition === 'Center')?.userMaterials ||
		[];

	let right =
		data.constructions?.find((c: any) => c.constructionPosition === 'Right')?.userMaterials ||
		[];

	if (constructionTypeEnum === ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide) {
		const claddingSource = left.length ? left : right;
		if (claddingSource.length) {
			right = normalizeFacingOneSideCladding(claddingSource.map(mapUserMaterialFromApi));
			left = [];
		}
	}

	const leftConstruction = left.map(mapUserMaterialFromApi);
	const rightConstruction = right.map(mapUserMaterialFromApi);
	const normalized = normalizeVerticalCladdingForConstructionType(
		constructionTypeEnum,
		leftConstruction,
		rightConstruction,
	);

	return {
		constructionTypeEnum,
		leftConstruction: normalized.left,
		centerConstruction: center.map(mapUserMaterialFromApi),
		rightConstruction: normalized.right,
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
