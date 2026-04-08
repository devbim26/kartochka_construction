import {
	ConstructionPosition,
	type ConstructionTypeEnum as ServerConstructionTypeEnum,
	type CountryType,
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
import type { Country, Priority } from '@features/guidbooks/types';
import type {
	ConstructionsAddData,
	ConstructionsEditData,
	ConstructionsFilterData,
	ConstructionType,
	ConstructionTypeEnum,
	ConstructionTypeTemplate,
} from '@features/guidbooks/types/constructions';
import {
	convertToClientConstructionTypeEnumData,
	convertToServerConstructionTypeEnumData,
} from './construction-type-enum.converter';

export const convertToClientConstructionTypesList = (data: any): ConstructionTypeTemplate[] => {
	return data.map((data: any) => ({
		...data,
	}));
};

export const convertToServerConstructionsFilterData = (data: ConstructionsFilterData): any => ({
	name: data.name || null,
	shortName: data.constructionType || null,
	description: data.description || null,
	countryType: (convertToServerCountryData(data.country as Country) as CountryType) || null,
});

export const convertToClientConstructionsAddData = (data: any): ConstructionsAddData => ({
	id: data.id ?? '',
	name: data.name ?? '',
	description: data.description ?? '',
	priority: (convertToClientPriorityData(data.priority!) as string) ?? '',
	descriptionSource: data.descriptionSource ?? '',
	country: (convertToClientCountryData(data.countries!) as string[]) ?? [],
	maxHeight: String(data.maxHeight) ?? '',
	fireResistance: String(data.fireResistance) ?? '',
	propertySource: data.propertySource ?? '',
	labRTotal: data.rTotal ? data.rTotal.join(', ') : '',
	labIndex: (convertToClientIndexTypeData(data.index!) as string) ?? '',
	labIndexValue: String(data.laboratoryIndexValue) ?? '',
	constructionType: convertToClientConstructionTypeEnumData(data.constructionType) ?? '',
	constructionTypeObject: convertToClientConstructionType(data.constructionType!) ?? '',
	laboratoryTestSource: data.laboratoryTestSource ?? '',
	issuer: data.issuerId ?? '',
	issuerName: data.issuer?.name ?? '',
	laboratoryC: String(data.laboratoryC) ?? '',
	laboratoryCtr: String(data.laboratoryCtr) ?? '',
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
	rTotal: data.labRTotal.split(',').map((split) => +split) || null,
	index: (data.labIndex as IndexType) || null,
	laboratoryTestSource: data.laboratoryTestSource || null,
	constructionType: convertToServerConstructionType(data.constructionTypeObject) || null,
});

export const convertToServerConstructionsEditData = (data: ConstructionsEditData): any => ({
	...convertToServerConstructionsAddData(data),
	id: data.id || null,
	rw: data.RCalcs || null,
	reportInfoId: data.reportInfoId || undefined,
	conputingIndexValue: data.estimatedIndexValue || null,
});
