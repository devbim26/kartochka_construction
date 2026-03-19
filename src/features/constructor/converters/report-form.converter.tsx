import type { DocumentReportFlagsDto, FinalizeReportInfoCommand } from '@api-gen';
import type { FloorDocumentsFlagsSchemaType, FormReportSchemaType } from '../utils';

export const convertToClientReportFormFlags = (
	data: DocumentReportFlagsDto,
): FloorDocumentsFlagsSchemaType => {
	const soundBaseFlags = (data.soundInsulationCalculation?.baseReportInfoFlags ?? []).map(
		(baseFlag) => ({
			...baseFlag,
			namedConstructionFlags: baseFlag?.namedConstructionFlags ?? [],
		}),
	);
	const thermalBaseFlags = (data.thermalInsulationCalculation?.baseReportInfoFlags ?? []).map(
		(baseFlag) => ({
			...baseFlag,
			namedConstructionFlags: baseFlag?.namedConstructionFlags ?? [],
		}),
	);

	return {
		...data,
		generalCharacteristics: {
			takeRoomCharacteristic: data.generalCharacteristics?.takeRoomCharacteristic ?? false,
			takeWallMaterialsVolumesCalculation:
				data.generalCharacteristics?.takeWallMaterialsVolumesCalculation ?? false,
			takeFloorMaterialsVolumesCalculation:
				data.generalCharacteristics?.takeFloorMaterialsVolumesCalculation ?? false,
		},
		soundInsulationCalculation: {
			takeEnclosingStructuresSoundInsulationCalculation:
				data.soundInsulationCalculation
					?.takeEnclosingStructuresSoundInsulationCalculation ?? false,
			baseReportInfoFlags: soundBaseFlags,
		},
		thermalInsulationCalculation: {
			takeDetailedCalculatingMethod:
				data.thermalInsulationCalculation?.takeDetailedCalculatingMethod ?? false,
			baseReportInfoFlags: thermalBaseFlags,
		},
	};
};

export const convertToServerReportFormFlags = (
	data: FormReportSchemaType,
): FinalizeReportInfoCommand => {
	return {
		...data,
		reportInfoId: data.reportInfoId,
		reportNumber: data.code,
		reportName: data.projectName,
		customerName: data.customerName,
		objectDescription: data.objectDescription,
		creatorFullName: data.creatorFullName,
		code: data.code,
		country: data.country,
		director: data.director,
		date: data.date,
	};
};
