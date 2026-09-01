import {
	ConstructionPosition,
	ConstructionPurpose,
	IndexType,
	type ConstructionAdditionalInfoDto,
	type ConstructionLaboratoryDataDto,
	type ConstructionTypeEnum as ServerConstructionTypeEnum,
	type CountryType,
	type RTotalDto,
} from '@api-gen';
import {
	convertToClientCountryData,
	convertToClientIndexTypeData,
	convertToServerCountryData,
	convertToServerPriorityData,
	resolveClientPriorityValue,
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
import { normalizeAttachments } from '@core/utils/helpers/file-display-name.helper';
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

const mapLaboratoryIndexValueToClient = (
	lab?: ConstructionLaboratoryDataDto | null,
	expectedIndex?: IndexType,
): string => {
	if (lab?.indexValue == null || !Number.isFinite(Number(lab.indexValue))) {
		return '';
	}
	if (expectedIndex && lab.index && lab.index !== expectedIndex) {
		return '';
	}
	return String(Math.round(Number(lab.indexValue)));
};

/** Rw из detail (`rw`), списка (`labR`) или `airNoiseLaboratoryData.indexValue`. */
const mapConstructionRwToClient = (data: {
	rw?: number | string | null;
	labR?: number | string | null;
	airNoiseLaboratoryData?: ConstructionLaboratoryDataDto | null;
}): string => {
	if (data.rw != null && data.rw !== '') {
		const n = Number(data.rw);
		if (Number.isFinite(n)) return String(Math.round(n));
	}

	const fromLab = mapLaboratoryIndexValueToClient(data.airNoiseLaboratoryData, IndexType.Rw);
	if (fromLab) return fromLab;

	const raw = data.labR;
	if (raw == null || raw === '') return '';
	const n = Number(raw);
	if (!Number.isFinite(n)) return '';
	return String(Math.round(n));
};

/** Lnw из detail (`lnw`) или `impactNoiseLaboratoryData.indexValue`. */
const mapConstructionLnwToClient = (data: {
	lnw?: number | string | null;
	impactNoiseLaboratoryData?: ConstructionLaboratoryDataDto | null;
}): string => {
	if (data.lnw != null && data.lnw !== '') {
		const n = Number(data.lnw);
		if (Number.isFinite(n)) return String(Math.round(n));
	}

	return mapLaboratoryIndexValueToClient(data.impactNoiseLaboratoryData, IndexType.Lnw);
};

const normalizeMaterialParameterFromApi = (
	param: string | undefined | null,
	materialType?: string | null,
): string => {
	const value = String(param ?? '').trim();
	if (!value) return '';
	if (value === 'Width' && materialType === MaterialTypeEnum.Frame) {
		return 'Thickness';
	}
	return value;
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

const linesToArray = (value?: string | null): string[] =>
	String(value ?? '')
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);

const arrayToLines = (value?: string[] | null): string =>
	Array.isArray(value) ? value.filter(Boolean).join('\n') : '';

export const mapConstructionAdditionalInfoFromApi = (
	data?: ConstructionAdditionalInfoDto | Record<string, unknown> | null,
) => {
	const raw = (data ?? null) as Record<string, unknown> | null;

	return {
		suppliers: arrayToLines((raw?.suppliers ?? raw?.Suppliers) as string[] | null | undefined),
		standartName: String(raw?.standartName ?? raw?.StandartName ?? ''),
		composition: arrayToLines((raw?.composition ?? raw?.Composition) as string[] | null | undefined),
		features: arrayToLines((raw?.features ?? raw?.Features) as string[] | null | undefined),
		physicalCharacteristics: arrayToLines(
			(raw?.physicalCharacteristics ?? raw?.PhysicalCharacteristics) as string[] | null | undefined,
		),
		fireSafetyAndMore: arrayToLines(
			(raw?.fireSafetyAndMore ?? raw?.FireSafetyAndMore) as string[] | null | undefined,
		),
		installation: arrayToLines((raw?.installation ?? raw?.Installation) as string[] | null | undefined),
		fileUrls: normalizeAttachments(
			raw?.fileUrls ?? raw?.FileUrls ?? raw?.files ?? raw?.Files,
		),
		imageUrls: normalizeAttachments(
			raw?.imageUrls ?? raw?.ImageUrls ?? raw?.images ?? raw?.Images,
		),
		files: [],
		images: [],
	};
};

const mapAdditionalInfoFromApi = mapConstructionAdditionalInfoFromApi;

const mapAdditionalInfoTextFieldsToServer = (
	info: ConstructionsAddData['additionalInfo'],
) => ({
	suppliers: linesToArray(info?.suppliers),
	standartName: info?.standartName || undefined,
	composition: linesToArray(info?.composition),
	features: linesToArray(info?.features),
	physicalCharacteristics: linesToArray(info?.physicalCharacteristics),
	fireSafetyAndMore: linesToArray(info?.fireSafetyAndMore),
	installation: linesToArray(info?.installation),
});

const mapCreateAdditionalInfoToServer = (data: ConstructionsAddData) => {
	if (!data.additionalInfo) return {};
	return {
		createConstructionAdditionalInformationDto: mapAdditionalInfoTextFieldsToServer(
			data.additionalInfo,
		),
	};
};

const mapUpdateAdditionalInfoToServer = (data: ConstructionsEditData) => {
	if (!data.additionalInfo) return {};
	return {
		updateConstructionAdditionalInformationDto: mapAdditionalInfoTextFieldsToServer(
			data.additionalInfo,
		),
	};
};

export const getConstructionAdditionalInfoFilesUpload = (data: ConstructionsAddData) => {
	const info = data.additionalInfo;
	const files = ((info?.files ?? []) as File[]).filter((file) => file instanceof File);
	const images = ((info?.images ?? []) as File[]).filter((file) => file instanceof File);
	return { files, images };
};

/** Параметры пагинации конструкций; расширения сверх OpenAPI передаются как есть. */
export const convertToServerConstructionsFilterData = (data: ConstructionsFilterData): any => ({
	// В таблице «Название» = description, поэтому фильтр name уходит в description.
	description: data.name || null,
	...(data.constructionType ? { constructionType: data.constructionType } : {}),
	countryType: (convertToServerCountryData(data.country as Country) as CountryType) || null,
	...(data.priority
		? { priority: convertToServerPriorityData(data.priority as Priority) }
		: {}),
	rw: parseFilterNumber(data.rw),
	lnw: parseFilterNumber(data.lnw),
	...(data.issuer ? { issuerId: data.issuer } : {}),
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
	const constructionTypeBlock =
		typeof data.constructionType === 'string'
			? { constructionTypeEnum: data.constructionType, constructions: [] }
			: data.constructionType;

	const constructionTypeObject = constructionTypeBlock
		? convertToClientConstructionType(constructionTypeBlock)
		: { constructionTypeEnum: '' as ConstructionTypeEnum };

	const constructionType =
		constructionTypeObject.constructionTypeEnum ||
		resolveClientConstructionTypeEnum(constructionTypeBlock);

	return {
		id: data.id ?? '',
		name: data.name ?? '',
		description: data.description ?? '',
		priority: resolveClientPriorityValue(data.priority),
		descriptionSource: data.descriptionSource ?? '',
		country: Array.isArray(data.countries)
			? (convertToClientCountryData(data.countries) as string[])
			: [],
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
		issuer: data.issuerId ?? data.issuer?.id ?? '',
		issuerName: data.issuer?.name ?? '',
		rw: mapConstructionRwToClient(data),
		lnw: mapConstructionLnwToClient(data),
		isViewForDefaultUser: Boolean(data.isViewForDefaultUser),
		isView: data.isView !== undefined ? Boolean(data.isView) : undefined,
		additionalInfo: mapAdditionalInfoFromApi(null),
	};
};

export const convertToClientConstructionsEditData = (data: any): ConstructionsEditData => {
	const base = convertToClientConstructionsAddData(data);
	return {
		...base,
		airLaboratory: base.airLaboratory ?? mapLaboratoryBlockFromApi(undefined),
		impactLaboratory: base.impactLaboratory ?? mapLaboratoryBlockFromApi(undefined),
		RCalcs: mapConstructionRwToClient(data),
		estimatedIndexValue: String(data.computingIndexValue ?? ''),
	};
};

export const convertToServerConstructionType = (
	data: ConstructionType,
): any => ({
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
									materialParametrs: normalizeMaterialParameterFromApi(
										mtv.materialParameters,
										m.materialType,
									) as MaterialParametrs,
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
									materialParametrs: normalizeMaterialParameterFromApi(
										mtv.materialParameters,
										m.materialType,
									) as MaterialParametrs,
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
									materialParametrs: normalizeMaterialParameterFromApi(
										mtv.materialParameters,
										m.materialType,
									) as MaterialParametrs,
								})) ?? [],
						})),
					},
				]
			: []),
	],
});

