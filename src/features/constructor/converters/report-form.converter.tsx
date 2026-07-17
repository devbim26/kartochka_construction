import type { DocumentReportFlagsDto, FinalizeReportInfoCommand } from '@api-gen';
import type { FloorDocumentsFlagsSchemaType, FormReportSchemaType } from '../utils';

export const convertToClientReportFormFlags = (
	data: DocumentReportFlagsDto,
): FloorDocumentsFlagsSchemaType => {
	const soundBaseFlags = (data.soundInsulationCalculation?.baseReportInfoFlags ?? []).map(
		(baseFlag) => ({
			floorNumber: baseFlag?.floorNumber ?? null,
			takeFloor: baseFlag?.takeFloor ?? false,
			namedConstructionFlags: (baseFlag?.namedConstructionFlags ?? []).map((namedFlag) => ({
				reportConstructionId: namedFlag?.reportConstructionId,
				constructionName: namedFlag?.constructionName ?? null,
				takeConstruction: namedFlag?.takeConstruction ?? false,
			})),
		}),
	);
	return {
		takeTitleList: data.takeTitleList ?? false,
		takeContent: data.takeContent ?? false,
		takeIntroduction: data.takeIntroduction ?? false,
		soundInsulationCalculation: {
			takeEnclosingStructuresSoundInsulationCalculation:
				data.soundInsulationCalculation
					?.takeEnclosingStructuresSoundInsulationCalculation ?? false,
			baseReportInfoFlags: soundBaseFlags,
		},
		takeConclusion: data.takeConclusion ?? false,
		takeUsedLiteratureList: data.takeUsedLiteratureList ?? false,
		takeSupplementSoundInsulationProtocolsWithCalculation:
			data.takeSupplementSoundInsulationProtocolsWithCalculation ?? false,
		takeSupplementSoundInsulationAlternativeProtocols:
			data.takeSupplementSoundInsulationAlternativeProtocols ?? false,
	};
};

export const convertToServerReportFormFlags = (
	data: FormReportSchemaType,
): FinalizeReportInfoCommand => {
	const { logo: _logo, logoValue: _logoValue, floorDocumentFlags, ...rest } = data;
	const soundBaseFlags = (
		floorDocumentFlags.soundInsulationCalculation?.baseReportInfoFlags ?? []
	).map((baseFlag) => ({
		floorNumber: baseFlag.floorNumber ?? null,
		takeFloor: baseFlag.takeFloor ?? false,
		namedConstructionFlags: (baseFlag.namedConstructionFlags ?? []).map((namedFlag) => ({
			reportConstructionId: namedFlag.reportConstructionId,
			constructionName: namedFlag.constructionName ?? null,
			takeConstruction: namedFlag.takeConstruction ?? false,
		})),
	}));

	return {
		...rest,
		reportInfoId: data.reportInfoId,
		reportNumber: data.code || null,
		reportName: data.projectName || null,
		customerName: data.customerName || null,
		objectDescription: data.objectDescription || null,
		creatorFullName: data.creatorFullName || null,
		code: data.code || null,
		country: data.country || null,
		director: data.director || null,
		date: data.date || null,
		floorDocumentFlags: {
			...floorDocumentFlags,
			soundInsulationCalculation: {
				...floorDocumentFlags.soundInsulationCalculation,
				baseReportInfoFlags: soundBaseFlags,
			},
		},
	};
};
