import type { DocumentReportFlagsDto, FinalizeReportInfoCommand } from '@api-gen';
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
