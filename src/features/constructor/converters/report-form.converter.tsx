import type {
	DocumentReportFlagsDto,
	SoundInsulationFloorReportInfoFlagsDto,
	ThermalInsulationFloorReportInfoFlagsDto,
} from '@api-gen';
import type { FloorDocumentsFlagsSchemaType, FormReportSchemaType } from '../utils';

export const convertToClientReportFormFlags = (
	data: DocumentReportFlagsDto,
): FloorDocumentsFlagsSchemaType => {
	return {
		...data,
	};
};

export const convertToServerReportFormFlags = (
	data: FormReportSchemaType,
): {
	reportInfoId?: string;
	reportNumber?: string;
	reportName?: string;
	customerName?: string;
	objectDescription?: string;
	creatorFullName?: string;
	code?: string;
	country?: string;
	director?: string;
	date?: string;
	logo?: File;
	'floorDocumentFlags.takeTitleList'?: boolean;
	'floorDocumentFlags.takeContent'?: boolean;
	'floorDocumentFlags.takeIntroduction'?: boolean;
	'floorDocumentFlags.generalCharacteristics.takeRoomCharacteristic'?: boolean;
	'floorDocumentFlags.generalCharacteristics.takeWallMaterialsVolumesCalculation'?: boolean;
	'floorDocumentFlags.generalCharacteristics.takeFloorMaterialsVolumesCalculation'?: boolean;
	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation'?: boolean;
	'floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags'?: SoundInsulationFloorReportInfoFlagsDto[];
	'floorDocumentFlags.thermalInsulationCalculation.takeDetailedCalculatingMethod'?: boolean;
	'floorDocumentFlags.thermalInsulationCalculation.baseReportInfoFlags'?: ThermalInsulationFloorReportInfoFlagsDto[];
	'floorDocumentFlags.takeConclusion'?: boolean;
	'floorDocumentFlags.takeUsedLiteratureList'?: boolean;
	'floorDocumentFlags.takeSupplementSoundInsulationProtocolsWithCalculation'?: boolean;
	'floorDocumentFlags.takeSupplementThermalInsulationProtocolsWithCalculation'?: boolean;
} => {
	return {
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
		logo: data.logo,
		'floorDocumentFlags.takeTitleList': data.floorDocumentsFlags.takeTitleList,
		'floorDocumentFlags.takeContent': data.floorDocumentsFlags.takeContent,
		'floorDocumentFlags.takeIntroduction': data.floorDocumentsFlags.takeIntroduction,
		'floorDocumentFlags.generalCharacteristics.takeRoomCharacteristic':
			data.floorDocumentsFlags.generalCharacteristics?.takeRoomCharacteristic,
		'floorDocumentFlags.generalCharacteristics.takeWallMaterialsVolumesCalculation':
			data.floorDocumentsFlags.generalCharacteristics?.takeWallMaterialsVolumesCalculation,
		'floorDocumentFlags.generalCharacteristics.takeFloorMaterialsVolumesCalculation':
			data.floorDocumentsFlags.generalCharacteristics?.takeFloorMaterialsVolumesCalculation,
		'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation':
			data.floorDocumentsFlags.soundInsulationCalculation
				?.takeEnclosingStructuresSoundInsulationCalculation,
		'floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags':
			data.floorDocumentsFlags.soundInsulationCalculation?.baseReportInfoFlags || [],
		'floorDocumentFlags.thermalInsulationCalculation.takeDetailedCalculatingMethod':
			data.floorDocumentsFlags.thermalInsulationCalculation?.takeDetailedCalculatingMethod,
		'floorDocumentFlags.thermalInsulationCalculation.baseReportInfoFlags':
			data.floorDocumentsFlags.thermalInsulationCalculation?.baseReportInfoFlags || [],
		'floorDocumentFlags.takeConclusion': data.floorDocumentsFlags.takeConclusion,
		'floorDocumentFlags.takeUsedLiteratureList':
			data.floorDocumentsFlags.takeUsedLiteratureList,
		'floorDocumentFlags.takeSupplementSoundInsulationProtocolsWithCalculation':
			data.floorDocumentsFlags.takeSupplementSoundInsulationProtocolsWithCalculation,
		'floorDocumentFlags.takeSupplementThermalInsulationProtocolsWithCalculation':
			data.floorDocumentsFlags.takeSupplementThermalInsulationProtocolsWithCalculation,
	};
};