export type MappedUserMaterial = {
	materialId: string;
	materialName: string;
	additionalName: string | null;
	positionId: string;
	materialType: string;
	materialTypeValue: Array<{ value: string; materialParameters: string }>;
};

const mapUserMaterialFromApi = (userMaterial: any): MappedUserMaterial => ({
	materialId: userMaterial.materialId ?? '',
	materialName: userMaterial.materialName || '',
	additionalName: userMaterial.additionalName ?? null,
	positionId: String(userMaterial.positionId ?? ''),
	materialType: userMaterial.materialType ?? '',
	materialTypeValue:
		userMaterial.materialTypeValue?.map((mtv: any) => ({
			value: String(mtv.value ?? ''),
			materialParameters: normalizeMaterialParameterFromApi(
				mtv.materialParametr ?? mtv.materialParametrs ?? mtv.materialParameters,
				userMaterial.materialType,
			),
		})) ?? [],
});

export const convertToClientConstructionType = (data: any): ConstructionType => {
	const constructionTypeEnum =
		convertToClientConstructionTypeEnumData(
			data.constructionTypeEnum as ServerConstructionTypeEnum,
		) ?? '';

	const leftRaw =
		data.constructions?.find((c: any) => c.constructionPosition === 'Left')?.userMaterials ||
		[];

	const centerRaw =
		data.constructions?.find((c: any) => c.constructionPosition === 'Center')?.userMaterials ||
		[];

	const rightRaw =
		data.constructions?.find((c: any) => c.constructionPosition === 'Right')?.userMaterials ||
		[];

	let leftConstruction = leftRaw.map(mapUserMaterialFromApi);
	let rightConstruction = rightRaw.map(mapUserMaterialFromApi);

	const normalized = normalizeVerticalCladdingForConstructionType(
		constructionTypeEnum,
		leftConstruction,
		rightConstruction,
	);

	return {
		constructionTypeEnum,
		leftConstruction: normalized.left,
		centerConstruction: centerRaw.map(mapUserMaterialFromApi),
		rightConstruction: normalized.right,
	};
};

type ConstructionLaboratoryFormData = {
	rTotal: number[];
	laboratoryTestSource: string;
	index?: IndexType;
};

const packLaboratoryCreateDto = (
	block: ConstructionsAddData['airLaboratory'],
): ConstructionLaboratoryFormData | undefined => {
	if (!block) {
		return undefined;
	}

	const labRTotal = block.labRTotal?.trim() ?? '';
	const labIndex = block.labIndex?.trim() ?? '';
	const laboratoryTestSource = block.laboratoryTestSource?.trim() ?? '';

	if (!labRTotal && !labIndex && !laboratoryTestSource) {
		return undefined;
	}

	return {
		rTotal: labRTotal ? labRTotal.split(',').map((part: string) => +part.trim()) : [],
		laboratoryTestSource,
		index: (block.labIndex as IndexType) || undefined,
	};
};

const convertToServerConstructionsBaseData = (data: ConstructionsAddData): any => ({
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
	isViewForDefaultUser: Boolean(data.isViewForDefaultUser),
});

export const convertToServerConstructionsAddData = (data: ConstructionsAddData): any => ({
	...convertToServerConstructionsBaseData(data),
	...mapCreateAdditionalInfoToServer(data),
});

export const convertToServerConstructionsEditData = (data: ConstructionsEditData): any => ({
	...convertToServerConstructionsBaseData(data),
	id: data.id || null,
	rw: data.RCalcs || null,
	reportInfoId: data.reportInfoId || undefined,
	conputingIndexValue: data.estimatedIndexValue || null,
	...mapUpdateAdditionalInfoToServer(data),
});

export const mergeConstructionAdditionalInfo = <
	T extends ConstructionsAddData | ConstructionsEditData,
>(
	data: T,
	additionalInfo?: ConstructionAdditionalInfoDto | null,
): T => {
	if (!additionalInfo) return data;
	return {
		...data,
		additionalInfo: mapAdditionalInfoFromApi(additionalInfo),
	};
};
